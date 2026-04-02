"use client";

import Link from "next/link";
import { useState } from "react";
import { primerTrabajoData } from "@/content/primer-trabajo";
import type { GuideBundle } from "@/lib/primer-trabajo/guideTypes";

function signalLabel(id: string): string {
  const s = primerTrabajoData.employabilitySignals.find((x) => x.id === id);
  return s?.label ?? id;
}

function ruleTitle(id: string): string {
  const r = primerTrabajoData.eliminationRules.find((x) => x.id === id);
  return r?.title ?? id;
}

export default function PatternGuideList({ bundle }: { bundle: GuideBundle }) {
  const [openId, setOpenId] = useState<string | null>(bundle.patterns[0]?.id ?? null);

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-display font-bold text-2xl text-ocean-900 mb-2">{bundle.title}</h1>
        <p className="text-slate-600 text-sm leading-relaxed">{bundle.intro}</p>
      </header>

      <ul className="space-y-3">
        {bundle.patterns.map((p) => {
          const open = openId === p.id;
          return (
            <li key={p.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : p.id)}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
                aria-expanded={open}
              >
                <span className="font-display font-bold text-ocean-900 pr-4">{p.title}</span>
                <span className="text-ocean-500 text-sm shrink-0">{open ? "▲" : "▼"}</span>
              </button>
              {open && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-100 space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">Cómo te lee el recruiter</p>
                    <p className="text-slate-600 leading-relaxed">{p.recruiterView}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                      <p className="text-xs font-bold uppercase text-red-800 mb-2">Mal</p>
                      <p className="text-red-950/90 whitespace-pre-wrap leading-relaxed">{p.bad}</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                      <p className="text-xs font-bold uppercase text-emerald-800 mb-2">Bien</p>
                      <p className="text-emerald-950/90 whitespace-pre-wrap leading-relaxed">{p.good}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-2">Pasos de rewrite</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                      {p.rewriteSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.linkedSignals.map((id) => (
                      <span
                        key={id}
                        className="text-[11px] font-medium uppercase tracking-wide bg-ocean-50 text-ocean-800 px-2 py-1 rounded-full border border-ocean-100"
                        title={primerTrabajoData.employabilitySignals.find((s) => s.id === id)?.recruiterLens}
                      >
                        {signalLabel(id)}
                      </span>
                    ))}
                  </div>
                  {p.mayTriggerEliminationRuleIds.length > 0 && (
                    <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <span className="font-semibold">Puede disparar en diagnóstico: </span>
                      {p.mayTriggerEliminationRuleIds.map(ruleTitle).join(" · ")}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-center text-sm text-slate-600 pt-2">
        Pasá cada patrón a tareas concretas en el{" "}
        <Link href="/primer-trabajo/plan" className="font-semibold text-ocean-600 hover:underline">
          plan de acción (checklist)
        </Link>
        .
      </p>
    </div>
  );
}
