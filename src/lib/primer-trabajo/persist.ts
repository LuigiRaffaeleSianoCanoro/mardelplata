"use client";

import { useCallback, useEffect, useState } from "react";
import { runDiagnostic } from "./engine";
import type { DiagnosticResult, HrQuizResult, PrimerTrabajoPersisted } from "./types";

const STORAGE_KEY = "mdpdev-primer-trabajo-v1";

function read(): PrimerTrabajoPersisted {
  if (typeof window === "undefined") {
    return { schemaVersion: 1, checklistCheckedIds: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { schemaVersion: 1, checklistCheckedIds: [] };
    const parsed = JSON.parse(raw) as PrimerTrabajoPersisted;
    if (parsed.schemaVersion !== 1) return { schemaVersion: 1, checklistCheckedIds: [] };
    return {
      schemaVersion: 1,
      diagnosticResult: parsed.diagnosticResult,
      checklistCheckedIds: Array.isArray(parsed.checklistCheckedIds) ? parsed.checklistCheckedIds : [],
      hrQuizResult: parsed.hrQuizResult,
    };
  } catch {
    return { schemaVersion: 1, checklistCheckedIds: [] };
  }
}

function write(data: PrimerTrabajoPersisted) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function usePrimerTrabajoPersist() {
  const [hydrated, setHydrated] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | undefined>(undefined);
  const [checklistCheckedIds, setChecklistCheckedIds] = useState<string[]>([]);
  const [hrQuizResult, setHrQuizResult] = useState<HrQuizResult | undefined>(undefined);

  useEffect(() => {
    const p = read();
    setDiagnosticResult(p.diagnosticResult);
    setChecklistCheckedIds(p.checklistCheckedIds);
    setHrQuizResult(p.hrQuizResult);
    setHydrated(true);
  }, []);

  const saveDiagnostic = useCallback((result: DiagnosticResult) => {
    setDiagnosticResult(result);
    const p = read();
    write({
      schemaVersion: 1,
      diagnosticResult: result,
      checklistCheckedIds: p.checklistCheckedIds,
      hrQuizResult: p.hrQuizResult,
    });
  }, []);

  const saveHrQuiz = useCallback((quiz: HrQuizResult) => {
    setHrQuizResult(quiz);
    const p = read();
    let nextDiagnostic = p.diagnosticResult;
    if (p.diagnosticResult?.answers) {
      nextDiagnostic = runDiagnostic(p.diagnosticResult.answers, { interviewReadinessScore: quiz.score });
      setDiagnosticResult(nextDiagnostic);
    }
    write({
      schemaVersion: 1,
      diagnosticResult: nextDiagnostic,
      checklistCheckedIds: p.checklistCheckedIds,
      hrQuizResult: quiz,
    });
  }, []);

  const clearHrQuiz = useCallback(() => {
    setHrQuizResult(undefined);
    const p = read();
    let nextDiagnostic = p.diagnosticResult;
    if (p.diagnosticResult?.answers) {
      nextDiagnostic = runDiagnostic(p.diagnosticResult.answers);
      setDiagnosticResult(nextDiagnostic);
    }
    write({
      schemaVersion: 1,
      diagnosticResult: nextDiagnostic,
      checklistCheckedIds: p.checklistCheckedIds,
    });
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklistCheckedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      const p = read();
      write({
        schemaVersion: 1,
        diagnosticResult: p.diagnosticResult,
        checklistCheckedIds: next,
        hrQuizResult: p.hrQuizResult,
      });
      return next;
    });
  }, []);

  const setCheckedIds = useCallback((ids: string[]) => {
    setChecklistCheckedIds(ids);
    const p = read();
    write({
      schemaVersion: 1,
      diagnosticResult: p.diagnosticResult,
      checklistCheckedIds: ids,
      hrQuizResult: p.hrQuizResult,
    });
  }, []);

  return {
    hydrated,
    diagnosticResult,
    checklistCheckedIds,
    hrQuizResult,
    saveDiagnostic,
    saveHrQuiz,
    clearHrQuiz,
    toggleChecklistItem,
    setCheckedIds,
  };
}
