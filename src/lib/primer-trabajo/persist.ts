"use client";

import { useCallback, useEffect, useState } from "react";
import type { DiagnosticResult, PrimerTrabajoPersisted } from "./types";

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

  useEffect(() => {
    const p = read();
    setDiagnosticResult(p.diagnosticResult);
    setChecklistCheckedIds(p.checklistCheckedIds);
    setHydrated(true);
  }, []);

  const saveDiagnostic = useCallback((result: DiagnosticResult) => {
    setDiagnosticResult(result);
    const p = read();
    write({ schemaVersion: 1, diagnosticResult: result, checklistCheckedIds: p.checklistCheckedIds });
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklistCheckedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      const p = read();
      write({ schemaVersion: 1, diagnosticResult: p.diagnosticResult, checklistCheckedIds: next });
      return next;
    });
  }, []);

  const setCheckedIds = useCallback((ids: string[]) => {
    setChecklistCheckedIds(ids);
    const p = read();
    write({ schemaVersion: 1, diagnosticResult: p.diagnosticResult, checklistCheckedIds: ids });
  }, []);

  return {
    hydrated,
    diagnosticResult,
    checklistCheckedIds,
    saveDiagnostic,
    toggleChecklistItem,
    setCheckedIds,
  };
}
