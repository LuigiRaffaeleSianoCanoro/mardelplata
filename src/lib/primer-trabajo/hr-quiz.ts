import type { HrQuizAnswerRecord, HrQuizResult } from "./types";

export interface HrQuizOption {
  id: string;
  label: string;
  isIdeal: boolean;
  whyWrong: string;
  rewriteHint: string;
}

export interface HrQuizItem {
  id: string;
  prompt: string;
  options: HrQuizOption[];
}

export interface HrQuizBundle {
  items: HrQuizItem[];
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
