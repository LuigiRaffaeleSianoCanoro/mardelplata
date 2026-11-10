#!/usr/bin/env python3
"""Fail-closed pre-publish gate for social posts (IG / X), portable version.

Checks the EXACT final text that will be published for: leaked internal notes,
placeholders, draft labels, meta/assistant chatter, markdown, LLM tropes,
contact data (emails/phones), per-network limits (network_rules.json),
event date/time consistency, and that every link responds.

Usage: python3 prepublish_check.py --network ig|x --file post.txt
         [--style spotlight] [--event-date 2026-11-13 --event-time 18:00]
         [--reply-file reply1.txt ...] [--quote] [--media] [--no-links]
Patterns live in leak_patterns.txt (same folder); add per-project brand
patterns there (see PROJECT_CONTENT_RULES.md of each repo).
Prints PASS or FAIL + every reason. Exit 0 only on PASS. Any internal error => FAIL.
"""
import argparse, json, os, re, sys, unicodedata, urllib.request, urllib.error, ssl

HERE = os.path.dirname(os.path.abspath(__file__))
PATTERNS_FILE = os.path.join(HERE, "leak_patterns.txt")
RULES_FILE = os.path.join(HERE, "network_rules.json")
EMOJI_RE = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\U0001F1E6-\U0001F1FF]")
WARNINGS = []
URL_RE = re.compile(r"https?://[^\s<>\"']+", re.I)
BARE_DOMAIN_RE = re.compile(r"(?<![\w@/.-])((?:[a-z0-9-]+\.)+(?:ar|com|dev|io|org|net|app|co|ma|ly)(?:/[^\s]*)?)(?![\w@-])", re.I)
MONTHS = {m: i + 1 for i, m in enumerate(
    "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split())}
MONTHS["setiembre"] = 9


def norm(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.replace("\u2019", "'").replace("\u00a1", "!")  # keep ¿ etc. harmless


def load_patterns():
    pats = []
    with open(PATTERNS_FILE, encoding="utf-8") as f:
        for line in f:
            if not line.strip() or line.startswith("#"):
                continue
            cat, flags, rx = line.rstrip("\n").split("\t", 2)
            fl = (re.I if "i" in flags else 0) | (re.M if "m" in flags else 0)
            pats.append((cat, rx, re.compile(rx, fl)))
    if not pats:
        raise RuntimeError("no patterns loaded")
    return pats


def strip_ok_urls(text):
    # Hook for per-project URL allow-lists (currently a no-op).
    return text


VOSEO_OK = ("revisá",)  # accented voseo imperatives that collapse onto meta words after norm()
QUOTE_TCO_RE = re.compile(r"\s*https?://t\.co/\w+\s*$", re.I)


def is_voseo_false_positive(text, matched):
    """True if a meta match only exists because norm() stripped the accent of a voseo
    form (e.g. 'Revisá' -> 'revisa'). An unaccented 'revisa' in the original still counts."""
    w = matched.strip().lower()
    orig = unicodedata.normalize("NFC", text).lower()
    if not any(norm(v) == w for v in VOSEO_OK):
        return False
    return not re.search(r"(?<!\w)" + re.escape(w) + r"(?!\w)", orig)


def strip_quote_tco(text):
    """X auto-appends the quoted post / attached media (pic.x.com) as a trailing t.co link;
    drop only that final one."""
    return QUOTE_TCO_RE.sub("", text)


LINK_BIO_RE = r"link en (la )?bio"
SUMATE_RE = r"\bsumate\b"


def count_ctas(n, patterns):
    """Distinct CTA patterns, but 'sumate ... (link en la bio)' in the same line/sentence is ONE
    invitation: the 'link en bio' is just where the 'sumate' points to."""
    ctas = [p for p in patterns if re.search(p, n)]
    if LINK_BIO_RE in ctas and SUMATE_RE in ctas:
        segs = re.split(r"\n+|(?<=[.!?])\s+", n)
        bio_segs = [sg for sg in segs if re.search(LINK_BIO_RE, sg)]
        if bio_segs and all(re.search(SUMATE_RE, sg) for sg in bio_segs):
            ctas.remove(LINK_BIO_RE)
    return ctas


def check_patterns(text, pats):
    reasons = []
    n = norm(text)
    no_urls = URL_RE.sub(" ", n)  # URLs checked separately (they may contain e.g. 'v2' or '-')
    for cat, rx, cre in pats:
        target = n if cat in ("brand",) else no_urls
        for m in cre.finditer(target):
            if cat == "meta" and is_voseo_false_positive(text, m.group(0)):
                continue
            reasons.append(f"[{cat}] matched /{rx}/ -> {m.group(0).strip()!r}")
    return reasons


def check_phones(text):
    r = []
    for m in re.finditer(r"(?<![\w/])\+?\(?\d[\d\s().-]{6,}\d(?![\w/])", URL_RE.sub(" ", text)):
        if sum(c.isdigit() for c in m.group(0)) >= 8:
            r.append(f"[contact] phone number -> {m.group(0).strip()!r}")
    return r


def x_length(text):
    return len(URL_RE.sub("x" * 23, text))


def check_length(text, network, style, rules, replies=(), quote=False, media=False):
    r = []
    R = rules[network]; B = rules["both"]
    n = norm(text).lower()
    hashtags = re.findall(r"(?<!\w)#\w+", text)
    emojis = EMOJI_RE.findall(text)
    has_url = bool(URL_RE.search(text) or re.search(r"\bwww\.", text, re.I))
    if not text.strip():
        r.append("[empty] post text is empty")
    if network == "x":
        body = strip_quote_tco(text) if (quote or media) else text
        L = len(URL_RE.sub("x" * R["url_weight"], body))
        if L > R["max_chars"]:
            r.append(f"[length] X post is {L} chars (URLs={R['url_weight']}) > {R['max_chars']}")
        elif L > R["warn_target_chars"]:
            WARNINGS.append(f"X post is {L} chars, target <= {R['warn_target_chars']}")
        main_has_url = bool(URL_RE.search(body) or re.search(r"\bwww\.", body, re.I))
        if main_has_url and not R["allow_url_in_main_post"]:
            r.append("[x] link in the main X post: move it to the first reply or say 'link en bio'")
        if 1 + len(replies) > R["max_thread_posts"]:
            r.append(f"[x] thread has {1 + len(replies)} posts > {R['max_thread_posts']}")
        for i, rep in enumerate(replies, 1):
            RL = len(URL_RE.sub("x" * R["url_weight"], rep))
            if RL > R["max_chars"]:
                r.append(f"[length] X reply {i} is {RL} chars > {R['max_chars']}")
    else:
        if len(text) > R["max_chars"]:
            r.append(f"[length] IG caption is {len(text)} chars > {R['max_chars']}")
        elif len(text) > R["warn_target_chars"]:
            WARNINGS.append(f"IG caption is {len(text)} chars, recommended <= {R['warn_target_chars']}")
        if has_url and not R["allow_url_in_caption"]:
            r.append("[ig] URL in IG caption (not clickable): use 'link en la bio'")
        WARNINGS.append(f"IG hook (first {R['hook_chars']} chars, check by eye): {text[:R['hook_chars']]!r}")
        if R["hashtags_only_at_end"] and hashtags:
            lines = [l for l in text.strip().splitlines() if l.strip()]
            tail = []
            for l in reversed(lines):
                if all(w.startswith("#") for w in l.split()):
                    tail.append(l)
                else:
                    break
            if len(re.findall(r"(?<!\w)#\w+", " ".join(tail))) != len(hashtags):
                r.append("[ig] hashtags must all go at the end of the caption")
        first = text.strip().splitlines()[0] if text.strip() else ""
        if not R["emoji_in_first_line"] and EMOJI_RE.search(first):
            r.append("[ig] emoji in the first line")
        run = 0
        for l in text.splitlines():
            if not l.strip():
                continue
            run = run + 1 if EMOJI_RE.search(l) else 0
            if run > R["max_consecutive_emoji_lines"]:
                r.append("[ig] one emoji per line pattern")
                break
    maxh = R.get("max_hashtags_spotlight", 0) if style == "spotlight" else R["max_hashtags"]
    if style == "spotlight" and hashtags:
        r.append(f"[style] Spotlight must have no hashtags, found {hashtags}")
    elif len(hashtags) > maxh:
        r.append(f"[{network}] {len(hashtags)} hashtags > {maxh}")
    if len(emojis) > R["max_emojis"]:
        r.append(f"[{network}] {len(emojis)} emojis > {R['max_emojis']}")
    for l in text.splitlines():
        letters = [c for c in l if c.isalpha()]
        lw = URL_RE.sub("", l)
        lw = re.sub(r"(?<!\w)#\w+", "", lw)
        lw = re.sub(r"\S+\.ar\b", "", lw)
        letters = [c for c in lw if c.isalpha()]
        if len(letters) >= B["max_all_caps_line_letters"] and all(c.isupper() for c in letters):
            r.append(f"[both] all-caps line -> {l.strip()!r}")
    for p in B["engagement_bait_patterns"]:
        if re.search(p, n):
            r.append(f"[both] engagement bait /{p}/")
    ctas = count_ctas(n, B["cta_patterns"])
    if len(ctas) > B["max_ctas"]:
        r.append(f"[both] {len(ctas)} CTAs > {B['max_ctas']}: {ctas}")
    return r


def extract_urls(text):
    urls = [u.rstrip(".,;:!?)]»\"'") for u in URL_RE.findall(text)]
    rest = URL_RE.sub(" ", text)
    for m in BARE_DOMAIN_RE.finditer(rest):
        urls.append("https://" + m.group(1).rstrip(".,;:!?)]»\"'"))
    return list(dict.fromkeys(urls))


def check_url(u, timeout=10):
    ctx = ssl.create_default_context()
    hdr = {"User-Agent": "Mozilla/5.0 (prepublish-check)"}
    last = None
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(u, method=method, headers=hdr)
            with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
                if resp.status < 400:
                    return None
                last = f"HTTP {resp.status}"
        except urllib.error.HTTPError as e:
            last = f"HTTP {e.code}"
        except Exception as e:  # network down, DNS, timeout => fail closed
            last = f"unreachable ({type(e).__name__}: {e})"
    return f"[link] {u} -> {last}"


def check_links(text):
    return [r for r in (check_url(u) for u in extract_urls(text)) if r]


def check_event(text, date, time):
    r = []
    n = norm(text).lower()
    no_urls = URL_RE.sub(" ", n)
    if date:
        y, mo, d = (int(x) for x in date.split("-"))
        for m in re.finditer(r"\b(\d{1,2})/(\d{1,2})(?:/(\d{2,4}))?\b", no_urls):
            dd, mm, yy = int(m.group(1)), int(m.group(2)), m.group(3)
            if (dd, mm) != (d, mo) or (yy and int(yy) % 100 != y % 100):
                r.append(f"[event] date {m.group(0)!r} != {date}")
        for m in re.finditer(r"\b(\d{4})-(\d{2})-(\d{2})\b", no_urls):
            if (int(m.group(1)), int(m.group(2)), int(m.group(3))) != (y, mo, d):
                r.append(f"[event] date {m.group(0)!r} != {date}")
        for m in re.finditer(r"\b(\d{1,2})\s+de\s+(" + "|".join(MONTHS) + r")(?:\s+(?:de\s+)?(\d{4}))?", no_urls):
            if (int(m.group(1)), MONTHS[m.group(2)]) != (d, mo) or (m.group(3) and int(m.group(3)) != y):
                r.append(f"[event] date {m.group(0)!r} != {date}")
    if time:
        h, mi = (int(x) for x in time.split(":"))
        found = []
        # Time ranges ("de 18 a 21 h", "18:00 a 21:00", "18-21 h", "18 – 21 h"): only the START
        # time is checked; the range is blanked (same length) so its end isn't read as a start.
        range_re = (r"\b(\d{1,2})(?:[:.](\d{2}))?\s*(?:hs|hrs|h)?\s*(?:a|-|\u2013|\u2014|hasta)\s*"
                    r"(\d{1,2})(?:(?:[:.](\d{2})\s*(?:hs|hrs|h)?)|\s*(?:hs|hrs|h))\b")
        def _range(m):
            found.append((m.group(0), int(m.group(1)), int(m.group(2) or 0)))
            return " " * len(m.group(0))
        no_urls = re.sub(range_re, _range, no_urls)
        for m in re.finditer(r"\b(\d{1,2})[:.](\d{2})\s*(?:h|hs|hrs)?\b", no_urls):
            found.append((m.group(0), int(m.group(1)), int(m.group(2))))
        for m in re.finditer(r"\b(\d{1,2})\s*(hs|h|hrs)\b", re.sub(r"\d{1,2}[:.]\d{2}", " ", no_urls)):
            found.append((m.group(0), int(m.group(1)), 0))
        for m in re.finditer(r"\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b", no_urls):
            hh = int(m.group(1)) % 12 + (12 if m.group(3) == "pm" else 0)
            found.append((m.group(0), hh, int(m.group(2) or 0)))
        for s, hh, mm in found:
            if (hh, mm) != (h, mi):
                r.append(f"[event] time {s.strip()!r} != {time}")
    return r


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--network", required=True, choices=["ig", "x"])
    ap.add_argument("--file", required=True)
    ap.add_argument("--style", choices=["default", "spotlight"], default="default")
    ap.add_argument("--event-date")
    ap.add_argument("--event-time")
    ap.add_argument("--reply-file", action="append", default=[], help="X thread replies (link goes here)")
    ap.add_argument("--quote", action="store_true", help="X quote post: ignore the trailing t.co of the quoted post")
    ap.add_argument("--media", action="store_true", help="X post with attached photo/video: ignore the trailing pic.x.com t.co")
    ap.add_argument("--rules", default=RULES_FILE)
    ap.add_argument("--no-links", action="store_true", help="skip live link checks (offline use only; re-run with links before publishing)")
    a = ap.parse_args()
    reasons = []
    try:
        if a.event_date and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", a.event_date):
            raise ValueError("--event-date must be YYYY-MM-DD")
        if a.event_time and not re.fullmatch(r"\d{1,2}:\d{2}", a.event_time):
            raise ValueError("--event-time must be HH:MM")
        with open(a.file, encoding="utf-8") as f:
            text = f.read().strip("\n")
        reasons += check_patterns(text, load_patterns())
        reasons += check_phones(text)
        with open(a.rules, encoding="utf-8") as f:
            rules = json.load(f)
        if a.reply_file and a.network != "x":
            raise ValueError("--reply-file only applies to X")
        replies = [open(p, encoding="utf-8").read().strip() for p in a.reply_file]
        reasons += check_length(text, a.network, a.style, rules, replies, quote=a.quote, media=a.media)
        if a.network == "x" and (a.quote or a.media):
            text = strip_quote_tco(text)  # don't link-check the media/quote t.co
        pats = load_patterns()
        for i, rep in enumerate(replies, 1):
            reasons += [f"(reply {i}) {x}" for x in check_patterns(rep, pats) + check_phones(rep) + ([] if a.no_links else check_links(rep))]
        reasons += check_event(text, a.event_date, a.event_time)
        if not a.no_links:
            reasons += check_links(text)
        else:
            WARNINGS.append("link checks skipped (--no-links): re-run before publishing")
    except Exception as e:
        reasons.append(f"[error] checker failed, failing closed: {type(e).__name__}: {e}")
    for w in WARNINGS:
        print("WARN  " + w, file=sys.stderr)
    if reasons:
        print("FAIL")
        for r in dict.fromkeys(reasons):
            print("  - " + r)
        sys.exit(1)
    print("PASS")
    sys.exit(0)


if __name__ == "__main__":
    main()
