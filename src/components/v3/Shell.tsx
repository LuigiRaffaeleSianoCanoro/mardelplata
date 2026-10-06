"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Search, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Button } from "@/components/shadcn/button";
import { Kbd } from "@/components/shadcn/kbd";
import { Separator } from "@/components/shadcn/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { BRAND, COMMUNITY_SIZE_LABEL } from "@/lib/v3/brand";
import type { ShellData } from "@/lib/v3/types";
import { Lockup } from "./Logo";
import { ICON_STROKE, Label } from "./parts";
import { EventsPanel, JobsPanel, PressPanel } from "./panels";
import type { OverlayState } from "./overlays";
import { shareLink } from "./actions";

// Todo lo que no hace falta para el primer paint se carga on-demand:
// overlays (vaul/Sheet), ⌘K (cmdk), dialogs, menú de usuario, carousel, toasts.
const loadOverlays = () => import("./overlays");
const loadCommand = () => import("./command-menu");
const OverlayHost = dynamic(() => loadOverlays().then((m) => m.OverlayHost), { ssr: false });
const JoinProjectDialog = dynamic(() => loadOverlays().then((m) => m.JoinProjectDialog), { ssr: false });
const PublishJobDialog = dynamic(() => loadOverlays().then((m) => m.PublishJobDialog), { ssr: false });
const CommandMenu = dynamic(() => loadCommand().then((m) => m.CommandMenu), { ssr: false });
const UserMenu = dynamic(() => import("./user-menu").then((m) => m.UserMenu), { ssr: false });
const CommunityPanel = dynamic(() => import("./panel-community").then((m) => m.CommunityPanel));
const Toaster = dynamic(() => import("@/components/shadcn/sonner").then((m) => m.Toaster), { ssr: false });
import { DESKTOP_QUERY, useFitChildren, useIsoLayoutEffect, useSessionUser, useTheme } from "./hooks";
import { TABS, isTabId, type TabId } from "./tabs";

type Overlay = OverlayState;

const COORDS = "38°00′S 57°33′W";
const HERO_WORDS = ["Programamos", "con", "viento", "de", "costado."];

function readUrl(): { tab: TabId; overlay: Overlay } {
  const sp = new URLSearchParams(window.location.search);
  const t = sp.get("tab");
  const tab: TabId = isTabId(t) ? t : "eventos";
  let overlay: Overlay = null;
  const ev = sp.get("evento");
  const nota = sp.get("nota");
  const ver = sp.get("ver");
  if (ev) overlay = { kind: "evento", slug: ev };
  else if (nota) overlay = { kind: "nota", id: nota };
  else if (ver === "calendario" || ver === "prensa" || ver === "miembros") overlay = { kind: ver };
  return { tab, overlay };
}

