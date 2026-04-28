import type { User } from "@supabase/supabase-js";

export const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "1";

export const mockUser = {
  id: "00000000-0000-0000-0000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "demo@mardelplata.dev",
  app_metadata: {},
  user_metadata: {},
  created_at: "2026-01-01T00:00:00.000Z",
} as unknown as User;

export const mockProfile = {
  id: mockUser.id,
  email: "demo@mardelplata.dev",
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
    email: "ana@mardelplata.dev",
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
    email: "lucas@mardelplata.dev",
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
