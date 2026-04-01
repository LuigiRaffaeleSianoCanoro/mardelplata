import { primerTrabajoData } from "@/content/primer-trabajo";
import type { DiagnosticQuestion, DiagnosticResult, EliminationRule } from "./types";

const data = primerTrabajoData;

export function getAllQuestions(): DiagnosticQuestion[] {
  return data.sections.flatMap((s) => s.questions) as DiagnosticQuestion[];
}

export function collectTags(answers: Record<string, string>): Set<string> {
  const tags = new Set<string>();
  for (const q of getAllQuestions()) {
    const ans = answers[q.id];
    if (!ans) continue;
    const opt = q.options.find((o) => o.id === ans);
    opt?.tags?.forEach((t) => tags.add(t));
  }
  return tags;
}

function ruleMatches(rule: EliminationRule, tags: Set<string>): boolean {
  const c = rule.condition;
  if (c.allOfTags?.length) {
    return c.allOfTags.every((t) => tags.has(t));
  }
  if (c.anyOfTags?.length) {
    return c.anyOfTags.some((t) => tags.has(t));
  }
  return false;
}

export function getTriggeredRules(tags: Set<string>): EliminationRule[] {
  return data.eliminationRules.filter((r) => ruleMatches(r as EliminationRule, tags));
}

export function computeSignalStrength(answers: Record<string, string>): Record<string, number> {
  const signalIds = data.employabilitySignals.map((s) => s.id);
  const sums: Record<string, { total: number; n: number }> = {};
  for (const id of signalIds) {
    sums[id] = { total: 0, n: 0 };
  }

  for (const q of getAllQuestions()) {
    const ans = answers[q.id];
    if (!ans) continue;
    const opt = q.options.find((o) => o.id === ans);
    if (!opt) continue;
    for (const sig of q.affectedSignals) {
      if (sums[sig]) {
        sums[sig].total += opt.score;
        sums[sig].n += 1;
      }
    }
  }

  const out: Record<string, number> = {};
  for (const id of signalIds) {
    const { total, n } = sums[id];
    out[id] = n === 0 ? 0 : Math.round(total / n);
  }
  return out;
}

export function computeSectionScores(answers: Record<string, string>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const section of data.sections) {
    let total = 0;
    let n = 0;
    for (const q of section.questions) {
      const ans = answers[q.id];
      if (!ans) continue;
      const opt = q.options.find((o) => o.id === ans);
      if (opt) {
        total += opt.score;
        n += 1;
      }
    }
    out[section.id] = n === 0 ? 0 : Math.round(total / n);
  }
  return out;
}

function pickWeakestSignals(signalStrength: Record<string, number>, take: number): string[] {
  return Object.entries(signalStrength)
    .sort((a, b) => a[1] - b[1])
    .slice(0, take)
    .map(([id]) => id);
}

function reasonMatches(when: { anyOfTags?: string[] }, tags: Set<string>): boolean {
  if (!when.anyOfTags?.length) return false;
  return when.anyOfTags.some((t) => tags.has(t));
}

export function buildRecruiterSimulation(
  answers: Record<string, string>,
  tags: Set<string>,
  interviewProbability: number
): DiagnosticResult["recruiterSimulation"] {
  const roleKey = answers.app_rol_objetivo ?? "unclear";
  const map = data.searchQueryByOption.app_rol_objetivo as Record<string, string>;
  const searchQuery = map[roleKey] ?? map.unclear;

  const lines: string[] = [];
  for (const r of data.recruiterSimulationReasons) {
    if (reasonMatches(r.when, tags)) lines.push(r.line);
  }
  const result = lines.slice(0, 5);

  let decision: string;
  if (interviewProbability < 35) decision = "Paso a otro candidato";
  else if (interviewProbability < 55) decision = "Te guardo si no aparece nada mejor";
  else decision = "Te contacto si el stack cierra";

  return { searchQuery, result, decision };
}

function signalLabel(id: string): string {
  const s = data.employabilitySignals.find((x) => x.id === id);
  return s?.label ?? id;
}

export function buildInterviewExplanation(
  weakest: string[],
  triggeredRules: EliminationRule[],
  interviewProbability: number
): string {
  const parts: string[] = [];
  const low = interviewProbability < 45;
  if (weakest.length >= 2) {
    parts.push(
      low
        ? `Tu probabilidad es baja porque tus señales más débiles son ${signalLabel(weakest[0])} y ${signalLabel(weakest[1])}.`
        : `Las señales a pulir primero: ${signalLabel(weakest[0])} y ${signalLabel(weakest[1])}.`
    );
  } else if (weakest.length === 1) {
    parts.push(
      low
        ? `Tu probabilidad está lastrada por ${signalLabel(weakest[0])}.`
        : `Priorizá mejorar ${signalLabel(weakest[0])}.`
    );
  }
  if (triggeredRules.length) {
    const titles = triggeredRules.map((r) => r.title).join("; ");
    parts.push(`Reglas duras activas: ${titles}.`);
  }
  if (!parts.length) {
    parts.push("Tu perfil emite señales razonables; seguí afinando CV, LinkedIn y prueba de trabajo.");
  }
  return parts.join(" ");
}

export function runDiagnostic(answers: Record<string, string>): DiagnosticResult {
  const tags = collectTags(answers);
  const triggered = getTriggeredRules(tags);
  const signalStrength = computeSignalStrength(answers);
  const signalValues = data.employabilitySignals.map((s) => signalStrength[s.id] ?? 0);
  const avgSignal =
    signalValues.length === 0 ? 0 : signalValues.reduce((a, b) => a + b, 0) / signalValues.length;
  const penalty = triggered.reduce((s, r) => s + (r.interviewPenaltyPoints ?? 0), 0);
  const interviewProbability = Math.max(0, Math.min(100, Math.round(avgSignal - penalty)));
  const weakestSignals = pickWeakestSignals(signalStrength, 2);
  const explanation = buildInterviewExplanation(weakestSignals, triggered, interviewProbability);
  const recruiterSimulation = buildRecruiterSimulation(answers, tags, interviewProbability);

  return {
    schemaVersion: 1,
    completedAt: new Date().toISOString(),
    answers,
    derivedTags: [...tags],
    triggeredEliminationRuleIds: triggered.map((r) => r.id),
    signalStrength,
    weakestSignals,
    interviewProbability,
    interviewProbabilityExplanation: explanation,
    recruiterSimulation,
    sectionScores: computeSectionScores(answers),
  };
}
