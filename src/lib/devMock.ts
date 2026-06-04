import type { User } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const looksLikePlaceholder = (value: string | undefined) =>
  !value || value.length === 0 || value.includes("placeholder");

export const HAS_SUPABASE_CONFIG =
  !looksLikePlaceholder(SUPABASE_URL) && !looksLikePlaceholder(SUPABASE_ANON_KEY);

const explicitlyEnabled = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "1";
const isDev = process.env.NODE_ENV !== "production";
const autoEnabled = isDev && !HAS_SUPABASE_CONFIG;

export const IS_MOCK = explicitlyEnabled || autoEnabled;

export const MOCK_REASON: "explicit" | "auto-no-supabase" | "off" = explicitlyEnabled
  ? "explicit"
  : autoEnabled
    ? "auto-no-supabase"
    : "off";

const globalKey = "__mardelplata_mock_warned__" as const;
type GlobalWithFlag = typeof globalThis & { [globalKey]?: boolean };
const g = globalThis as GlobalWithFlag;

if (autoEnabled && !g[globalKey]) {
  g[globalKey] = true;
  const where = typeof window === "undefined" ? "[server]" : "[client]";
  console.warn(
    `${where} Supabase no está configurado (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY faltantes o placeholder). ` +
      `Modo desarrollo: usando datos mock. Definí esas variables en .env.local para conectar a un proyecto real.`,
  );
}

export const mockUser = {
  id: "00000000-0000-0000-0000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "demo@mardelplata.dev.ar",
  app_metadata: {},
  user_metadata: {},
  created_at: "2026-01-01T00:00:00.000Z",
} as unknown as User;

export const mockProfile = {
  id: mockUser.id,
  email: "demo@mardelplata.dev.ar",
  full_name: "Demo Dev",
  avatar_url: null as string | null,
  qr_code: "mock-qr-00000000-0000-0000-0000-000000000001",
  bio: "Cuenta demo en modo mock — sin Supabase.",
  github_url: null as string | null,
  linkedin_url: null as string | null,
  twitter_url: null as string | null,
  is_admin: true,
  created_at: "2026-01-01T00:00:00.000Z",
};

export const mockEvents = [
  {
    id: "evt-001",
    title: "Meetup de bienvenida",
    subtitle: "Charla abierta + networking",
    description: "Primer encuentro de la temporada en el faro.",
    date: "2026-05-12T19:00:00.000Z",
    end_date: null,
    location: "Faro Punta Mogotes",
    tags: ["meetup", "comunidad"],
    image_url: null,
    registration_url: null,
    is_mystery: false,
    codename: null,
    teaser: null,
    is_published: true,
    created_at: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "evt-002",
    title: "Hack night",
    subtitle: "Pair programming nocturno",
    description: "Traé tu laptop y un proyecto para mostrar.",
    date: "2026-05-26T20:30:00.000Z",
    end_date: null,
    location: "Coworking Centro",
    tags: ["hack", "pair"],
    image_url: null,
    registration_url: null,
    is_mystery: false,
    codename: null,
    teaser: null,
    is_published: false,
    created_at: "2026-04-15T00:00:00.000Z",
  },
];

export const mockProfiles = [
  mockProfile,
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "ana@mardelplata.dev.ar",
    full_name: "Ana Costa",
    avatar_url: null as string | null,
    qr_code: "mock-qr-2",
    bio: "Frontend, surfeo cuando puedo.",
    github_url: null as string | null,
    linkedin_url: null as string | null,
    twitter_url: null as string | null,
    is_admin: false,
    created_at: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "lucas@mardelplata.dev.ar",
    full_name: "Lucas Bahía",
    avatar_url: null as string | null,
    qr_code: "mock-qr-3",
    bio: "Backend + IA local.",
    github_url: null as string | null,
    linkedin_url: null as string | null,
    twitter_url: null as string | null,
    is_admin: false,
    created_at: "2026-03-04T00:00:00.000Z",
  },
];
