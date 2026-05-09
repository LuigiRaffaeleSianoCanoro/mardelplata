"use client";

import { useCallback, useEffect, useState } from "react";
import { Lightbulb, GitBranch, Eye, FileText, Plus } from "lucide-react";
import BottomSheet from "./BottomSheet";
import LinkProjectDialog from "./LinkProjectDialog";
import {
  SheetHeaderSkeleton,
  SheetToolbarSkeleton,
  SheetBodySkeleton,
} from "./SheetSkeleton";
import {
  getIdeaBySlug,
  listLinkedProjects,
  getIdeaMembership,
  toggleFollowIdea,
  type LinkedProjectSummary,
  type IdeaMembership,
} from "@/lib/red/queries";
import type { IdeaCardData, IdeaLinkType } from "@/lib/red/types";
import { useCurrentUserId } from "@/lib/red/useCurrentUserId";

type TabId = "descripcion" | "proyectos";

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "descripcion", label: "Descripción", icon: FileText },
  { id: "proyectos", label: "Proyectos", icon: GitBranch },
];

const STATUS_LABEL: Record<IdeaCardData["status"], string> = {
  open: "Abierta",
  active: "En construcción",
  archived: "Archivada",
};

const STATUS_DOT: Record<IdeaCardData["status"], string> = {
  open: "rgb(255, 176, 112)",
  active: "rgb(59, 130, 246)",
  archived: "rgba(255, 255, 255, 0.35)",
};

interface IdeaSheetProps {
  slug: string | null;
  onClose: () => void;
}

