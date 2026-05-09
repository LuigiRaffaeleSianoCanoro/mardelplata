"use client";

// CommandPalette publico — modal Cmd+K para la home/navbar.
// Busca eventos y miembros en supabase. El blog es feed agregado
// (sin storage) asi que mostramos un link estatico al /blog.
//
// Reutiliza las clases .cmdk-* ya estilizadas en globals.css
// (originalmente para src/components/app/CommandPalette.tsx que
// existe para el admin/red).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface EventResult {
  id: string;
  title: string;
  date: string | null;
}

interface ProfileResult {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<EventResult[]>([]);
  const [profiles, setProfiles] = useState<ProfileResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Foco al input cuando abre + reset al cerrar
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
      setEvents([]);
      setProfiles([]);
    }
  }, [open]);

  // Escape cierra
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Debounced search 200ms
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length === 0) {
      setEvents([]);
      setProfiles([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const like = `%${q}%`;
      const [{ data: ev }, { data: pr }] = await Promise.all([
        supabase
          .from("events")
          .select("id, title, date")
          .eq("is_published", true)
          .or(`title.ilike.${like},description.ilike.${like}`)
          .order("date", { ascending: false })
          .limit(5),
        supabase
          .from("profiles")
          .select("id, full_name, bio, avatar_url")
          .or(`full_name.ilike.${like},bio.ilike.${like}`)
          .limit(5),
      ]);
      setEvents((ev as EventResult[]) ?? []);
      setProfiles((pr as ProfileResult[]) ?? []);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query, open]);

  if (!open) return null;

  const hasResults = events.length > 0 || profiles.length > 0;
  const empty = query.trim().length > 0 && !loading && !hasResults;

  return (
    <div className="cmdk-root" role="dialog" aria-modal="true" aria-label="Buscador">
      <button className="cmdk-backdrop" onClick={onClose} aria-label="Cerrar" />
      <div className="cmdk-panel">
        <div className="cmdk-input-row">
          <SearchIcon />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Buscar eventos, miembros..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="cmdk-kbd">esc</kbd>
        </div>

        <div className="cmdk-list">
          {query.trim().length === 0 && (
            <div className="cmdk-hint">
              Buscá por nombre o tema. El{" "}
              <Link href="/blog" onClick={onClose} className="cmdk-hint-link">
                blog
              </Link>{" "}
              es un feed agregado, no se filtra desde aca.
            </div>
          )}

          {loading && <div className="cmdk-empty">Buscando...</div>}

          {empty && (
            <div className="cmdk-empty">
              Sin resultados para &quot;{query}&quot;
            </div>
          )}

          {events.length > 0 && (
            <>
              <div className="cmdk-group-label">Eventos</div>
              {events.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  className="cmdk-item"
                  onClick={() => {
                    router.push(`/eventos#${ev.id}`);
                    onClose();
                  }}
                >
                  <span className="cmdk-item-title">{ev.title}</span>
                  {ev.date && (
                    <span className="cmdk-item-meta">
                      {new Date(ev.date).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </button>
              ))}
            </>
          )}

          {profiles.length > 0 && (
            <>
              <div className="cmdk-group-label">Miembros</div>
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="cmdk-item"
                  onClick={() => {
                    router.push(`/red#${p.id}`);
                    onClose();
                  }}
                >
                  {p.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.avatar_url}
                      alt=""
                      className="cmdk-item-avatar"
                      loading="lazy"
                    />
                  )}
                  <span className="cmdk-item-title">
                    {p.full_name ?? "Miembro"}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="cmdk-footer">
          <span>Tip: Cmd/Ctrl+K para abrir</span>
          <span>
            <kbd className="cmdk-kbd">esc</kbd> cerrar
          </span>
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: "rgba(255,255,255,0.6)" }}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
