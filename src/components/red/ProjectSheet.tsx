"use client";

import { useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import Image from "next/image";
import {
  Eye,
  Users,
  GitBranch,
  ExternalLink,
  Lightbulb,
  GitCommit,
  MessageCircle,
  Boxes,
  Plus,
  Send,
  CornerDownRight,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import BottomSheet from "./BottomSheet";
import NewChangeDialog from "./NewChangeDialog";
import ImportModuleDialog from "./ImportModuleDialog";
import {
  SheetHeaderSkeleton,
  SheetToolbarSkeleton,
  SheetBodySkeleton,
} from "./SheetSkeleton";
import {
  getProjectBySlug,
  listProjectContributors,
  listProjectChanges,
  listProjectComments,
  listLinkedIdeas,
  addProjectComment,
  getProjectMembership,
  toggleFollowProject,
  joinAsContributor,
  updateProjectComment,
  deleteProjectComment,
  listModuleUsagesByProject,
  removeModuleUsage,
  type ContributorWithProfile,
  type CommentWithAuthor,
  type LinkedIdeaSummary,
  type ProjectMembership,
  type ModuleUsageWithModule,
} from "@/lib/red/queries";
import type { ProjectCardData, ProjectChange, ChangeKind } from "@/lib/red/types";
import { useCurrentUserId } from "@/lib/red/useCurrentUserId";
import { IS_MOCK } from "@/lib/devMock";
import { createClient } from "@/lib/supabase/client";

type TabId = "overview" | "construyendo" | "modulos" | "ideas" | "cambios" | "comments";

const TABS: { id: TabId; label: string; icon: typeof Eye }[] = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "construyendo", label: "Construyendo", icon: Users },
  { id: "modulos", label: "Módulos", icon: Boxes },
  { id: "ideas", label: "Ideas", icon: Lightbulb },
  { id: "cambios", label: "Cambios", icon: GitCommit },
  { id: "comments", label: "Discusión", icon: MessageCircle },
];

const STATUS_LABEL: Record<ProjectCardData["status"], string> = {
  active: "Activo",
  paused: "Pausado",
  archived: "Archivado",
};

const STATUS_DOT: Record<ProjectCardData["status"], string> = {
  active: "rgb(59, 130, 246)",
  paused: "rgb(255, 176, 112)",
  archived: "rgba(255, 255, 255, 0.35)",
};

interface ProjectSheetProps {
  slug: string | null;
  onClose: () => void;
}

