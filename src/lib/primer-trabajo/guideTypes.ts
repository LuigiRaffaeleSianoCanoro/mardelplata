export interface GuidePattern {
  id: string;
  title: string;
  recruiterView: string;
  bad: string;
  good: string;
  rewriteSteps: string[];
  linkedSignals: string[];
  mayTriggerEliminationRuleIds: string[];
}

export interface GuideBundle {
  title: string;
  intro: string;
  patterns: GuidePattern[];
}
