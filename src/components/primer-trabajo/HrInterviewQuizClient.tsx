"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import hrQuizDataEs from "@/content/primer-trabajo/hr-interview-quiz.json";
import hrQuizDataEn from "@/content/primer-trabajo/hr-interview-quiz-en.json";
import type { HrQuizBundle } from "@/lib/primer-trabajo/hr-quiz";
import { scoreHrQuiz } from "@/lib/primer-trabajo/hr-quiz";
import { usePrimerTrabajoPersist } from "@/lib/primer-trabajo/persist";

const COPY = {
  es: {
    loading: "Cargando…",
    summaryTitle: "Resultado simulador Recursos Humanos",
    summaryBlurb:
      "Este puntaje se fusiona con la señal \"Respuestas de Recursos Humanos / screening\" cuando completás el",
    diagnostic: "diagnóstico",
    summaryBlurbEnd: "o si ya lo tenías guardado, se actualizó al terminar este quiz.",
    completed: "Completado:",
    restart: "Repetir simulador",
    goDiagnostic: "Ir al diagnóstico",
    backHome: "Volver al inicio",
    reviewTitle: "Repasá estas respuestas",
    chose: "Elegiste:",
    rewrite: "Rewrite:",
    practiceIntro: "Para práctica con otra persona:",
    question: "Pregunta",
    back: "Atrás",
    finish: "Ver resultado",
    next: "Siguiente",
    spokenTitle: "Modelos hablados (compará niveles)",
    levelA2: "A2",
    levelB1: "B1",
    levelB2: "B2",
  },
  en: {
    loading: "Loading…",
    summaryTitle: "HR interview simulator — results",
    summaryBlurb:
      "This score feeds the \"HR / screening responses\" signal when you complete the",
    diagnostic: "diagnostic",
    summaryBlurbEnd: "or, if you already had one saved, it was updated when you finished this quiz.",
    completed: "Completed:",
    restart: "Retake simulator",
    goDiagnostic: "Go to diagnostic",
    backHome: "Back to hub",
    reviewTitle: "Review these answers",
    chose: "You chose:",
    rewrite: "Rewrite:",
    practiceIntro: "For live practice with someone else:",
    question: "Question",
    back: "Back",
    finish: "See results",
    next: "Next",
    spokenTitle: "Spoken answer models (compare levels)",
    levelA2: "A2",
    levelB1: "B1",
    levelB2: "B2",
  },
} as const;

export type HrQuizVariant = keyof typeof COPY;

type Props = {
  variant?: HrQuizVariant;
  bundle?: HrQuizBundle;
};

const DEFAULT_BUNDLES: Record<HrQuizVariant, HrQuizBundle> = {
  es: hrQuizDataEs as HrQuizBundle,
  en: hrQuizDataEn as HrQuizBundle,
};

