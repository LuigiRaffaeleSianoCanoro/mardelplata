"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { primerTrabajoData } from "@/content/primer-trabajo";
import { usePrimerTrabajoPersist } from "@/lib/primer-trabajo/persist";
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
    return <p className="text-slate-600">Cargando…</p>;
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-ocean-200 bg-white p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-ocean-900 mb-2">Estás {readiness}% en camino</h2>
        <p className="text-sm text-slate-600 mb-4">
          Combinamos tu última probabilidad de entrevista ({diagnosticResult?.interviewProbability ?? "—"}%) con el progreso del
          checklist ({checklistPct}%).
        </p>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-ocean-500 rounded-full transition-all" style={{ width: `${readiness}%` }} />
        </div>
        {!diagnosticResult && (
          <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            Hacé el{" "}
            <Link href="/primer-trabajo/diagnostico" className="font-semibold underline">
              diagnóstico
            </Link>{" "}
            para ver la probabilidad estimada.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-ocean-900 mb-4">Esta semana</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
          {primerTrabajoData.weekPlan.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border-2 border-ocean-200 bg-gradient-to-br from-ocean-50/80 to-white p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-ocean-900 mb-2">Profundizar: guías mal / bien</h2>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          El checklist es acción por ítem; las guías son patrones concretos (cómo te lee un recruiter, ejemplos y pasos de rewrite).
          Ideal para cerrar los módulos <strong>CV</strong> y <strong>LinkedIn</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/primer-trabajo/guia/cv"
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-ocean-600 text-white px-5 py-3 text-sm font-semibold hover:bg-ocean-700 transition-colors"
          >
            Guía CV →
          </Link>
          <Link
            href="/primer-trabajo/guia/linkedin"
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-white border-2 border-ocean-500 text-ocean-800 px-5 py-3 text-sm font-semibold hover:bg-ocean-50 transition-colors"
          >
            Guía LinkedIn →
          </Link>
        </div>
      </section>

      <div className="space-y-6">
        {modules.map((mod) => (
          <section key={mod.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-ocean-800/5 border-b border-slate-100 px-5 py-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl" aria-hidden>
                {mod.emoji}
              </span>
              <h3 className="font-display font-bold text-ocean-900 flex-1">{mod.title}</h3>
              <span
                className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                  mod.priority === "alta"
                    ? "bg-red-100 text-red-800"
                    : mod.priority === "media"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {mod.priority}
              </span>
              {moduleGuideHref[mod.id] && (
                <Link
                  href={moduleGuideHref[mod.id]!}
                  className="text-sm font-semibold text-ocean-700 hover:text-ocean-900 underline underline-offset-2 shrink-0"
                >
                  {mod.id === "cv" ? "Guía CV con patrones" : "Guía LinkedIn con patrones"}
                </Link>
              )}
            </div>
            <ul className="divide-y divide-slate-100">
              {mod.items.map((item) => {
                const checked = checklistCheckedIds.includes(item.id);
                const open = openId === item.id;
                return (
                  <li key={item.id} className="bg-white">
                    <div className="flex items-start gap-3 px-5 py-4">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500"
                        aria-labelledby={`label-${item.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          id={`label-${item.id}`}
                          onClick={() => setOpenId(open ? null : item.id)}
                          className="text-left font-semibold text-slate-900 hover:text-ocean-700 w-full"
                        >
                          {item.title}
                        </button>
                        {open && (
                          <div className="mt-3 space-y-3 text-sm text-slate-700">
                            <p>
                              <span className="font-medium text-red-700">Mal:</span> {item.badExample}
                            </p>
                            <p>
                              <span className="font-medium text-emerald-700">Bien:</span> {item.goodExample}
                            </p>
                            <p>
                              <span className="font-medium text-slate-900">Por qué está mal:</span> {item.whyWrong}
                            </p>
                            <p>
                              <span className="font-medium text-ocean-800">Acción:</span> {item.action}
                            </p>
                            {item.suggestedRewrite !== "N/A" && (
                              <p className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <span className="font-medium text-slate-900">Rewrite sugerido:</span> {item.suggestedRewrite}
                              </p>
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
