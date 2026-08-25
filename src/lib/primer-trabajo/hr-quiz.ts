import type { HrQuizAnswerRecord, HrQuizResult } from "./types";

export interface HrQuizOption {
  id: string;
  label: string;
  isIdeal: boolean;
  whyWrong: string;
  rewriteHint: string;
}

export interface HrQuizSpokenModels {
  a2: string;
  b1: string;
  b2: string;
}

export interface HrQuizItem {
  id: string;
  prompt: string;
  options: HrQuizOption[];
  spokenModels?: HrQuizSpokenModels;
}

export interface HrQuizBundle {
  items: HrQuizItem[];
}

/** Picks the interview-readiness score from the most recently completed HR quiz (ES or EN). */
export function pickInterviewReadinessScore(es?: HrQuizResult, en?: HrQuizResult): number | undefined {
  if (!es && !en) return undefined;
  if (!es) return en!.score;
  if (!en) return es.score;
  return new Date(en.completedAt) > new Date(es.completedAt) ? en.score : es.score;
}

export function scoreHrQuiz(bundle: HrQuizBundle, selectedByQuestionId: Record<string, string>): HrQuizResult {
  const answers: HrQuizAnswerRecord[] = [];
  let correct = 0;
  for (const item of bundle.items) {
    const optionId = selectedByQuestionId[item.id];
    const opt = item.options.find((o) => o.id === optionId);
    const ideal = opt?.isIdeal === true;
    if (ideal) correct += 1;
    if (optionId && opt) {
      answers.push({ questionId: item.id, optionId, ideal });
    }
  }
  const n = bundle.items.length;
  const score = n === 0 ? 0 : Math.round((correct / n) * 100);
  return {
    completedAt: new Date().toISOString(),
    answers,
    score,
  };
}