export default function ProjectSheet({ slug, onClose }: ProjectSheetProps) {
  const userId = useCurrentUserId();
  const [project, setProject] = useState<ProjectCardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabId>("overview");
  const [contributors, setContributors] = useState<ContributorWithProfile[]>([]);
  const [changes, setChanges] = useState<ProjectChange[]>([]);
  const [linkedIdeas, setLinkedIdeas] = useState<LinkedIdeaSummary[]>([]);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [membership, setMembership] = useState<ProjectMembership>({
    is_follower: false,
    is_contributor: false,
    role: null,
  });
  const [busy, setBusy] = useState<"follow" | "join" | null>(null);
  const [newChangeOpen, setNewChangeOpen] = useState(false);
  const [importModuleOpen, setImportModuleOpen] = useState(false);
  const [moduleUsages, setModuleUsages] = useState<ModuleUsageWithModule[]>([]);
  const open = slug !== null;

  useEffect(() => {
    if (slug) setTab("overview");
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setProject(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProjectBySlug(slug).then((p) => {
      if (cancelled) return;
      setProject(p);
      setLoading(false);
      if (!p) return;
      Promise.all([
        listProjectContributors(p.id),
        listProjectChanges(p.id),
        listLinkedIdeas(p.id),
        listProjectComments(p.id),
        getProjectMembership(p.id, userId),
        listModuleUsagesByProject(p.id),
      ]).then(([c, ch, ideas, cm, mem, mods]) => {
        if (cancelled) return;
        setContributors(c);
        setChanges(ch);
        setLinkedIdeas(ideas);
        setComments(cm);
        setMembership(mem);
        setModuleUsages(mods);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [slug, userId]);

  // Realtime: subscribe to project_comments changes filtered by the open
  // project so live commenting works without polling. No-op in mock mode.
  useEffect(() => {
    if (IS_MOCK || !project) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`project_comments:${project.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_comments",
          filter: `project_id=eq.${project.id}`,
        },
        () => {
          listProjectComments(project.id).then(setComments);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [project]);

  const handleToggleFollow = useCallback(async () => {
    if (!project || !userId || busy) return;
    setBusy("follow");
    const next = !membership.is_follower;
    setMembership((m) => ({ ...m, is_follower: next }));
    setProject((p) => (p ? { ...p, followers_count: p.followers_count + (next ? 1 : -1) } : p));
    const ok = await toggleFollowProject(project.id, userId, next);
    if (!ok) {
      setMembership((m) => ({ ...m, is_follower: !next }));
      setProject((p) => (p ? { ...p, followers_count: p.followers_count + (next ? -1 : 1) } : p));
    }
    setBusy(null);
  }, [project, userId, membership.is_follower, busy]);

  const handleJoin = useCallback(async () => {
    if (!project || !userId || busy || membership.is_contributor) return;
    setBusy("join");
    const ok = await joinAsContributor(project.id, userId);
    if (ok) {
      setMembership((m) => ({ ...m, is_contributor: true, role: m.role ?? "contributor" }));
      setProject((p) => (p ? { ...p, contributors_count: p.contributors_count + 1 } : p));
      const fresh = await listProjectContributors(project.id);
      setContributors(fresh);
    }
    setBusy(null);
  }, [project, userId, membership.is_contributor, busy]);

  const handleNewComment = useCallback(
    async (body: string, parentId: string | null) => {
      if (!project || !userId) return;
      const fresh = await addProjectComment({ projectId: project.id, authorId: userId, body, parentId });
      if (fresh) setComments((prev) => [...prev, fresh]);
    },
    [project, userId],
  );

  const handleEditComment = useCallback(async (commentId: string, body: string) => {
    const ok = await updateProjectComment({ commentId, body });
    if (!ok) return;
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, body, updated_at: new Date().toISOString() } : c)),
    );
  }, []);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    const ok = await deleteProjectComment(commentId);
    if (!ok) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  const handleChangeAdded = useCallback((fresh: ProjectChange) => {
    setChanges((prev) => [fresh, ...prev]);
  }, []);

  const showSkeleton = loading && !project;

  const header = !project ? (
    showSkeleton ? <SheetHeaderSkeleton /> : null
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: STATUS_DOT[project.status], boxShadow: `0 0 8px ${STATUS_DOT[project.status]}` }}
        />
        <span className="kicker text-white/55">{STATUS_LABEL[project.status]}</span>
        <span className="text-white/25">·</span>
        <span className="kicker text-white/45">red / open source</span>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <h2 className="display-thin text-white text-3xl sm:text-4xl leading-tight tracking-[-0.01em]">
          {project.name}
        </h2>
        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white/65 hover:text-white text-[0.78rem] mb-1 transition-colors"
          >
            <GitBranch size={13} /> repo <ExternalLink size={10} />
          </a>
        )}
        {project.demo_url && (
          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white/65 hover:text-white text-[0.78rem] mb-1 transition-colors"
          >
            demo <ExternalLink size={10} />
          </a>
        )}
      </div>

      <div className="flex items-center gap-5 text-white/55 text-[0.78rem]">
        <span className="inline-flex items-center gap-1.5">
          <Users size={12} /> {project.contributors_count} contributors
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye size={12} /> {project.followers_count} siguen
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GitCommit size={12} /> {changes.length} cambios
        </span>
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFollow}
            disabled={!userId || busy === "follow"}
            className={`px-3 py-1.5 rounded-full text-[0.74rem] border transition-colors disabled:opacity-50 ${
              membership.is_follower
                ? "text-white/85 border-white/[0.16] bg-white/[0.07] hover:bg-white/[0.10]"
                : "text-white/65 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          >
            {membership.is_follower ? "Siguiendo" : "Seguir"}
          </button>
          {membership.is_contributor ? (
            <span className="px-3 py-1.5 rounded-full text-[0.74rem] text-[#9bc1ff] border border-[rgba(59,130,246,0.32)] bg-[rgba(59,130,246,0.12)]">
              {membership.role === "maintainer" ? "Maintainer" : "Contributor"}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleJoin}
              disabled={!userId || busy === "join"}
              className="px-3 py-1.5 rounded-full text-[0.74rem] text-white/85 border border-[rgba(59,130,246,0.32)] bg-[rgba(59,130,246,0.12)] hover:bg-[rgba(59,130,246,0.18)] disabled:opacity-50"
            >
              Sumarme
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const toolbar = !project ? (
    showSkeleton ? <SheetToolbarSkeleton count={6} /> : null
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
        ariaLabel={project ? `Proyecto ${project.name}` : "Proyecto"}
      >
        {showSkeleton && <SheetBodySkeleton />}
        {!loading && !project && open && (
          <div className="p-10 text-center text-white/55 font-light">Proyecto no encontrado.</div>
        )}
        {project && tab === "overview" && (
          <OverviewTab project={project} contributors={contributors} linkedIdeas={linkedIdeas} />
        )}
        {project && tab === "construyendo" && <ContributorsTab contributors={contributors} />}
        {project && tab === "modulos" && (
          <ModulesTab
            usages={moduleUsages}
            canEdit={membership.is_contributor}
            onImport={() => setImportModuleOpen(true)}
            onRemove={async (moduleId) => {
              const ok = await removeModuleUsage({ projectId: project.id, moduleId });
              if (ok) setModuleUsages((prev) => prev.filter((u) => u.module.id !== moduleId));
            }}
          />
        )}
        {project && tab === "ideas" && <IdeasTab linkedIdeas={linkedIdeas} />}
        {project && tab === "cambios" && (
          <ChangesTab
            changes={changes}
            canAdd={membership.is_contributor}
            onNewChange={() => setNewChangeOpen(true)}
          />
        )}
        {project && tab === "comments" && (
          <CommentsTab
            comments={comments}
            currentUserId={userId}
            onSubmit={handleNewComment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        )}
      </BottomSheet>

      {project && (
        <NewChangeDialog
          open={newChangeOpen}
          onClose={() => setNewChangeOpen(false)}
          projectId={project.id}
          authorId={userId}
          onCreated={handleChangeAdded}
        />
      )}

      {project && (
        <ImportModuleDialog
          open={importModuleOpen}
          onClose={() => setImportModuleOpen(false)}
          projectId={project.id}
          projectName={project.name}
          userId={userId}
          alreadyUsedModuleIds={moduleUsages.map((u) => u.module.id)}
          onImported={async () => {
            const fresh = await listModuleUsagesByProject(project.id);
            setModuleUsages(fresh);
          }}
        />
      )}
    </>
  );
}

// =====================================================================
// Tabs
// =====================================================================

function OverviewTab({
  project,
  contributors,
  linkedIdeas,
}: {
  project: ProjectCardData;
  contributors: ContributorWithProfile[];
  linkedIdeas: LinkedIdeaSummary[];
}) {
  const maintainer = contributors.find((c) => c.role === "maintainer");
  return (
    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-5">
        <div>
          <p className="kicker text-white/45 mb-2">Sobre el proyecto</p>
          <p className="text-white/80 font-light leading-relaxed">
            {project.description ?? "Sin descripción."}
          </p>
        </div>
        {linkedIdeas.length > 0 && (
          <div>
            <p className="kicker text-white/45 mb-2">Nace de</p>
            <ul className="space-y-1.5">
              {linkedIdeas.map((l) => (
                <li key={l.idea.id} className="text-white/75 text-sm font-light flex items-center gap-2">
                  <Lightbulb size={12} className="text-white/45" />
                  <span>{l.idea.title}</span>
                  <span className="kicker text-white/35">· {l.link.link_type}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <aside className="space-y-4">
        <Field label="Estado" value={STATUS_LABEL[project.status]} />
        <Field label="Maintainer" value={maintainer?.profile?.full_name ?? "— sin maintainer —"} />
        <Field
          label="Creado"
          value={new Date(project.created_at).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
        <Field
          label="Última actualización"
          value={new Date(project.updated_at).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
      </aside>
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="kicker text-white/40 mb-1">{label}</p>
      <p className="text-white/80 text-sm font-light">{value}</p>
    </div>
  );
}

function ContributorsTab({ contributors }: { contributors: ContributorWithProfile[] }) {
  if (contributors.length === 0) {
    return (
      <div className="p-10 text-center text-white/55 font-light">
        Todavía no hay contributors. Cualquiera de la red puede sumarse.
      </div>
    );
  }
  return (
    <div className="p-6 sm:p-8 space-y-2">
      {contributors.map((c) => (
        <div
          key={c.user_id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
        >
          <Avatar name={c.profile?.full_name ?? "—"} url={c.profile?.avatar_url ?? null} />
          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-sm font-light truncate">
              {c.profile?.full_name ?? "Sin nombre"}
            </p>
          </div>
          <span
            className={`kicker px-2 py-0.5 rounded-md ${
              c.role === "maintainer"
                ? "bg-[rgba(59,130,246,0.12)] text-[#9bc1ff] border border-[rgba(59,130,246,0.28)]"
                : "bg-white/[0.04] text-white/65 border border-white/[0.08]"
            }`}
          >
            {c.role}
          </span>
        </div>
      ))}
    </div>
  );
}

function ModulesTab({
  usages,
  canEdit,
  onImport,
  onRemove,
}: {
  usages: ModuleUsageWithModule[];
  canEdit: boolean;
  onImport: () => void;
  onRemove: (moduleId: string) => void | Promise<void>;
}) {
  return (
    <div className="p-6 sm:p-8 space-y-3">
      {canEdit && (
        <button
          type="button"
          onClick={onImport}
          className="w-full px-4 py-3 rounded-2xl border border-dashed border-white/[0.12] text-white/65 hover:text-white hover:border-[rgba(59,130,246,0.45)] hover:bg-[rgba(59,130,246,0.06)] text-sm font-light inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={14} /> Importar módulo
        </button>
      )}
      {usages.length === 0 ? (
        <div className="py-10 text-center">
          <Boxes size={24} className="text-white/35 mx-auto mb-3" />
          <p className="text-white/55 font-light">
            {canEdit
              ? "Este proyecto no declaró módulos todavía."
              : "Sin módulos declarados todavía."}
          </p>
        </div>
      ) : (
        usages.map((u) => (
          <div
            key={u.module.id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
          >
            <Boxes size={14} className="text-white/55" />
            <div className="flex-1 min-w-0">
              <p className="text-white/85 text-sm font-light truncate">{u.module.name}</p>
              <p className="text-white/40 text-[0.72rem] truncate">
                {u.module.kind}{u.module.version ? ` · v${u.module.version}` : ""}
                {u.usage.note ? ` · “${u.usage.note}”` : ""}
              </p>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => onRemove(u.module.id)}
                className="text-white/45 hover:text-[#ff8aa8] text-[0.72rem] transition-colors"
              >
                quitar
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function IdeasTab({ linkedIdeas }: { linkedIdeas: LinkedIdeaSummary[] }) {
  if (linkedIdeas.length === 0) {
    return (
      <div className="p-10 text-center">
        <Lightbulb size={24} className="text-white/35 mx-auto mb-3" />
        <p className="text-white/65 font-light mb-3">Sin ideas linkeadas todavía.</p>
        <p className="text-white/40 text-sm font-light max-w-md mx-auto">
          Las ideas se linkean desde el sheet de la idea. Andá a la pestaña <em>Ideas</em>
          de la red para ver el catálogo.
        </p>
      </div>
    );
  }
  return (
    <div className="p-6 sm:p-8 space-y-2">
      {linkedIdeas.map((l) => (
        <div
          key={l.idea.id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
        >
          <Lightbulb size={14} className="text-white/55" />
          <div className="flex-1 min-w-0">
            <p className="text-white/85 text-sm font-light truncate">{l.idea.title}</p>
            <p className="text-white/40 text-[0.72rem]">link: {l.link.link_type}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const KIND_DOT: Record<ChangeKind, string> = {
  feature: "rgb(59, 130, 246)",
  fix: "rgb(255, 176, 112)",
  chore: "rgba(255, 255, 255, 0.45)",
  note: "rgb(255, 45, 170)",
};

function ChangesTab({
  changes,
  canAdd,
  onNewChange,
}: {
  changes: ProjectChange[];
  canAdd: boolean;
  onNewChange: () => void;
}) {
  return (
    <div className="p-6 sm:p-8 space-y-3">
      {canAdd && (
        <button
          type="button"
          onClick={onNewChange}
          className="w-full px-4 py-3 rounded-2xl border border-dashed border-white/[0.12] text-white/65 hover:text-white hover:border-[rgba(59,130,246,0.45)] hover:bg-[rgba(59,130,246,0.06)] text-sm font-light inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={14} /> Anotar un cambio
        </button>
      )}
      {changes.length === 0 ? (
        <div className="py-10 text-center text-white/55 font-light">Sin cambios todavía.</div>
      ) : (
        changes.map((c) => (
          <div key={c.id} className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: KIND_DOT[c.kind], boxShadow: `0 0 6px ${KIND_DOT[c.kind]}` }}
              />
              <span className="kicker text-white/55">{c.kind}</span>
              <span className="text-white/25">·</span>
              <span className="text-white/45 text-[0.72rem]">
                {new Date(c.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
              </span>
            </div>
            <p className="text-white/90 text-sm font-light">{c.title}</p>
            {c.body && <p className="text-white/55 text-[0.78rem] font-light mt-1">{c.body}</p>}
            {c.ref_url && (
              <a
                href={c.ref_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white/55 hover:text-white text-[0.72rem] mt-2 transition-colors"
              >
                ver ref <ExternalLink size={10} />
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// =====================================================================
// Comments
// =====================================================================

function CommentsTab({
  comments,
  currentUserId,
  onSubmit,
  onEdit,
  onDelete,
}: {
  comments: CommentWithAuthor[];
  currentUserId: string;
  onSubmit: (body: string, parentId: string | null) => Promise<void>;
  onEdit: (commentId: string, body: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<CommentWithAuthor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const tree = useMemo(() => buildCommentTree(comments), [comments]);

  const handleSubmit = async () => {
    if (!draft.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(draft, replyTo?.id ?? null);
    setDraft("");
    setReplyTo(null);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 sm:p-8 space-y-3">
        {tree.length === 0 ? (
          <div className="py-12 text-center">
            <MessageCircle size={24} className="text-white/35 mx-auto mb-3" />
            <p className="text-white/55 font-light">Sin comentarios todavía. Tirá el primero.</p>
          </div>
        ) : (
          tree.map((node) => (
            <CommentNode
              key={node.id}
              node={node}
              currentUserId={currentUserId}
              onReply={setReplyTo}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-white/[0.06] bg-[rgba(22,24,31,0.92)] backdrop-blur-md px-4 sm:px-6 py-3">
        {replyTo && (
          <div className="flex items-center gap-2 mb-2 text-[0.72rem] text-white/55">
            <CornerDownRight size={11} />
            <span>respondés a {replyTo.author?.full_name ?? "alguien"}</span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="ml-auto text-white/45 hover:text-white transition-colors"
            >
              cancelar
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={currentUserId ? "Escribí algo…" : "Iniciá sesión para comentar"}
            disabled={!currentUserId}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="flex-1 resize-none px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/90 placeholder:text-white/35 text-sm font-light focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-white/[0.05] transition-colors min-h-[42px] max-h-32 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim() || submitting || !currentUserId}
            className="px-4 py-2.5 rounded-2xl text-[0.78rem] text-white/95 border border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.18)] hover:bg-[rgba(59,130,246,0.28)] disabled:opacity-40 inline-flex items-center gap-1.5 transition-colors"
          >
            <Send size={13} />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface CommentNode extends CommentWithAuthor {
  children: CommentNode[];
}

function buildCommentTree(comments: CommentWithAuthor[]): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  comments.forEach((c) => byId.set(c.id, { ...c, children: [] }));
  const roots: CommentNode[] = [];
  byId.forEach((node) => {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function CommentNode({
  node,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: {
  node: CommentNode;
  currentUserId: string;
  onReply: (c: CommentWithAuthor) => void;
  onEdit: (commentId: string, body: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  depth?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(node.body);
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwn = !!currentUserId && node.author_id === currentUserId;

  const saveEdit = async () => {
    const next = draft.trim();
    if (!next || next === node.body) {
      setEditing(false);
      return;
    }
    await onEdit(node.id, next);
    setEditing(false);
  };

  return (
    <div className={depth > 0 ? "pl-5 border-l border-white/[0.06]" : ""}>
      <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1.5">
          <Avatar name={node.author?.full_name ?? "—"} url={node.author?.avatar_url ?? null} size={22} />
          <span className="text-white/85 text-[0.78rem] font-light">
            {node.author?.full_name ?? "Anónimo"}
          </span>
          <span className="text-white/30">·</span>
          <span className="text-white/40 text-[0.7rem]">
            {new Date(node.created_at).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {node.updated_at !== node.created_at && (
            <span className="text-white/30 text-[0.7rem]">(editado)</span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {depth === 0 && !editing && (
              <button
                type="button"
                onClick={() => onReply(node)}
                className="text-white/45 hover:text-white text-[0.7rem] transition-colors"
              >
                responder
              </button>
            )}
            {isOwn && !editing && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="text-white/45 hover:text-white transition-colors"
                  aria-label="Opciones"
                >
                  <MoreHorizontal size={14} />
                </button>
                {menuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Cerrar menú"
                      onClick={() => setMenuOpen(false)}
                      className="fixed inset-0 z-10 cursor-default"
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] rounded-xl bg-[rgba(28,31,39,0.96)] border border-white/[0.08] shadow-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(true);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/[0.05] text-[0.75rem] inline-flex items-center gap-2"
                      >
                        <Pencil size={12} /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setMenuOpen(false);
                          await onDelete(node.id);
                        }}
                        className="w-full text-left px-3 py-2 text-[#ff8aa8] hover:bg-white/[0.05] text-[0.75rem] inline-flex items-center gap-2"
                      >
                        <Trash2 size={12} /> Borrar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {editing ? (
          <div className="space-y-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              className="w-full resize-none px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/90 text-sm font-light focus:outline-none focus:border-[rgba(59,130,246,0.45)]"
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end text-[0.72rem]">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setDraft(node.body);
                }}
                className="text-white/55 hover:text-white transition-colors"
              >
                cancelar
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="px-3 py-1 rounded-full text-white/95 border border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.18)] hover:bg-[rgba(59,130,246,0.28)] transition-colors"
              >
                guardar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white/85 text-sm font-light whitespace-pre-wrap">{node.body}</p>
        )}
      </div>
      {node.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {node.children.map((child) => (
            <CommentNode
              key={child.id}
              node={child}
              currentUserId={currentUserId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Avatar({ name, url, size = 28 }: { name: string; url: string | null; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={size}
        height={size}
        unoptimized
        className="rounded-full object-cover border border-white/[0.08]"
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-[#3B82F6]/30 to-[#FF2DAA]/20 border border-white/[0.08] flex items-center justify-center text-white/85 font-light"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initials || "·"}
    </div>
  );
}
