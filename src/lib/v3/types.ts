/** View models serializables que el server arma para el shell v3. */

export interface EventHostVM {
  name: string;
  initials: string;
  avatarUrl: string | null;
}

export interface EventVM {
  /** Slug estable para URLs (`?evento=<slug>`). */
  slug: string;
  title: string;
  excerpt: string | null;
  startISO: string;
  endISO: string | null;
  /** «Sáb 10/10» */
  dateShort: string;
  /** «17–20 ART» */
  timeShort: string;
  /** «Sábado 10 de octubre» */
  dateLong: string;
  /** «17:00 – 20:00 ART» */
  timeLong: string;
  /** «OCT» */
  month: string;
  /** «16» */
  day: string;
  /** Mes largo en minúscula («octubre») para agrupar. */
  monthLong: string;
  venueName: string | null;
  venueAddress: string | null;
  city: string | null;
  mapsUrl: string | null;
  hosts: EventHostVM[];
  tags: string[];
  registrationUrl: string | null;
  tier: "community" | "city";
  /** Opcionales: solo se muestran si el JSON fuente los trae. */
  price: string | null;
  capacity: number | null;
  agenda: string[];
}

export interface PressVM {
  id: string;
  title: string;
  outlet: string;
  /** «9/6» */
  dateShort: string;
  /** «9 de junio de 2026» */
  dateLong: string;
  excerpt: string;
  url: string;
  typeLabel: string;
  eventLabels: string[];
  hasArchive: boolean;
  pendingSource: boolean;
}

export interface JobVM {
  id: string;
  title: string;
  author: string | null;
  url: string | null;
  tags: string[];
  dateShort: string;
}

export interface ProjectVM {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
}

export interface MemberVM {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string | null;
}

export interface ShellLink {
  href: string;
  label: string;
  description?: string;
  group: "comunidad" | "aprender" | "ciudad" | "ecosistema" | "cuenta";
}

export interface ShellData {
  upcoming: EventVM[];
  past: EventVM[];
  press: PressVM[];
  jobs: JobVM[];
  projects: ProjectVM[];
  members: MemberVM[];
  links: ShellLink[];
}