function buildUrl(tab: TabId, overlay: Overlay): string {
  const sp = new URLSearchParams(window.location.search);
  ["tab", "evento", "nota", "ver"].forEach((k) => sp.delete(k));
  if (tab !== "eventos") sp.set("tab", tab);
  if (overlay?.kind === "evento") sp.set("evento", overlay.slug);
  else if (overlay?.kind === "nota") sp.set("nota", overlay.id);
  else if (overlay) sp.set("ver", overlay.kind);
  const qs = sp.toString();
  return `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
}

/** Tabs segmentadas con indicador deslizante (translateX + width, 200ms). */
function SegmentedTabs({
  value,
  instant,
  className,
  triggerClassName,
}: {
  value: TabId;
  instant: boolean;
  className?: string;
  triggerClassName?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);
  const [ready, setReady] = useState(false);

  useIsoLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const el = list.querySelector<HTMLElement>(`[data-tab="${value}"]`);
      if (el && el.offsetWidth > 0) setInd({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [value]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <TabsList
      ref={listRef}
      aria-label="Secciones"
      className={cn(
        "relative grid h-auto rounded-[10px] border bg-muted/70 p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-auto",
        className,
      )}
    >
      <span
        aria-hidden
        className="v3-tab-indicator"
        data-instant={!ready || instant ? "true" : "false"}
        style={{
          transform: `translateX(${ind?.x ?? 3}px)`,
          width: ind?.w ?? 0,
          opacity: ind ? 1 : 0,
        }}
      />
      {TABS.map((t) => (
        <TabsTrigger
          key={t.id}
          value={t.id}
          data-tab={t.id}
          className={cn(
            "relative z-[1] h-11 rounded-[7px] border-0 px-2 text-[13.5px] font-medium text-muted-foreground shadow-none transition-colors duration-150 lg:h-[34px] lg:px-4",
            "data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none",
            "dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent",
            "hover-device:hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60",
            triggerClassName,
          )}
        >
          {t.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

export default function Shell({ data }: { data: ShellData }) {
  const { upcoming, past, press, jobs, projects, members, links } = data;
  const next = upcoming[0] ?? null;

  const [tab, setTabState] = useState<TabId>("eventos");
  const [instant, setInstant] = useState(false);
  const [dx, setDx] = useState(8);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const shownOverlay = useRef<Overlay>(null);
  if (overlay) shownOverlay.current = overlay;
  const pushed = useRef(false);
  // back() es asíncrono: si se abre otro overlay antes del popstate, lo encolamos.
  const pendingBack = useRef(false);
  const queued = useRef<Exclude<Overlay, null> | null>(null);
  // Un solo TabsList montado (evita IDs de Radix duplicados). En SSR se renderizan
  // ambos y CSS oculta uno; antes del primer paint queda sólo el del layout actual.
  const [layout, setLayout] = useState<"desktop" | "mobile" | null>(null);
  useIsoLayoutEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setLayout(mql.matches ? "desktop" : "mobile");
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdMounted, setCmdMounted] = useState(false);
  const [idle, setIdle] = useState(false);
  const [dialog, setDialog] = useState<"proyecto" | "publicar" | null>(null);
  const [dialogsMounted, setDialogsMounted] = useState(false);
  const [eventsView, setEventsView] = useState<"proximos" | "pasados">("proximos");
  const [modKey, setModKey] = useState("⌘");
  const [theme, setTheme] = useTheme();
  const user = useSessionUser();
  const asideRef = useRef<HTMLElement>(null);
  useFitChildren(asideRef, [tab, eventsView]);

  // Precarga en idle: cuando el usuario toque algo, el chunk ya está.
  useEffect(() => {
    const ric: (cb: () => void) => number =
      (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback
        ? (cb) =>
            (window as unknown as { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => number })
              .requestIdleCallback(cb, { timeout: 2000 })
        : (cb) => window.setTimeout(cb, 1200);
    const id = ric(() => {
      setIdle(true);
      loadOverlays();
      loadCommand();
    });
    return () => {
      const cancel = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cancel) cancel(id);
      else window.clearTimeout(id);
    };
  }, []);
  useEffect(() => {
    if (cmdOpen) setCmdMounted(true);
  }, [cmdOpen]);
  useEffect(() => {
    if (dialog) setDialogsMounted(true);
  }, [dialog]);

  const tabRef = useRef(tab);
  tabRef.current = tab;
  const overlayRef = useRef(overlay);
  overlayRef.current = overlay;

  // Estado inicial desde la URL (deep links: ?tab=prensa&nota=…).
  useIsoLayoutEffect(() => {
    const s = readUrl();
    setTabState(s.tab);
    setOverlay(s.overlay);
    if (!/Mac|iP(hone|ad|od)/.test(navigator.platform || navigator.userAgent)) setModKey("Ctrl ");
    try {
      sessionStorage.setItem("v3-seen", "1");
    } catch {}
    const onPop = () => {
      pendingBack.current = false;
      const q = queued.current;
      if (q) {
        queued.current = null;
        window.history.pushState({ ...(window.history.state ?? {}), v3o: true }, "", buildUrl(readUrl().tab, q));
        pushed.current = true;
        overlayRef.current = q;
        setOverlay(q);
        return;
      }
      const st = readUrl();
      setTabState(st.tab);
      setOverlay(st.overlay);
      // Sólo cerramos con back() si la entrada la creamos nosotros (marca en history.state);
      // si vino de afuera (deep link), back() sacaría al usuario del sitio.
      pushed.current = st.overlay != null && Boolean((window.history.state as { v3o?: boolean } | null)?.v3o);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setTab = useCallback((t: TabId, opts: { keyboard?: boolean } = {}) => {
    const from = TABS.findIndex((x) => x.id === tabRef.current);
    const to = TABS.findIndex((x) => x.id === t);
    setDx(opts.keyboard ? 0 : to >= from ? 8 : -8);
    setInstant(Boolean(opts.keyboard));
    setTabState(t);
    window.history.replaceState(window.history.state, "", buildUrl(t, overlayRef.current));
  }, []);

  const openOverlay = useCallback((o: Exclude<Overlay, null>) => {
    if (pendingBack.current) {
      queued.current = o;
      return;
    }
    const url = buildUrl(tabRef.current, o);
    if (overlayRef.current && pushed.current) {
      window.history.replaceState(window.history.state, "", url);
    } else {
      window.history.pushState({ ...(window.history.state ?? {}), v3o: true }, "", url);
      pushed.current = true;
    }
    setOverlay(o);
  }, []);

  const closeOverlay = useCallback((opts: { replace?: boolean } = {}) => {
    overlayRef.current = null;
    setOverlay(null);
    if (pushed.current && !opts.replace) {
      pushed.current = false;
      pendingBack.current = true;
      window.history.back();
    } else {
      pushed.current = false;
      window.history.replaceState(window.history.state, "", buildUrl(tabRef.current, null));
    }
  }, []);

  const openEvent = useCallback((slug: string) => openOverlay({ kind: "evento", slug }), [openOverlay]);
  const openPress = useCallback((id: string) => openOverlay({ kind: "nota", id }), [openOverlay]);
  const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);
  const rsvp = useCallback(() => {
    if (next?.registrationUrl) window.open(next.registrationUrl, "_blank", "noopener,noreferrer");
  }, [next]);

  // Atajos: ⌘K, 1–4 (tabs), T (tema). Navegar por teclado no anima.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || e.isComposing) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (t?.closest('[role="menu"],[role="listbox"],[role="combobox"]')) return;
      if (
        overlayRef.current ||
        document.querySelector('[role="dialog"][data-state="open"],[role="alertdialog"][data-state="open"],[role="menu"][data-state="open"]')
      )
        return;
      const n = Number(e.key);
      if (n >= 1 && n <= TABS.length) {
        setTab(TABS[n - 1].id, { keyboard: true });
      } else if (e.key === "t" || e.key === "T") {
        toggleTheme();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setTab, toggleTheme]);

  const userName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() || user?.email || "";
  const userAvatar = (user?.user_metadata?.avatar_url as string | undefined) ?? undefined;

  return (
    <TooltipProvider delayDuration={400}>
      <Tabs
        value={tab}
        onValueChange={(v) => isTabId(v) && setTab(v)}
        className="v3-shell relative grid h-dvh w-full gap-0 overflow-hidden bg-background font-sans text-foreground grid-rows-[56px_minmax(0,1fr)_auto] lg:grid-rows-[56px_minmax(0,1fr)_32px]"
        vaul-drawer-wrapper=""
      >
        <div className="v3-piedra" aria-hidden />

        {/* ── Header ── */}
        <header className="relative z-10 flex items-center justify-between gap-2 border-b bg-background/70 px-4 backdrop-blur-sm lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-6">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              // replace (no history.back): back() es asíncrono y pisaría el tab.
              if (overlayRef.current) closeOverlay({ replace: true });
              setTab("eventos");
            }}
            className="flex min-h-11 items-center rounded-lg"
            aria-label={`${BRAND} — inicio`}
          >
            <Lockup textClassName="lg:text-[16px]" />
          </Link>

          {layout !== "mobile" ? (
            <nav className="hidden lg:block" aria-label="Secciones">
              <SegmentedTabs value={tab} instant={instant} className="grid-cols-[repeat(4,auto)]" />
            </nav>
          ) : (
            <span className="hidden lg:block" aria-hidden />
          )}

          <div className="flex items-center justify-end gap-1 lg:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-11 lg:hidden"
              aria-label="Buscar"
              onClick={() => setCmdOpen(true)}
            >
              <Search className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setCmdOpen(true)}
                  className="hidden h-9 w-[min(220px,15vw)] justify-between pr-1.5 pl-3 text-[13px] font-normal text-muted-foreground lg:inline-flex"
                >
                  <span className="flex items-center gap-2">
                    <Search className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
                    Buscar…
                  </span>
                  <Kbd>{modKey}K</Kbd>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Eventos, secciones y acciones</TooltipContent>
            </Tooltip>

            {user ? (
              <UserMenu name={userName} avatarUrl={userAvatar} theme={theme} onToggleTheme={toggleTheme} />
            ) : (
              <Button variant="outline" asChild className="h-11 px-4 text-[13px] lg:h-9 lg:px-3.5">
                <Link href="/auth/login">Entrar</Link>
              </Button>
            )}
          </div>
        </header>

        {/* ── Main ── */}
        <main className="relative z-10 flex min-h-0 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(400px,36vw,520px)]">
          <section className="relative shrink-0 px-4 pt-5 pb-4 shorter:pt-3 shorter:pb-2.5 lg:flex lg:min-w-0 lg:flex-col lg:justify-between lg:gap-6 lg:border-r lg:px-[min(56px,4vw)] lg:pt-[min(48px,5dvh)] lg:pb-[min(40px,4.4dvh)]">
            <span className="v3-cross hidden lg:block" style={{ left: -6, top: -6 }} aria-hidden />
            <span className="v3-cross hidden lg:block" style={{ right: -6, top: -6 }} aria-hidden />
            <div>
              <div className="flex items-center justify-between gap-6 lg:justify-start">
                <Label>[MDQ] {COORDS}</Label>
                <Label className="lg:hidden">{COMMUNITY_SIZE_LABEL} personas</Label>
                <Label className="hidden lg:inline">Comunidad dev</Label>
                <Label className="hidden xl:inline">Desde Fauno, Olavarría</Label>
              </div>
              <h1 className="v3-display mt-3 max-w-[820px] text-[54px] short:text-[44px] shorter:text-[38px] lg:mt-[min(32px,3.5dvh)] lg:text-[min(112px,12.4dvh,7.8vw)]">
                {HERO_WORDS.map((w, i) => (
                  <span key={w + i}>
                    <span className="v3-word" style={{ ["--i" as string]: i }}>
                      <span>{w}</span>
                    </span>
                    {i < HERO_WORDS.length - 1 ? " " : null}
                  </span>
                ))}
              </h1>
              <p className="mt-3 text-[14.5px] leading-[1.45] text-muted-foreground short:hidden lg:hidden">
                La comunidad dev de Mar del Plata. Arrancamos en Fauno, Olavarría, y seguimos juntándonos.
              </p>
              <p className="mt-[min(28px,3dvh)] hidden max-w-[560px] text-[18px] leading-[1.5] text-muted-foreground lg:block">
                {BRAND} junta a la gente que hace software en Mar del Plata: meetups, hackathons, empleos y lo que sale en los medios.
              </p>
              <div className="mt-8 hidden items-center gap-3 lg:flex dshort:mt-6">
                {next?.registrationUrl ? (
                  <Button asChild size="xl">
                    <a href={next.registrationUrl} target="_blank" rel="noopener noreferrer">
                      Anotarme al próximo
                      <ArrowUpRight className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
                    </a>
                  </Button>
                ) : null}
                <Button variant="outline" size="xl" className="gap-3 px-4" onClick={() => setCmdOpen(true)}>
                  Explorar <Kbd>{modKey}K</Kbd>
                </Button>
              </div>
            </div>
            <div
              className={cn(
                "hidden overflow-hidden rounded-xl border bg-background/80 lg:grid",
                next?.venueName ? "grid-cols-3" : "grid-cols-2",
              )}
            >
              <div className="p-5">
                <Label>Comunidad</Label>
                <div className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">{COMMUNITY_SIZE_LABEL}</div>
                <div className="text-[13px] text-muted-foreground">personas</div>
              </div>
              <div className="border-l p-5">
                <Label>Primera juntada</Label>
                <div className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">Fauno</div>
                <div className="text-[13px] text-muted-foreground">Olavarría, MdP</div>
              </div>
              {next?.venueName ? (
                <div className="min-w-0 border-l p-5">
                  <Label>Próxima sede</Label>
                  <div className="mt-2 truncate text-[28px] font-semibold tracking-[-0.04em]">{next.venueName}</div>
                  <div className="truncate text-[13px] text-muted-foreground">{next.venueAddress ?? next.city}</div>
                </div>
              ) : null}
            </div>
          </section>

          {layout !== "desktop" ? (
            <nav className="relative shrink-0 px-4 pb-3 lg:hidden" aria-label="Secciones">
              <SegmentedTabs value={tab} instant={instant} className="w-full grid-cols-4" />
            </nav>
          ) : null}

          <aside
            ref={asideRef}
            className="relative min-h-0 flex-1 overflow-hidden px-4 pb-3 lg:bg-background/80 lg:p-6"
            style={{ ["--v3-panel-dx" as string]: `${dx}px` }}
          >
            <TabsContent value="eventos" className="v3-panel h-full">
              <EventsPanel
                upcoming={upcoming}
                past={past}
                press={press}
                jobs={jobs}
                view={eventsView}
                onView={setEventsView}
                onEvent={openEvent}
                onPress={openPress}
                onCalendar={() => openOverlay({ kind: "calendario" })}
                onPressAll={() => openOverlay({ kind: "prensa" })}
                onPublish={() => setDialog("publicar")}
                onJobs={() => setTab("empleos")}
              />
            </TabsContent>
            <TabsContent value="comunidad" className="v3-panel h-full">
              <CommunityPanel
                projects={projects}
                members={members}
                onMembers={() => openOverlay({ kind: "miembros" })}
                onJoin={() => setDialog("proyecto")}
              />
            </TabsContent>
            <TabsContent value="prensa" className="v3-panel h-full">
              <PressPanel press={press} onPress={openPress} onPressAll={() => openOverlay({ kind: "prensa" })} />
            </TabsContent>
            <TabsContent value="empleos" className="v3-panel h-full">
              <JobsPanel jobs={jobs} onPublish={() => setDialog("publicar")} />
            </TabsContent>
          </aside>
        </main>

        {/* ── Dock (mobile) / Status bar (desktop) ── */}
        <footer className="relative z-10">
          <div className="grid grid-cols-[1fr_auto] gap-2 border-t bg-background/85 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden">
            {next?.registrationUrl ? (
              <Button asChild size="xl" className="w-full">
                <a href={next.registrationUrl} target="_blank" rel="noopener noreferrer">
                  Anotarme al próximo
                </a>
              </Button>
            ) : (
              <Button size="xl" className="w-full" onClick={() => openOverlay({ kind: "calendario" })}>
                Ver calendario
              </Button>
            )}
            <Button variant="outline" size="icon-xl" aria-label="Compartir" onClick={() => shareLink({ title: BRAND })}>
              <Share className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
            </Button>
          </div>
          <div className="hidden h-8 items-center justify-between border-t bg-background px-6 lg:flex">
            <span className="flex items-center gap-4">
              <Label className="flex items-center gap-2 !text-[10.5px]">
                <span className="v3-dot !size-[5px]" aria-hidden />
                MDQ · {COORDS}
              </Label>
              <Label className="!text-[10.5px]">Fondo: piedra Mar del Plata</Label>
            </span>
            <span className="flex items-center gap-4">
              <Label className="flex items-center gap-1.5 !text-[10.5px]">
                <Kbd className="h-[18px]">{modKey}K</Kbd> buscar
              </Label>
              <Label className="flex items-center gap-1.5 !text-[10.5px]">
                <Kbd className="h-[18px]">1</Kbd>–<Kbd className="h-[18px]">4</Kbd> secciones
              </Label>
              <Separator orientation="vertical" className="!h-3" />
              <button
                type="button"
                onClick={toggleTheme}
                className="v3-label inline-flex items-center gap-1.5 !text-[10.5px] hover-device:hover:text-foreground"
                aria-label={`Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`}
              >
                <Kbd className="h-[18px]">T</Kbd> tema
              </button>
              <Label className="v3-brand-case !text-[10.5px]">© {BRAND}</Label>
            </span>
          </div>
        </footer>
      </Tabs>

      {overlay || shownOverlay.current ? (
        <OverlayHost
          overlay={shownOverlay.current}
          open={overlay != null}
          onClose={() => closeOverlay()}
          upcoming={upcoming}
          past={past}
          press={press}
          members={members}
          onEvent={openEvent}
          onPress={openPress}
        />
      ) : null}

      {cmdMounted ? (
      <CommandMenu
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        upcoming={upcoming}
        past={past}
        press={press}
        links={links}
        loggedIn={Boolean(user)}
        onTab={(t) => setTab(t)}
        onEvent={openEvent}
        onPress={openPress}
        onRsvp={rsvp}
        onToggleTheme={toggleTheme}
        onCopyLink={() => shareLink({ title: BRAND })}
      />
      ) : null}

      {dialog || dialogsMounted ? (
        <>
          <JoinProjectDialog open={dialog === "proyecto"} onOpenChange={(o) => setDialog(o ? "proyecto" : null)} loggedIn={Boolean(user)} />
          <PublishJobDialog open={dialog === "publicar"} onOpenChange={(o) => setDialog(o ? "publicar" : null)} />
        </>
      ) : null}
      {idle ? <Toaster theme={theme} position="bottom-center" /> : null}
    </TooltipProvider>
  );
}
