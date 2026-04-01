"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import hrQuizData from "@/content/primer-trabajo/hr-interview-quiz.json";
import type { HrQuizBundle } from "@/lib/primer-trabajo/hr-quiz";
import { scoreHrQuiz } from "@/lib/primer-trabajo/hr-quiz";
import { usePrimerTrabajoPersist } from "@/lib/primer-trabajo/persist";

const bundle = hrQuizData as HrQuizBundle;

export default function HrInterviewQuizClient() {
  const { hydrated, hrQuizResult, saveHrQuiz, clearHrQuiz } = usePrimerTrabajoPersist();
  const [mode, setMode] = useState<"quiz" | "summary">("quiz");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const items = bundle.items;
  const total = items.length;
  const current = items[index];

  useEffect(() => {
    if (!hydrated) return;
    if (hrQuizResult) setMode("summary");
  }, [hydrated, hrQuizResult]);

  const progress = total === 0 ? 0 : Math.round(((index + (selected[current?.id ?? ""] ? 1 : 0)) / total) * 100);

  const finish = () => {
    const result = scoreHrQuiz(bundle, selected);
    saveHrQuiz(result);
    setMode("summary");
  };

  const next = () => {
    if (!current || !selected[current.id]) return;
    if (index + 1 >= total) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
  };

  const back = () => setIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    clearHrQuiz();
    setSelected({});
    setIndex(0);
    setMode("quiz");
  };

  const wrongPicks = useMemo(() => {
    if (!hrQuizResult) return [];
    return hrQuizResult.answers.filter((a) => !a.ideal);
  }, [hrQuizResult]);

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">Cargando…</div>
    );
  }

  if (mode === "summary" && hrQuizResult) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-xl text-ocean-900">Resultado simulador HR</h2>
          <p className="text-3xl font-bold text-ocean-600">{hrQuizResult.score}%</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Este score se fusiona con la señal «Respuestas HR / screening» cuando completás el{" "}
            <Link href="/primer-trabajo/diagnostico" className="text-ocean-700 font-semibold underline">
              diagnóstico
            </Link>
            {` `}o si ya lo tenías guardado, se actualizó al terminar este quiz.
          </p>
          <p className="text-xs text-slate-500">
            Completado:{" "}
            {new Date(hrQuizResult.completedAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-ocean-500 text-ocean-700 px-5 py-2.5 text-sm font-semibold hover:bg-ocean-50"
            >
              Repetir simulador
            </button>
            <Link
              href="/primer-trabajo/diagnostico"
              className="inline-flex items-center justify-center rounded-full bg-ocean-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-ocean-600"
            >
              Ir al diagnóstico
            </Link>
            <Link
              href="/primer-trabajo"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        {wrongPicks.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-amber-950">Repasá estas respuestas</h3>
            <ul className="space-y-4 text-sm text-amber-950/95">
              {wrongPicks.map((a) => {
                const item = bundle.items.find((i) => i.id === a.questionId);
                const opt = item?.options.find((o) => o.id === a.optionId);
                if (!item || !opt) return null;
                return (
                  <li key={a.questionId} className="border-t border-amber-200/80 pt-4 first:border-t-0 first:pt-0">
                    <p className="font-semibold text-amber-950 mb-1">{item.prompt}</p>
                    <p className="text-amber-900/90 mb-2">
                      <span className="font-medium">Elegiste:</span> {opt.label}
                    </p>
                    <p className="text-amber-900/85 mb-1">{opt.whyWrong}</p>
                    <p className="text-amber-950">
                      <span className="font-medium">Rewrite:</span> {opt.rewriteHint}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="text-sm text-slate-600 text-center">
          Para práctica con otra persona:{" "}
          <a href="https://www.pramp.com/" className="text-ocean-700 font-medium underline" target="_blank" rel="noopener noreferrer">
            Pramp
          </a>
          {`, `}
          <a
            href="https://interviewing.io/"
            className="text-ocean-700 font-medium underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            interviewing.io
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      {current && (
        <>
          <div className="mb-6">
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
              <span>
                Pregunta {index + 1} / {total}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-ocean-500 transition-all rounded-full" style={{ width: `${Math.min(100, ((index + 1) / total) * 100)}%` }} />
            </div>
          </div>

          <p className="font-display font-bold text-xl text-ocean-900 mb-6 leading-snug">{current.prompt}</p>

          <ul className="space-y-3">
            {current.options.map((opt) => {
              const isSelected = selected[current.id] === opt.id;
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => setSelected((s) => ({ ...s, [current.id]: opt.id }))}
                    className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
                      isSelected
                        ? "border-ocean-500 bg-ocean-50 text-ocean-900"
                        : "border-slate-200 hover:border-ocean-300 bg-white text-slate-800"
                    }`}
                  >
                    <span className="font-medium">{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={back}
              disabled={index === 0}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!selected[current.id]}
              className="rounded-full bg-ocean-500 text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-40 hover:bg-ocean-600"
            >
              {index + 1 >= total ? "Ver resultado" : "Siguiente"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