export default function HrInterviewQuizClient({ variant = "es", bundle }: Props) {
  const quizBundle = bundle ?? DEFAULT_BUNDLES[variant];
  const t = COPY[variant];
  const locale = variant === "en" ? "en-US" : "es-AR";

  const {
    hydrated,
    hrQuizResult,
    hrQuizEnResult,
    saveHrQuiz,
    saveHrQuizEn,
    clearHrQuiz,
    clearHrQuizEn,
  } = usePrimerTrabajoPersist();

  const savedResult = variant === "en" ? hrQuizEnResult : hrQuizResult;
  const saveResult = variant === "en" ? saveHrQuizEn : saveHrQuiz;
  const clearResult = variant === "en" ? clearHrQuizEn : clearHrQuiz;

  const [mode, setMode] = useState<"quiz" | "summary">("quiz");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const items = quizBundle.items;
  const total = items.length;
  const current = items[index];

  useEffect(() => {
    if (!hydrated) return;
    if (savedResult) setMode("summary");
  }, [hydrated, savedResult]);

  const progress = total === 0 ? 0 : Math.round(((index + (selected[current?.id ?? ""] ? 1 : 0)) / total) * 100);

  const finish = () => {
    const result = scoreHrQuiz(quizBundle, selected);
    saveResult(result);
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
    clearResult();
    setSelected({});
    setIndex(0);
    setMode("quiz");
  };

  const wrongPicks = useMemo(() => {
    if (!savedResult) return [];
    return savedResult.answers.filter((a) => !a.ideal);
  }, [savedResult]);

  const showSpokenModels = Boolean(current?.spokenModels && selected[current.id]);

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">{t.loading}</div>
    );
  }

  if (mode === "summary" && savedResult) {
    return (
      <div className="space-y-8 fade-up">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-xl text-ocean-900">{t.summaryTitle}</h2>
          <p className="text-3xl font-bold text-ocean-600">{savedResult.score}%</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t.summaryBlurb}{" "}
            <Link href="/primer-trabajo/diagnostico" className="text-ocean-700 font-semibold underline">
              {t.diagnostic}
            </Link>
            {` `}
            {t.summaryBlurbEnd}
          </p>
          <p className="text-xs text-slate-500">
            {t.completed}{" "}
            {new Date(savedResult.completedAt).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-ocean-500 text-ocean-700 px-5 py-2.5 text-sm font-semibold hover:bg-ocean-50"
            >
              {t.restart}
            </button>
            <Link
              href="/primer-trabajo/diagnostico"
              className="inline-flex items-center justify-center rounded-full bg-ocean-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-ocean-600"
            >
              {t.goDiagnostic}
            </Link>
            <Link
              href="/primer-trabajo"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t.backHome}
            </Link>
          </div>
        </div>

        {wrongPicks.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-amber-950">{t.reviewTitle}</h3>
            <ul className="space-y-4 text-sm text-amber-950/95">
              {wrongPicks.map((a) => {
                const item = quizBundle.items.find((i) => i.id === a.questionId);
                const opt = item?.options.find((o) => o.id === a.optionId);
                if (!item || !opt) return null;
                return (
                  <li key={a.questionId} className="border-t border-amber-200/80 pt-4 first:border-t-0 first:pt-0">
                    <p className="font-semibold text-amber-950 mb-1">{item.prompt}</p>
                    <p className="text-amber-900/90 mb-2">
                      <span className="font-medium">{t.chose}</span> {opt.label}
                    </p>
                    <p className="text-amber-900/85 mb-1">{opt.whyWrong}</p>
                    <p className="text-amber-950">
                      <span className="font-medium">{t.rewrite}</span> {opt.rewriteHint}
                    </p>
                    {item.spokenModels ? (
                      <div className="mt-3 space-y-2 rounded-xl border border-amber-200/60 bg-white/60 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">{t.spokenTitle}</p>
                        <p>
                          <span className="font-semibold">{t.levelA2}:</span> {item.spokenModels.a2}
                        </p>
                        <p>
                          <span className="font-semibold">{t.levelB1}:</span> {item.spokenModels.b1}
                        </p>
                        <p>
                          <span className="font-semibold">{t.levelB2}:</span> {item.spokenModels.b2}
                        </p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="text-sm text-slate-600 text-center">
          {t.practiceIntro}{" "}
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
                {t.question} {index + 1} / {total}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full w-full bg-ocean-500 origin-left transition-transform duration-300 rounded-full"
                style={{ transform: `scaleX(${Math.min(1, (index + 1) / total)})` }}
              />
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
                    className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-colors active:scale-[0.99] ${
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

          {showSpokenModels && current.spokenModels ? (
            <div className="mt-6 rounded-xl border border-ocean-200 bg-ocean-50/60 p-4 space-y-3 text-sm text-ocean-950">
              <p className="font-semibold text-ocean-900">{t.spokenTitle}</p>
              <p>
                <span className="inline-flex items-center rounded-full bg-ocean-200/80 px-2 py-0.5 text-xs font-bold text-ocean-900 mr-2">
                  {t.levelA2}
                </span>
                {current.spokenModels.a2}
              </p>
              <p>
                <span className="inline-flex items-center rounded-full bg-ocean-300/80 px-2 py-0.5 text-xs font-bold text-ocean-900 mr-2">
                  {t.levelB1}
                </span>
                {current.spokenModels.b1}
              </p>
              <p>
                <span className="inline-flex items-center rounded-full bg-ocean-500/90 px-2 py-0.5 text-xs font-bold text-white mr-2">
                  {t.levelB2}
                </span>
                {current.spokenModels.b2}
              </p>
            </div>
          ) : null}


          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={back}
              disabled={index === 0}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              {t.back}
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!selected[current.id]}
              className="rounded-full bg-ocean-500 text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-40 hover:bg-ocean-600"
            >
              {index + 1 >= total ? t.finish : t.next}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
