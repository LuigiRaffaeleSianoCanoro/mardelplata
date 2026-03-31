"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { insertClassifiedListing } from "@/lib/classifieds/insertClassifiedListing";
import type { ClassifiedKind, ClassifiedListing, JobPosition } from "@/lib/types/classifieds";
import ClassifiedCard from "./ClassifiedCard";
import ClassifiedModal from "./ClassifiedModal";
import PublishWizard from "./PublishWizard";

type VoteRow = { listing_id: string; vote: number; user_id: string };

type VoteAgg = { likes: number; dislikes: number; myVote: number | null };

function parseListing(row: Record<string, unknown>): ClassifiedListing {
  let positions: JobPosition[] = [];
  const raw = row.positions;
  if (Array.isArray(raw)) {
    positions = raw.map((p) => {
      if (typeof p !== "object" || p === null) return { title: "", description: "", link: "" };
      const o = p as Record<string, unknown>;
      return {
        title: typeof o.title === "string" ? o.title : "",
        description: typeof o.description === "string" ? o.description : "",
        link: typeof o.link === "string" ? o.link : "",
      };
    });
  }
  const tags = Array.isArray(row.tags) ? (row.tags as string[]).filter((t) => typeof t === "string") : [];

  return {
    id: String(row.id),
    author_id: String(row.author_id),
    kind: row.kind === "job" ? "job" : "freelance",
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    external_url: row.external_url == null ? null : String(row.external_url),
    positions,
    tags,
    created_at: String(row.created_at ?? ""),
    expires_at: String(row.expires_at ?? ""),
    profiles: (() => {
      const p = row.profiles;
      if (!p || typeof p !== "object") return null;
      const one = Array.isArray(p) ? p[0] : p;
      if (!one || typeof one !== "object") return null;
      const o = one as Record<string, unknown>;
      return {
        full_name: typeof o.full_name === "string" ? o.full_name : null,
        email: typeof o.email === "string" ? o.email : null,
      };
    })(),
  };
}

function buildVoteMap(
  votes: VoteRow[] | null,
  listingIds: string[],
  userId: string | undefined,
): Map<string, VoteAgg> {
  const map = new Map<string, VoteAgg>();
  for (const id of listingIds) {
    map.set(id, { likes: 0, dislikes: 0, myVote: null });
  }
  if (!votes) return map;
  for (const v of votes) {
    const cur = map.get(v.listing_id);
    if (!cur) continue;
    if (v.vote === 1) cur.likes += 1;
    else if (v.vote === -1) cur.dislikes += 1;
    if (userId && v.user_id === userId) cur.myVote = v.vote;
  }
  return map;
}

function BolsaInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deepId = searchParams.get("id");

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [listings, setListings] = useState<ClassifiedListing[]>([]);
  const [voteMap, setVoteMap] = useState<Map<string, VoteAgg>>(new Map());
  const [dataLoading, setDataLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filterKind, setFilterKind] = useState<"all" | ClassifiedKind>("all");
  const [modalListing, setModalListing] = useState<ClassifiedListing | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const loadListings = useCallback(async () => {
    setDataLoading(true);
    setLoadError(null);
    const { data: rows, error } = await supabase
      .from("classified_listings")
      .select(
        `
        *,
        profiles (
          full_name,
          email
        )
      `,
      )
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[bolsa] list", error);
      setLoadError(error.message);
      setListings([]);
      setVoteMap(new Map());
      setDataLoading(false);
      return;
    }

    const parsed = (rows ?? []).map((r: Record<string, unknown>) => parseListing(r));
    setListings(parsed);

    const ids = parsed.map((l) => l.id);
    if (ids.length === 0) {
      setVoteMap(new Map());
      setDataLoading(false);
      return;
    }

    const { data: votes, error: vErr } = await supabase
      .from("classified_votes")
      .select("listing_id, vote, user_id")
      .in("listing_id", ids);

    if (vErr) {
      console.error("[bolsa] votes", vErr);
    }

    const uid = (await supabase.auth.getUser()).data.user?.id;
    setVoteMap(buildVoteMap((votes as VoteRow[]) ?? null, ids, uid));
    setDataLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!user) {
      setListings([]);
      setVoteMap(new Map());
      setModalListing(null);
      setDataLoading(false);
      return;
    }
    void loadListings();
  }, [user, loadListings]);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!cancelled) {
        setUser(u);
        setAuthLoading(false);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    if (!deepId || listings.length === 0) return;
    const found = listings.find((l: ClassifiedListing) => l.id === deepId);
    if (found) setModalListing(found);
  }, [deepId, listings]);

  const setDeepLink = useCallback(
    (id: string | null) => {
      const url = new URL(window.location.href);
      if (id) url.searchParams.set("id", id);
      else url.searchParams.delete("id");
      router.replace(url.pathname + url.search, { scroll: false });
    },
    [router],
  );

  const openModal = useCallback(
    (l: ClassifiedListing) => {
      setModalListing(l);
      setDeepLink(l.id);
    },
    [setDeepLink],
  );

  const closeModal = useCallback(() => {
    setModalListing(null);
    setDeepLink(null);
  }, [setDeepLink]);

  useEffect(() => {
    if (!modalListing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalListing, closeModal]);

  const voteAgg = useCallback(
    (id: string): VoteAgg =>
      voteMap.get(id) ?? { likes: 0, dislikes: 0, myVote: null },
    [voteMap],
  );

  const handleVote = useCallback(
    async (listingId: string, dir: 1 | -1) => {
      if (!user) return;
      if (voteMap.get(listingId)?.myVote === dir) {
        const { error } = await supabase
          .from("classified_votes")
          .delete()
          .eq("listing_id", listingId)
          .eq("user_id", user.id);
        if (error) {
          console.error(error);
          return;
        }
      } else {
        const { error } = await supabase.from("classified_votes").upsert(
          { listing_id: listingId, user_id: user.id, vote: dir },
          { onConflict: "listing_id,user_id" },
        );
        if (error) {
          console.error(error);
          return;
        }
      }

      const { data: votes } = await supabase
        .from("classified_votes")
        .select("listing_id, vote, user_id")
        .in("listing_id", listings.map((l) => l.id));

      setVoteMap(
        buildVoteMap((votes as VoteRow[]) ?? null, listings.map((l) => l.id), user.id),
      );
    },
    [user, supabase, listings, voteMap],
  );

  const handleDelete = useCallback(
    async (listingId: string) => {
      if (!user) return;
      if (!window.confirm("¿Borrar este anuncio? No se puede deshacer.")) return;
      const { error } = await supabase.from("classified_listings").delete().eq("id", listingId);
      if (error) {
        console.error(error);
        return;
      }
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      setModalListing((m) => (m?.id === listingId ? null : m));
      setDeepLink(null);
    },
    [user, supabase, setDeepLink],
  );

  const handlePublish = useCallback(
    async (payload: {
      kind: ClassifiedKind;
      title: string;
      description: string;
      external_url: string | null;
      positions: JobPosition[];
      tags: string[];
    }) => {
      if (!user) throw new Error("No hay sesión.");
      const { error } = await insertClassifiedListing(supabase, user.id, payload);
      if (error) throw new Error(error.message);
      await loadListings();
    },
    [user, supabase, loadListings],
  );

  const filtered = useMemo(() => {
    if (filterKind === "all") return listings;
    return listings.filter((l) => l.kind === filterKind);
  }, [listings, filterKind]);

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-ocean-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center bolsa-paper rounded-2xl border border-ocean-300/40 p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold text-slate-900 mb-3">Bolsa de trabajo</h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Para ver los clasificados, publicar avisos y votar, necesitás iniciar sesión con tu cuenta de MdPDev.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/auth/login"
            className="inline-flex justify-center items-center px-6 py-3 rounded-full bg-ocean-600 hover:bg-ocean-500 text-white text-sm font-semibold transition-colors"
          >
            Ingresar
          </a>
          <a
            href="/auth/registro"
            className="inline-flex justify-center items-center px-6 py-3 rounded-full border border-ocean-600 text-ocean-700 hover:bg-ocean-50 text-sm font-semibold transition-colors"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bolsa-open bolsa-paper max-w-6xl mx-auto px-4 py-8 sm:py-10 rounded-2xl border border-ocean-300/35 shadow-md">
        <header className="mb-8 border-b border-ocean-600/25 pb-5">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Bolsa de trabajo
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">
            Ofertas laborales y servicios freelance de la comunidad. Avisos de 30 días; estilo clasificados.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={() => setFilterKind("all")}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                filterKind === "all"
                  ? "bg-ocean-700 text-white border-ocean-700 shadow-sm"
                  : "border-ocean-300/60 text-slate-700 hover:bg-white/80"
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterKind("job")}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                filterKind === "job"
                  ? "bg-ocean-700 text-white border-ocean-700 shadow-sm"
                  : "border-ocean-300/60 text-slate-700 hover:bg-white/80"
              }`}
            >
              Trabajos
            </button>
            <button
              type="button"
              onClick={() => setFilterKind("freelance")}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                filterKind === "freelance"
                  ? "bg-ocean-700 text-white border-ocean-700 shadow-sm"
                  : "border-ocean-300/60 text-slate-700 hover:bg-white/80"
              }`}
            >
              Freelance
            </button>
            <button
              type="button"
              onClick={() => setPublishOpen(true)}
              className="text-xs px-4 py-2 ml-auto inline-flex items-center bg-ocean-400 hover:bg-ocean-300 text-white font-semibold rounded-full shadow-md shadow-ocean-500/25 transition-colors"
            >
              + Publicar
            </button>
          </div>
        </header>

        {loadError && (
          <p className="text-red-800 text-sm mb-4">
            Error al cargar: {loadError}. Si acabás de crear las tablas, ejecutá el script SQL en Supabase.
          </p>
        )}

        {dataLoading && listings.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 rounded-full border-2 border-ocean-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-12 border border-dashed border-ocean-300/50 rounded-xl bg-white/40">
            No hay avisos en esta categoría todavía. ¡Sé el primero en publicar!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {filtered.map((l) => {
              const v = voteAgg(l.id);
              return (
                <ClassifiedCard
                  key={l.id}
                  listing={l}
                  likes={v.likes}
                  dislikes={v.dislikes}
                  myVote={v.myVote}
                  onOpen={() => openModal(l)}
                  onVote={(dir) => void handleVote(l.id, dir)}
                  canDelete={l.author_id === user.id}
                  onDelete={() => void handleDelete(l.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {modalListing && (
        <ClassifiedModal
          listing={modalListing}
          open={!!modalListing}
          onClose={closeModal}
          likes={voteAgg(modalListing.id).likes}
          dislikes={voteAgg(modalListing.id).dislikes}
          myVote={voteAgg(modalListing.id).myVote}
          onVote={(dir) => void handleVote(modalListing.id, dir)}
          canDelete={modalListing.author_id === user.id}
          onDelete={() => void handleDelete(modalListing.id)}
        />
      )}

      <PublishWizard
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onSubmit={handlePublish}
      />
    </>
  );
}

export default function BolsaClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-ocean-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <BolsaInner />
    </Suspense>
  );
}
