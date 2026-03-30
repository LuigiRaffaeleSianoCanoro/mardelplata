export type ClassifiedKind = "job" | "freelance";

export interface JobPosition {
  title: string;
  description: string;
  link: string;
}

export interface ClassifiedListing {
  id: string;
  author_id: string;
  kind: ClassifiedKind;
  title: string;
  description: string;
  external_url: string | null;
  positions: JobPosition[];
  tags: string[];
  created_at: string;
  expires_at: string;
  profiles?: { full_name: string | null; email: string | null } | null;
}

export const CLASSIFIED_TITLE_MAX = 120;
export const CLASSIFIED_DESC_MAX = 2000;
export const CLASSIFIED_NEW_DAYS = 7;
