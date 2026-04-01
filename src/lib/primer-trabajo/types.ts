export type ModulePriority = "alta" | "media" | "baja";

export interface DiagnosticOption {
  id: string;
  label: string;
  score: number;
  tags?: string[];
  consequence: string;
}

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  type: "single";
  affectedSignals: string[];
  options: DiagnosticOption[];
  idealAnswerId: string;
}

export interface DiagnosticSection {
  id: string;
  title: string;
  questions: DiagnosticQuestion[];
}

export interface EliminationRule {
  id: string;
  title: string;
  description: string;
  condition: { anyOfTags?: string[]; allOfTags?: string[] };
  interviewPenaltyPoints?: number;
  blocksReadiness?: boolean;
  relatedSignals: string[];
  fixModuleIds: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  badExample: string;
  goodExample: string;
  whyWrong: string;
  action: string;
  suggestedRewrite: string;
  strengthensSignals: string[];
}

export interface ChecklistModule {
  id: string;
  title: string;
  emoji: string;
  priority: ModulePriority;
  items: ChecklistItem[];
}

export interface RecruiterSimulation {
  searchQuery: string;
  result: string[];
  decision: string;
}

export interface DiagnosticResult {
  schemaVersion: 1;
  completedAt: string;
  answers: Record<string, string>;
  derivedTags: string[];
  triggeredEliminationRuleIds: string[];
  signalStrength: Record<string, number>;
  weakestSignals: string[];
  interviewProbability: number;
  interviewProbabilityExplanation: string;
  recruiterSimulation: RecruiterSimulation;
  sectionScores: Record<string, number>;
}

export interface PrimerTrabajoPersisted {
  schemaVersion: 1;
  diagnosticResult?: DiagnosticResult;
  checklistCheckedIds: string[];
}
