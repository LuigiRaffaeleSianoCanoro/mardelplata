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
      <header className="rounded-2xl border border-border bg-card p-6">
        <h1 className="font-display font-bold text-2xl text-foreground mb-2">{bundle.title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{bundle.intro}</p>
      </header>

      <ul className="space-y-3">
        {bundle.patterns.map((p) => {
          const open = openId === p.id;
          return (
            <li key={p.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : p.id)}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 transition-colors hover:bg-muted"
                aria-expanded={open}
              >
                <span className="font-display font-bold text-foreground pr-4">{p.title}</span>
                <span className="text-muted-foreground text-sm shrink-0">{open ? "▲" : "▼"}</span>
              </button>
              {open && (
                <div className="px-5 pb-5 pt-0 border-t border-border space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Cómo te lee el recruiter</p>
                    <p className="text-muted-foreground leading-relaxed">{p.recruiterView}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                      <p className="text-xs font-bold uppercase text-red-300 mb-2">Mal</p>
                      <p className="text-red-200 whitespace-pre-wrap leading-relaxed">{p.bad}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <p className="text-xs font-bold uppercase text-emerald-300 mb-2">Bien</p>
                      <p className="text-emerald-100 whitespace-pre-wrap leading-relaxed">{p.good}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">Pasos de rewrite</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
                      {p.rewriteSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.linkedSignals.map((id) => (
                      <span
                        key={id}
                        className="text-[11px] font-medium uppercase tracking-wide rounded-full border border-border bg-muted px-2 py-1 text-muted-foreground"
                        title={primerTrabajoData.employabilitySignals.find((s) => s.id === id)?.recruiterLens}
                      >
                        {signalLabel(id)}
                      </span>
                    ))}
                  </div>
                  {p.mayTriggerEliminationRuleIds.length > 0 && (
                    <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
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

      <p className="text-center text-sm text-muted-foreground pt-2">
        Pasá cada patrón a tareas concretas en el{" "}
        <Link href="/primer-trabajo/plan" className="font-semibold text-foreground hover:underline">
          plan de acción (checklist)
        </Link>
        .
      </p>
    </div>
  );
}
