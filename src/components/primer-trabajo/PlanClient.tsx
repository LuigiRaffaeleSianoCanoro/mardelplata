"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { primerTrabajoData } from "@/content/primer-trabajo";
import { usePrimerTrabajoPersist } from "@/lib/primer-trabajo/persist";
import { SILVER_DEV_RESUME_CHECKER_HREF } from "@/lib/primer-trabajo/silver-dev";
import type { ModulePriority } from "@/lib/primer-trabajo/types";

const priorityOrder: Record<ModulePriority, number> = { alta: 0, media: 1, baja: 2 };

const moduleGuideHref: Partial<Record<string, string>> = {
  cv: "/primer-trabajo/guia/cv",
  linkedin: "/primer-trabajo/guia/linkedin",
};

export default function PlanClient() {
  const { hydrated, diagnosticResult, checklistCheckedIds, toggleChecklistItem } = usePrimerTrabajoPersist();
  const [openId, setOpenId] = useState<string | null>(null);

  const modules = useMemo(() => {
    return [...primerTrabajoData.checklistModules].sort((a, b) => {
      const pa = priorityOrder[a.priority as ModulePriority];
      const pb = priorityOrder[b.priority as ModulePriority];
      return pa - pb;
    });
  }, []);

  const allItemIds = useMemo(
    () => modules.flatMap((m) => m.items.map((i) => i.id)),
    [modules]
  );
  const done = checklistCheckedIds.length;
  const total = allItemIds.length;
  const checklistPct = total === 0 ? 0 : Math.round((done / total) * 100);

  const readiness = useMemo(() => {
    if (!diagnosticResult) return checklistPct;
    return Math.round(diagnosticResult.interviewProbability * 0.5 + checklistPct * 0.5);
  }, [diagnosticResult, checklistPct]);

  if (!hydrated) {
    return <p className="text-muted-foreground">Cargando…</p>;
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display font-bold text-lg text-foreground mb-2">Estás {readiness}% en camino</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Combinamos tu última probabilidad de entrevista ({diagnosticResult?.interviewProbability ?? "—"}%) con el progreso del
          checklist ({checklistPct}%).
        </p>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full origin-left rounded-full bg-[var(--oxido)] transition-transform duration-300" style={{ transform: `scaleX(${readiness / 100})` }} />
        </div>
        {!diagnosticResult && (
          <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
            Hacé el{" "}
            <Link href="/primer-trabajo/diagnostico" className="font-semibold underline">
              diagnóstico
            </Link>{" "}
            para ver la probabilidad estimada.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display font-bold text-lg text-foreground mb-1">Esta semana (mínimo)</h2>
        <p className="text-xs text-muted-foreground mb-4">Sin esto estás perdiendo tiempo frente a otros candidatos que sí cierran entregables.</p>
        {diagnosticResult?.derivedTags?.some((t) => t === "silver_skipped" || t === "silver_grade_low") && (
          <div className="mb-4 space-y-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            <p className="font-semibold">Semana 1: CV con Silver Dev antes de aplicar en masa</p>
            <p className="leading-relaxed">
              Tu último diagnóstico marca que no validaste el CV con el resume checker o tenés grade C o menos. Pará las tandas grandes: pasá el PDF por Silver Dev, corregí hasta{" "}
              <strong>grade A mínimo</strong> (objetivo S), y recién ahí volvé a postular en serio.
            </p>
            <a
              href={SILVER_DEV_RESUME_CHECKER_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-[var(--oxido)] underline underline-offset-2 hover:text-foreground"
            >
              Abrir resume checker (silver.dev/resume)
            </a>
          </div>
        )}
        <div className="space-y-6 text-sm text-muted-foreground">
          <div>
            <h3 className="font-display font-bold text-foreground text-base mb-2">Semana 1 — Fundamentos y señal mínima</h3>
            <ol className="list-decimal list-inside space-y-2">
              {primerTrabajoData.weekPlan.week1.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground text-base mb-2">Semana 2 — Publicación, contacto y entrevista</h3>
            <ol className="list-decimal list-inside space-y-2">
              {primerTrabajoData.weekPlan.week2.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display font-bold text-lg text-foreground mb-2">Profundizar: guías mal / bien</h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          El checklist es acción por ítem; las guías son patrones concretos (cómo te lee un recruiter, ejemplos y pasos de rewrite).
          Ideal para cerrar los módulos <strong>CV</strong> y <strong>LinkedIn</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/primer-trabajo/guia/cv"
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Guía CV →
          </Link>
          <Link
            href="/primer-trabajo/guia/linkedin"
            className="flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-transparent px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Guía LinkedIn →
          </Link>
        </div>
      </section>

      <div className="space-y-6">
        {modules.map((mod) => (
          <section key={mod.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-muted/40 px-5 py-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl" aria-hidden>
                {mod.emoji}
              </span>
              <h3 className="font-display font-bold text-foreground flex-1">{mod.title}</h3>
              <span
                className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                  mod.priority === "alta"
                    ? "bg-red-500/15 text-red-300"
                    : mod.priority === "media"
                      ? "bg-amber-500/15 text-amber-200"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {mod.priority}
              </span>
              {moduleGuideHref[mod.id] && (
                <Link
                  href={moduleGuideHref[mod.id]!}
                  className="shrink-0 text-sm font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  {mod.id === "cv" ? "Guía CV con patrones" : "Guía LinkedIn con patrones"}
                </Link>
              )}
            </div>
            <ul className="divide-y divide-border">
              {mod.items.map((item) => {
                const checked = checklistCheckedIds.includes(item.id);
                const open = openId === item.id;
                return (
                  <li key={item.id} className="bg-card">
                    <div className="flex items-start gap-3 px-5 py-4">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="mt-1 h-4 w-4 rounded border-border text-[var(--oxido)] focus:ring-[var(--ring)]"
                        aria-labelledby={`label-${item.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          id={`label-${item.id}`}
                          onClick={() => setOpenId(open ? null : item.id)}
                          className="w-full text-left font-semibold text-foreground hover:text-[var(--oxido)]"
                        >
                          {item.title}
                        </button>
                        {open && (
                          <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium text-red-400">Mal:</span> {item.badExample}
                            </p>
                            <p>
                              <span className="font-medium text-emerald-400">Bien:</span> {item.goodExample}
                            </p>
                            <p>
                              <span className="font-medium text-foreground">Por qué está mal:</span> {item.whyWrong}
                            </p>
                            <p>
                              <span className="font-medium text-foreground">Acción:</span> {item.action}
                            </p>
                            {item.suggestedRewrite !== "N/A" && (
                              <p className="rounded-lg border border-border bg-muted/50 p-3">
                                <span className="font-medium text-foreground">Rewrite sugerido:</span> {item.suggestedRewrite}
                              </p>
                            )}
                            {item.antiPatterns && item.antiPatterns.length > 0 && (
                              <div className="rounded-lg border border-border bg-muted p-3 text-foreground">
                                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide mb-2">Anti-patrones (te descartan)</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                  {item.antiPatterns.map((ap, i) => (
                                    <li key={i}>{ap}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
