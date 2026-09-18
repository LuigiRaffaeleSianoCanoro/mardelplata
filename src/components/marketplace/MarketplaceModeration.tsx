"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui";
import {
  LOOKING_FOR_LABELS,
  PEDIDO_KIND_LABELS,
  STARTUP_STAGE_LABELS,
} from "@/lib/marketplace";
import type {
  MarketplaceLeadAdmin,
  MarketplacePedidoAdmin,
  MarketplaceStartupAdmin,
  MarketplaceStatus,
} from "@/lib/types/marketplace";

type Queue = "startups" | "pedidos" | "leads";
type StatusFilter = "pending" | "all" | MarketplaceStatus;

const STATUS_LABEL: Record<MarketplaceStatus, string> = {
  pending: "Pendiente",
  published: "Publicado",
  rejected: "Rechazado",
  archived: "Archivado",
};

function statusClass(status: MarketplaceStatus) {
  if (status === "published") return "bg-green-500/20 text-green-400";
  if (status === "pending") return "bg-yellow-500/20 text-yellow-400";
  if (status === "rejected") return "bg-red-500/20 text-red-400";
  return "bg-ocean-700/50 text-ocean-300";
}

export default function MarketplaceModeration() {
  const [queue, setQueue] = useState<Queue>("startups");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [startups, setStartups] = useState<MarketplaceStartupAdmin[]>([]);
  const [pedidos, setPedidos] = useState<MarketplacePedidoAdmin[]>([]);
  const [leads, setLeads] = useState<MarketplaceLeadAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const load = async () => {
    const supabase = createClient();
    const [s, p, l] = await Promise.all([
      supabase.from("marketplace_startups").select("*").order("created_at", { ascending: false }),
      supabase.from("marketplace_pedidos").select("*").order("created_at", { ascending: false }),
      supabase.from("marketplace_leads").select("*").order("created_at", { ascending: false }),
    ]);
    if (s.error || p.error || l.error) {
      setError(
        "No se pudo leer la cola. ¿Aplicaste scripts/020_marketplace.sql en Supabase?",
      );
    } else {
      setError("");
      setStartups((s.data as MarketplaceStartupAdmin[]) ?? []);
      setPedidos((p.data as MarketplacePedidoAdmin[]) ?? []);
      setLeads((l.data as MarketplaceLeadAdmin[]) ?? []);
      const nextNotes: Record<string, string> = {};
      for (const row of (s.data as MarketplaceStartupAdmin[]) ?? []) {
        nextNotes[`s-${row.id}`] = row.admin_notes ?? "";
      }
      for (const row of (p.data as MarketplacePedidoAdmin[]) ?? []) {
        nextNotes[`p-${row.id}`] = row.admin_notes ?? "";
      }
      setNotes(nextNotes);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const pendingCount =
    startups.filter((s) => s.status === "pending").length +
    pedidos.filter((p) => p.status === "pending").length +
    leads.filter((l) => l.status === "new").length;

  const visibleStartups = useMemo(
    () =>
      statusFilter === "all"
        ? startups
        : startups.filter((s) => s.status === statusFilter),
    [startups, statusFilter],
  );
  const visiblePedidos = useMemo(
    () =>
      statusFilter === "all"
        ? pedidos
        : pedidos.filter((p) => p.status === statusFilter),
    [pedidos, statusFilter],
  );

  const setStatus = async (
    table: "marketplace_startups" | "marketplace_pedidos",
    id: string,
    status: MarketplaceStatus,
    noteKey: string,
  ) => {
    setBusyId(id);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from(table)
      .update({ status, admin_notes: notes[noteKey] || null })
      .eq("id", id);
    setBusyId(null);
    if (updateError) {
      alert(updateError.message);
      return;
    }
    await load();
  };

  const setLeadStatus = async (id: string, status: MarketplaceLeadAdmin["status"]) => {
    setBusyId(id);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("marketplace_leads")
      .update({ status })
      .eq("id", id);
    setBusyId(null);
    if (updateError) {
      alert(updateError.message);
      return;
    }
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 rounded-full border-4 border-ocean-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ocean-300/70">
            / Marketplace
          </p>
          <h2 className="text-xl font-display font-bold text-white mt-1">
            Cola de moderación
          </h2>
          <p className="text-ocean-300/70 text-sm mt-1 max-w-2xl">
            Checklist: ¿es comunidad MdP / costa / ecosistema local? ¿spam? ¿el deck
            o el mail no se filtraron a la ficha pública? Publicar = OK de Luigi.
          </p>
        </div>
        <div className="text-ocean-300/70 text-xs font-mono">
          {pendingCount} pendiente{pendingCount === 1 ? "" : "s"}
        </div>
      </div>

      {error && (
        <p className="text-amber-300 text-sm mb-4">{error}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ["startups", "Startups"],
            ["pedidos", "Pedidos"],
            ["leads", "Leads"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setQueue(id)}
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              queue === id ? "bg-ocean-400 text-ocean-950" : "bg-ocean-700/50 text-ocean-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {queue !== "leads" && (
        <div className="flex flex-wrap gap-2 mb-4">
          {(["pending", "published", "rejected", "archived", "all"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setStatusFilter(id)}
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                statusFilter === id ? "border border-ocean-300 text-white" : "text-ocean-400"
              }`}
            >
              {id === "all" ? "Todos" : STATUS_LABEL[id]}
            </button>
          ))}
        </div>
      )}

      {queue === "startups" && (
        <div className="flex flex-col gap-4">
          {visibleStartups.length === 0 && (
            <GlassCard className="p-6 text-ocean-400 text-sm">
              No hay startups en este filtro. Las altas nuevas aparecen acá como pending.
            </GlassCard>
          )}
          {visibleStartups.map((row) => (
            <GlassCard key={row.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-white font-display font-bold text-lg">{row.name}</h3>
                  <p className="text-ocean-300 text-sm">{row.one_liner}</p>
                  <p className="text-ocean-400 text-xs mt-1">
                    {STARTUP_STAGE_LABELS[row.stage]} · {row.city} ·{" "}
                    {row.looking_for.map((item) => LOOKING_FOR_LABELS[item]).join(", ") || "—"}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusClass(row.status)}`}>
                  {STATUS_LABEL[row.status]}
                </span>
              </div>
              <p className="text-ocean-200 text-sm mt-3 whitespace-pre-wrap">{row.description}</p>
              <div className="mt-3 text-sm text-ocean-300 space-y-1">
                <p>
                  Email: <span className="font-mono text-white/90">{row.contact_email}</span>
                  {row.contact_phone ? ` · Tel: ${row.contact_phone}` : ""}
                </p>
                {row.deck_url && (
                  <p>
                    Deck:{" "}
                    <a className="text-ocean-200 underline" href={row.deck_url} target="_blank" rel="noreferrer">
                      abrir (privado)
                    </a>
                  </p>
                )}
                {row.website && (
                  <p>
                    Web:{" "}
                    <a className="text-ocean-200 underline" href={row.website} target="_blank" rel="noreferrer">
                      {row.website}
                    </a>
                  </p>
                )}
              </div>
              <label className="block text-xs text-ocean-400 mt-3 mb-1">Notas internas</label>
              <textarea
                className="w-full px-3 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white text-sm"
                rows={2}
                value={notes[`s-${row.id}`] ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [`s-${row.id}`]: e.target.value }))}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => setStatus("marketplace_startups", row.id, "published", `s-${row.id}`)}
                  className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300"
                >
                  Aprobar / publicar
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => setStatus("marketplace_startups", row.id, "rejected", `s-${row.id}`)}
                  className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300"
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => setStatus("marketplace_startups", row.id, "archived", `s-${row.id}`)}
                  className="text-xs px-3 py-1 rounded-full bg-ocean-700/50 text-ocean-200"
                >
                  Archivar
                </button>
                {row.status === "published" && (
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => setStatus("marketplace_startups", row.id, "pending", `s-${row.id}`)}
                    className="text-xs px-3 py-1 rounded-full text-yellow-300"
                  >
                    Volver a pending
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {queue === "pedidos" && (
        <div className="flex flex-col gap-4">
          {visiblePedidos.length === 0 && (
            <GlassCard className="p-6 text-ocean-400 text-sm">
              No hay pedidos en este filtro.
            </GlassCard>
          )}
          {visiblePedidos.map((row) => (
            <GlassCard key={row.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-ocean-400 text-xs">{PEDIDO_KIND_LABELS[row.kind]}</p>
                  <h3 className="text-white font-display font-bold text-lg">{row.title}</h3>
                  <p className="text-ocean-300 text-sm">
                    {row.publisher_display}
                    {row.organization ? ` · ${row.organization}` : ""}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusClass(row.status)}`}>
                  {STATUS_LABEL[row.status]}
                </span>
              </div>
              <p className="text-ocean-200 text-sm mt-3 whitespace-pre-wrap">{row.description}</p>
              <p className="text-sm text-ocean-300 mt-3">
                Email: <span className="font-mono text-white/90">{row.contact_email}</span>
                {row.linkedin_url ? (
                  <>
                    {" · "}
                    <a className="underline" href={row.linkedin_url} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  </>
                ) : null}
              </p>
              <label className="block text-xs text-ocean-400 mt-3 mb-1">Notas internas</label>
              <textarea
                className="w-full px-3 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white text-sm"
                rows={2}
                value={notes[`p-${row.id}`] ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [`p-${row.id}`]: e.target.value }))}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => setStatus("marketplace_pedidos", row.id, "published", `p-${row.id}`)}
                  className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300"
                >
                  Aprobar / publicar
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => setStatus("marketplace_pedidos", row.id, "rejected", `p-${row.id}`)}
                  className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300"
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => setStatus("marketplace_pedidos", row.id, "archived", `p-${row.id}`)}
                  className="text-xs px-3 py-1 rounded-full bg-ocean-700/50 text-ocean-200"
                >
                  Archivar
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {queue === "leads" && (
        <GlassCard className="overflow-x-auto p-5">
          {leads.length === 0 ? (
            <p className="text-ocean-400 text-sm">Todavía no hay contactos. Aparecen cuando alguien usa Contactar / Pedir deck / Me interesa.</p>
          ) : (
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-ocean-300/70 text-xs uppercase tracking-wider border-b border-ocean-700/30">
                  <th className="py-2 pr-3">Tipo</th>
                  <th className="py-2 pr-3">De</th>
                  <th className="py-2 pr-3">Mensaje</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 pr-3 text-right">·</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-ocean-700/20">
                    <td className="py-2 pr-3 text-ocean-200">{lead.kind}</td>
                    <td className="py-2 pr-3">
                      <div className="text-white">{lead.from_name}</div>
                      <div className="font-mono text-xs text-ocean-300">{lead.from_email}</div>
                    </td>
                    <td className="py-2 pr-3 text-ocean-200 max-w-sm">{lead.message}</td>
                    <td className="py-2 pr-3 text-ocean-300">{lead.status}</td>
                    <td className="py-2 pr-3 text-right">
                      {lead.status === "new" && (
                        <button
                          type="button"
                          disabled={busyId === lead.id}
                          onClick={() => setLeadStatus(lead.id, "notified")}
                          className="text-xs text-ocean-200 hover:text-white"
                        >
                          Marcar notificado
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassCard>
      )}
    </div>
  );
}