export default function IdeaSheet({ slug, onClose }: IdeaSheetProps) {
  const userId = useCurrentUserId();
  const [idea, setIdea] = useState<IdeaCardData | null>(null);
  const [linked, setLinked] = useState<LinkedProjectSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabId>("descripcion");
  const [membership, setMembership] = useState<IdeaMembership>({ is_follower: false });
  const [busy, setBusy] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const open = slug !== null;

  useEffect(() => {
    if (slug) setTab("descripcion");
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setIdea(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getIdeaBySlug(slug).then((i) => {
      if (cancelled) return;
      setIdea(i);
      setLoading(false);
      if (!i) return;
      Promise.all([listLinkedProjects(i.id), getIdeaMembership(i.id, userId)]).then(([rows, mem]) => {
        if (cancelled) return;
        setLinked(rows);
        setMembership(mem);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [slug, userId]);

  const handleToggleFollow = useCallback(async () => {
    if (!idea || !userId || busy) return;
    setBusy(true);
    const next = !membership.is_follower;
    setMembership({ is_follower: next });
    setIdea((i) => (i ? { ...i, followers_count: i.followers_count + (next ? 1 : -1) } : i));
    const ok = await toggleFollowIdea(idea.id, userId, next);
    if (!ok) {
      setMembership({ is_follower: !next });
      setIdea((i) => (i ? { ...i, followers_count: i.followers_count + (next ? -1 : 1) } : i));
    }
    setBusy(false);
  }, [idea, userId, membership.is_follower, busy]);

  const handleLinked = useCallback(
    async (projectId: string, linkType: IdeaLinkType) => {
      if (!idea) return;
      // Re-fetch to get the joined project name + status drift if implements set status
      const [rows, fresh] = await Promise.all([
        listLinkedProjects(idea.id),
        getIdeaBySlug(idea.slug),
      ]);
      setLinked(rows);
      if (fresh) setIdea(fresh);
      void projectId;
      void linkType;
    },
    [idea],
  );

  const showSkeleton = loading && !idea;

  const header = !idea ? (
    showSkeleton ? <SheetHeaderSkeleton /> : null
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: STATUS_DOT[idea.status], boxShadow: `0 0 8px ${STATUS_DOT[idea.status]}` }}
        />
        <span className="kicker text-white/55">{STATUS_LABEL[idea.status]}</span>
        <span className="text-white/25">·</span>
        <span className="kicker text-white/45">red / idea</span>
      </div>
      <div className="flex items-end gap-3 flex-wrap">
        <h2 className="display-thin text-white text-3xl sm:text-4xl leading-tight tracking-[-0.01em]">
          {idea.title}
        </h2>
        <Lightbulb size={18} className="text-white/55 mb-2" />
      </div>
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {idea.tags.map((t) => (
            <span
              key={t}
              className="text-[0.65rem] tracking-wide uppercase text-white/65 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-5 text-white/55 text-[0.78rem]">
        <span className="inline-flex items-center gap-1.5">
          <Eye size={12} /> {idea.followers_count} siguen
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GitBranch size={12} /> {idea.projects_count} {idea.projects_count === 1 ? "proyecto" : "proyectos"} linkeados
        </span>
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFollow}
            disabled={!userId || busy}
            className={`px-3 py-1.5 rounded-full text-[0.74rem] border transition-colors disabled:opacity-50 ${
              membership.is_follower
                ? "text-white/85 border-white/[0.16] bg-white/[0.07] hover:bg-white/[0.10]"
                : "text-white/65 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          >
            {membership.is_follower ? "Siguiendo" : "Seguir"}
          </button>
          <button
            type="button"
            onClick={() => setLinkDialogOpen(true)}
            disabled={!userId}
            className="px-3 py-1.5 rounded-full text-[0.74rem] text-white/85 border border-[rgba(59,130,246,0.32)] bg-[rgba(59,130,246,0.12)] hover:bg-[rgba(59,130,246,0.18)] disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Plus size={12} /> Linkear proyecto
          </button>
        </div>
      </div>
    </div>
  );

  const toolbar = !idea ? (
    showSkeleton ? <SheetToolbarSkeleton count={2} /> : null
  ) : (
    <div className="flex items-center gap-1 px-1">
      {TABS.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            className={`sheet-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <Icon size={13} className="opacity-80" />
            {t.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <BottomSheet
        open={open}
        onClose={onClose}
        header={header}
        toolbar={toolbar}
        ariaLabel={idea ? `Idea ${idea.title}` : "Idea"}
      >
        {showSkeleton && <SheetBodySkeleton />}
        {!loading && !idea && open && (
          <div className="p-10 text-center text-white/55 font-light">Idea no encontrada.</div>
        )}
        {idea && tab === "descripcion" && (
          <div className="p-6 sm:p-8">
            <p className="text-white/80 font-light leading-relaxed whitespace-pre-wrap">
              {idea.description ?? "Sin descripción."}
            </p>
          </div>
        )}
        {idea && tab === "proyectos" && (
          <div className="p-6 sm:p-8 space-y-2">
            {linked.length === 0 ? (
              <div className="py-10 text-center">
                <GitBranch size={24} className="text-white/35 mx-auto mb-3" />
                <p className="text-white/55 font-light mb-3">
                  Esta idea no está linkeada a ningún proyecto todavía.
                </p>
                <button
                  type="button"
                  onClick={() => setLinkDialogOpen(true)}
                  disabled={!userId}
                  className="px-3 py-1.5 rounded-full text-[0.74rem] text-white/85 border border-[rgba(59,130,246,0.32)] bg-[rgba(59,130,246,0.12)] hover:bg-[rgba(59,130,246,0.18)] inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Plus size={12} /> Linkear el primero
                </button>
              </div>
            ) : (
              linked.map((l) => (
                <div
                  key={l.project.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <GitBranch size={14} className="text-white/55" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/85 text-sm font-light truncate">{l.project.name}</p>
                    <p className="text-white/40 text-[0.72rem]">link: {l.link.link_type}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </BottomSheet>

      {idea && (
        <LinkProjectDialog
          open={linkDialogOpen}
          onClose={() => setLinkDialogOpen(false)}
          ideaId={idea.id}
          ideaTitle={idea.title}
          userId={userId}
          alreadyLinkedProjectIds={linked.map((l) => l.project.id)}
          onLinked={handleLinked}
        />
      )}
    </>
  );
}
