"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { primerTrabajoData } from "@/content/primer-trabajo";
import { getAllQuestions, runDiagnostic } from "@/lib/primer-trabajo/engine";
import { MISSION_CALLOUTS } from "@/lib/primer-trabajo/mission-callouts";
import { usePrimerTrabajoPersist } from "@/lib/primer-trabajo/persist";
import MissionCallout from "./MissionCallout";
import type { DiagnosticResult } from "@/lib/primer-trabajo/types";

export default function DiagnosticoClient() {
  const { hydrated, diagnosticResult, hrQuizResult, saveDiagnostic } = usePrimerTrabajoPersist();
  const [mode, setMode] = useState<"summary" | "wizard">("wizard");
  const [bootstrapped, setBootstrapped] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);

  const questions = useMemo(() => getAllQuestions(), []);
  const total = questions.length;
  const current = questions[index];
  const progress = total === 0 ? 0 : Math.round(((index + (answers[current?.id ?? ""] ? 1 : 0)) / total) * 100);

  useEffect(() => {
    if (!hydrated || bootstrapped) return;
    setBootstrapped(true);
    if (diagnosticResult) setMode("summary");
  }, [hydrated, diagnosticResult, bootstrapped]);

  const select = (questionId: string, optionId: string) => {
    setAnswers((a) => ({ ...a, [questionId]: optionId }));
  };

  const next = () => {
    if (!current || !answers[current.id]) return;
    if (index + 1 >= total) {
      const result = runDiagnostic(answers, {
        interviewReadinessScore: hrQuizResult?.score,
      });
      saveDiagnostic(result);
      setMode("summary");
      return;
    }
    setIndex((i) => i + 1);
  };

  const back = () => setIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setMode("wizard");
  };

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {mode === "summary" && diagnosticResult ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">
              Último diagnóstico:{" "}
              {new Date(diagnosticResult.completedAt).toLocaleString("es-AR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-ocean-500 text-ocean-700 px-4 py-2 text-sm font-semibold hover:bg-ocean-50 transition-colors"
            >
              Repetir diagnóstico
            </button>
          </div>
          <ResultsPanel result={diagnosticResult} />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/primer-trabajo/plan"
              className="inline-flex items-center justify-center rounded-full bg-ocean-500 text-white px-6 py-3 font-semibold hover:bg-ocean-600 transition-colors"
            >
              Ir al plan de acción
            </Link>
            <Link
              href="/primer-trabajo"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      ) : (
        <>
          {current && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                  <span>
                    Pregunta {index + 1} / {total}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-ocean-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, ((index + 1) / total) * 100)}%` }}
                  />
                </div>
              </div>

              {MISSION_CALLOUTS[current.id] && <MissionCallout {...MISSION_CALLOUTS[current.id]!} />}

              {"explanationForUser" in current && current.explanationForUser ? (
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{current.explanationForUser}</p>
              ) : null}

              <p className="font-display font-bold text-xl text-ocean-900 mb-6 leading-snug whitespace-pre-line">
                {current.prompt}
              </p>

              <ul className="space-y-3">
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt.id;
                  return (
                    <li key={opt.id}>
                      <button
                        type="button"
                        onClick={() => select(current.id, opt.id)}
                        className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
                          selected
                            ? "border-ocean-500 bg-ocean-50 text-ocean-900"
                            : "border-slate-200 hover:border-ocean-300 bg-white text-slate-800"
                        }`}
                      >
                        <span className="font-medium">{opt.label}</span>
                        {selected && (
                          <p className="mt-2 text-sm text-slate-600 border-t border-ocean-200/60 pt-2">{opt.consequence}</p>
                        )}
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
                  disabled={!answers[current.id]}
                  className="rounded-full bg-ocean-500 text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-40 hover:bg-ocean-600"
                >
                  {index + 1 >= total ? "Ver resultado" : "Siguiente"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function guideHintFromSignals(weakest: string[]): string | null {
  const top = weakest[0];
  const rest = new Set(weakest.slice(1));

  if (top === "linkedin_strength") {
    return "Tu señal más débil es LinkedIn: priorizá titular y resumen del perfil con la guía (ejemplos mal/bien).";
  }
  if (top === "cv_quality_external") {
    return "Tu CV validado externamente está flojo: pasá el PDF por silver.dev/resume, subí el grade a A o S y repetí el diagnóstico; después el plan y la guía CV para el detalle.";
  }
  if (top === "clarity_role_stack") {
    return "Claridad de rol/stack floja: la guía CV y LinkedIn atacan headline y mensaje; el checker de Silver Dev no reemplaza eso.";
  }
  if (top === "profile_consistency") {
    return "Coherencia entre CV, LinkedIn y repositorio: leé las dos guías y unificá mensaje y stack.";
  }
  if (top === "proof_of_work") {
    return "Prueba de trabajo floja: portfolio + README + versión publicada en el plan; en CV, enlaces visibles arriba (guía CV).";
  }
  if (top === "english_level") {
    return "Inglés flojo para el pipeline: en muchas buscas de AR te comparan con quien lee doc sin drama; subí lectura y mails simples ya.";
  }
  if (top === "execution_over_theory") {
    return "Ejecución floja frente a teoría: menos certificados decorativos, más proyecto publicado en línea y pitch de 1 minuto (plan + portfolio).";
  }
  if (top === "problem_solving_signal") {
    return "Poca práctica algorítmica: si tu rol objetivo suele filtrar con LeetCode/HackerRank, sumá 4–8 problemas fáciles por semana; si no aplica, priorizá proyecto y README.";
  }
  if (top === "interview_readiness") {
    return "Respuestas de Recursos Humanos flojas: hacé el simulador de esta herramienta y ensayá en voz alta; para práctica en vivo probá Pramp o interviewing.io.";
  }
  if (rest.has("linkedin_strength")) {
    return "LinkedIn sigue flojo entre tus señales: la guía te muestra titular y resumen con ejemplos reales.";
  }
  if (weakest.some((id) => id === "cv_quality_external")) {
    return "El grade de Silver Dev te está frenando: priorizá silver.dev/resume antes de enviar más CVs.";
  }
  if (weakest.some((id) => id === "clarity_role_stack")) {
    return "El rol no cierra del todo: repasá guía CV / LinkedIn antes de la próxima tanda.";
  }
  return null;
}

function ResultsPanel({ result }: { result: DiagnosticResult }) {
  const rules = primerTrabajoData.eliminationRules.filter((r) => result.triggeredEliminationRuleIds.includes(r.id));
  const hint = guideHintFromSignals(result.weakestSignals);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-ocean-900 mb-2">Probabilidad de entrevista (estimada)</h2>
        <p className="text-4xl font-bold text-ocean-600 mb-3">{result.interviewProbability}%</p>
        <p className="text-slate-700 text-sm leading-relaxed mb-4">{result.interviewProbabilityExplanation}</p>
        {result.interviewFactors && (result.interviewFactors.lowers.length > 0 || result.interviewFactors.raises.length > 0) ? (
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            {result.interviewFactors.lowers.length > 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
                <h3 className="font-semibold text-amber-950 mb-2">Factores que bajan la probabilidad</h3>
                <ul className="list-disc list-inside space-y-1.5 text-amber-950/90 leading-relaxed">
                  {result.interviewFactors.lowers.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {result.interviewFactors.raises.length > 0 ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
                <h3 className="font-semibold text-emerald-950 mb-2">Factores que suben la probabilidad</h3>
                <ul className="list-disc list-inside space-y-1.5 text-emerald-950/90 leading-relaxed">
                  {result.interviewFactors.raises.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border-2 border-ocean-200 bg-ocean-50/50 p-5 shadow-sm">
        <h2 className="font-display font-bold text-base text-ocean-900 mb-2">Siguiente paso: guías</h2>
        {hint ? <p className="text-sm text-slate-700 mb-3 leading-relaxed">{hint}</p> : null}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          <Link
            href="/primer-trabajo/guia/cv"
            className="inline-flex items-center justify-center rounded-full bg-ocean-600 text-white px-4 py-2 text-sm font-semibold hover:bg-ocean-700"
          >
            Guía CV
          </Link>
          <Link
            href="/primer-trabajo/guia/linkedin"
            className="inline-flex items-center justify-center rounded-full bg-white border border-ocean-400 text-ocean-800 px-4 py-2 text-sm font-semibold hover:bg-white/90"
          >
            Guía LinkedIn
          </Link>
          <Link
            href="/primer-trabajo/entrevista-hr"
            className="inline-flex items-center justify-center rounded-full bg-white border border-ocean-500 text-ocean-800 px-4 py-2 text-sm font-semibold hover:bg-ocean-50"
          >
            Simulador Recursos Humanos
          </Link>
          <Link
            href="/primer-trabajo/plan"
            className="inline-flex items-center justify-center rounded-full bg-white border border-slate-300 text-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Plan de acción (checklist)
          </Link>
        </div>
      </section>

      {rules.length > 0 && (
        <section className="rounded-2xl border border-red-200 bg-red-50/80 p-6 shadow-sm" role="region" aria-label="Reglas de eliminación">
          <h2 className="font-display font-bold text-lg text-red-900 mb-3">Reglas duras (no estás listo para enviar el CV en masa)</h2>
          <ul className="space-y-3">
            {rules.map((r) => (
              <li key={r.id} className="text-sm">
                <span className="font-semibold text-red-900">{r.title}</span>
                <p className="text-red-800/90 mt-1">{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 text-white p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg mb-1">Modo recruiter</h2>
        <p className="text-ocean-200 text-xs mb-4">Búsqueda simulada: &quot;{result.recruiterSimulation.searchQuery}&quot;</p>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-200 mb-4">
          {result.recruiterSimulation.result.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <p className="font-semibold text-ocean-300 border-t border-slate-700 pt-3">{result.recruiterSimulation.decision}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-ocean-900 mb-4">Señales de empleabilidad</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {primerTrabajoData.employabilitySignals.map((s) => {
            const v = result.signalStrength[s.id] ?? 0;
            return (
              <div key={s.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-800">{s.label}</span>
                  <span className="text-slate-500">{v}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-ocean-500" style={{ width: `${v}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug" title={s.recruiterLens}>
                  {s.recruiterLens.slice(0, 90)}…
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-slate-800 mb-2">Scores por bloque</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          {primerTrabajoData.sections.map((sec) => (
            <li key={sec.id}>
              {sec.title}: <strong>{result.sectionScores[sec.id] ?? 0}</strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
