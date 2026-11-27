"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/piedra/button";
import { Tabs, SegmentedTabList, SegmentedTab, TabPanel } from "@/components/piedra/tabs";
import { HomeHero } from "@/components/piedra/hero";
import { MobileDock } from "@/components/piedra/dock";
import { Label } from "@/components/piedra/label";
import { ICON_STROKE } from "@/components/piedra/event-card";
import { Kbd } from "@/components/shadcn/kbd";
import { Separator } from "@/components/shadcn/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { BRAND } from "@/lib/v3/brand";
import type { ShellData } from "@/lib/v3/types";
import { Lockup } from "./Logo";
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
  return (
    <SegmentedTabList aria-label="Secciones" instant={instant} className={className}>
      {TABS.map((tab) => (
        <SegmentedTab key={tab.id} value={tab.id} data-tab={tab.id} className={triggerClassName}>
          {tab.label}
        </SegmentedTab>
      ))}
    </SegmentedTabList>
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
        className="v3-shell relative grid h-dvh w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)] gap-0 overflow-hidden bg-background font-sans text-foreground grid-rows-[56px_minmax(0,1fr)_auto] lg:grid-rows-[56px_minmax(0,1fr)_32px]"
        vaul-drawer-wrapper=""
      >
        <div className="v3-piedra" aria-hidden />

        {/* ── Header ── */}
        <header className="relative z-10 flex min-w-0 items-center justify-between gap-2 border-b bg-background/70 px-3 backdrop-blur-sm sm:px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-6">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              // replace (no history.back): back() es asíncrono y pisaría el tab.
              if (overlayRef.current) closeOverlay({ replace: true });
              setTab("eventos");
            }}
            className="flex min-h-11 min-w-0 items-center rounded-lg"
            aria-label={`${BRAND} — inicio`}
          >
            <Lockup textClassName="lg:text-[16px]" />
          </Link>

          {layout !== "mobile" ? (
            <nav className="hidden lg:block" aria-label="Secciones">
              <SegmentedTabs value={tab} instant={instant} className="w-auto grid-cols-[repeat(4,auto)]" />
            </nav>
          ) : (
            <span className="hidden lg:block" aria-hidden />
          )}

          <div className="flex items-center justify-end gap-1 lg:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-10 shrink-0 sm:size-11 lg:hidden"
              aria-label="Buscar"
              onClick={() => setCmdOpen(true)}
            >
              <Search className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="hidden lg:inline-flex">
                  <Button
                    variant="outline"
                    onClick={() => setCmdOpen(true)}
                    className="h-9 w-[min(220px,15vw)] justify-between pr-1.5 pl-3 text-[13px] font-normal text-muted-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
                      Buscar…
                    </span>
                    <Kbd>{modKey}K</Kbd>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Eventos, secciones y acciones</TooltipContent>
            </Tooltip>

            {user ? (
              <UserMenu name={userName} avatarUrl={userAvatar} theme={theme} onToggleTheme={toggleTheme} />
            ) : (
              <Button variant="outline" href="/auth/login" className="h-10 shrink-0 px-3 text-[13px] sm:h-11 sm:px-4 lg:h-9 lg:px-3.5">
                Entrar
              </Button>
            )}
          </div>
        </header>

        {/* ── Main ── */}
        <main className="relative z-10 flex min-h-0 min-w-0 flex-col overflow-x-clip lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(400px,36vw,520px)]">
          <HomeHero
            brand={BRAND}
            nextUrl={next?.registrationUrl}
            onExplore={() => setCmdOpen(true)}
            modKey={modKey}
            venueName={next?.venueName}
            venueAddress={next?.venueAddress}
            city={next?.city}
          />

          {layout !== "desktop" ? (
            <nav className="relative min-w-0 shrink-0 px-3 pb-3 sm:px-4 lg:hidden" aria-label="Secciones">
              <SegmentedTabs value={tab} instant={instant} className="w-full grid-cols-4" />
            </nav>
          ) : null}

          <aside
            ref={asideRef}
            className="relative min-h-0 min-w-0 max-w-full flex-1 overflow-x-clip overflow-y-hidden px-3 pb-3 sm:px-4 lg:bg-background/80 lg:p-6"
            style={{ ["--v3-panel-dx" as string]: `${dx}px` }}
          >
            <TabPanel value="eventos" className="v3-panel h-full">
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
            </TabPanel>
            <TabPanel value="comunidad" className="v3-panel h-full">
              <CommunityPanel
                projects={projects}
                members={members}
                onMembers={() => openOverlay({ kind: "miembros" })}
                onJoin={() => setDialog("proyecto")}
              />
            </TabPanel>
            <TabPanel value="prensa" className="v3-panel h-full">
              <PressPanel press={press} onPress={openPress} onPressAll={() => openOverlay({ kind: "prensa" })} />
            </TabPanel>
            <TabPanel value="empleos" className="v3-panel h-full">
              <JobsPanel jobs={jobs} onPublish={() => setDialog("publicar")} />
            </TabPanel>
          </aside>
        </main>

        {/* ── Dock (mobile) / Status bar (desktop) ── */}
        <footer className="relative z-10 min-w-0">
          <MobileDock
            nextUrl={next?.registrationUrl}
            onCalendar={() => openOverlay({ kind: "calendario" })}
            onShare={() => shareLink({ title: BRAND })}
          />
          <div className="hidden h-8 items-center justify-between border-t bg-background px-6 lg:flex">
            <span className="flex items-center gap-4">
              <Label className="flex items-center gap-2 !text-[10.5px]">
                <span className="v3-dot !size-[5px]" aria-hidden />
                MDQ · 38°00′S 57°33′W
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
