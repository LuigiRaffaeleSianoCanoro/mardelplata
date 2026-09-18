import { createPublicClient } from "@/lib/supabase/public";
import type { FaqEntry } from "@/content/nomad";
import type {
  MarketplacePedidoPublic,
  MarketplaceStartupPublic,
  PedidoKind,
  StartupLookingFor,
  StartupStage,
} from "@/lib/types/marketplace";

export const MARKETPLACE_SECTOR_TAGS = [
  "IA",
  "fintech",
  "health",
  "climate",
  "marketplace",
  "B2B",
  "edtech",
  "agro",
  "turismo",
  "logística",
] as const;

export const STARTUP_STAGE_LABELS: Record<StartupStage, string> = {
  idea: "Idea",
  mvp: "MVP",
  early_revenue: "Primeros ingresos",
  growth: "Crecimiento",
};

export const LOOKING_FOR_LABELS: Record<StartupLookingFor, string> = {
  capital: "Capital",
  clientes: "Clientes",
  talento: "Talento",
  partners: "Partners",
  mentores: "Mentores",
};

export const PEDIDO_KIND_LABELS: Record<PedidoKind, string> = {
  invertiria: "Invertiría",
  necesito_producto: "Necesito un producto",
  busco_cofounder: "Busco cofounder",
  corporate_challenge: "Desafío de empresa",
  otro: "Otro",
};

export const MARKETPLACE_FAQ: FaqEntry[] = [
  {
    question: "¿MdPDev recomienda invertir en estas startups?",
    answer:
      "No. Esto es un tablero de la comunidad, no un banco ni un broker. Cada parte hace su propia due diligence. Publicamos fichas aprobadas para que founders y gente interesada se encuentren.",
  },
  {
    question: "¿Por qué no veo emails ni decks en las fichas?",
    answer:
      "A propósito. El contacto va por un formulario moderado. El deck y los datos privados quedan del lado de admin hasta que haya un lead. Así no se filtran en el HTML público.",
  },
  {
    question: "¿Quién aprueba lo que se publica?",
    answer:
      "Un admin de MdPDev. En la práctica, Luigi firma cada alta (startup o pedido) antes de que salga a público. Mientras tanto queda en cola como pendiente.",
  },
  {
    question: "¿Esto reemplaza la bolsa de empleo?",
    answer:
      "No. /bolsa sigue siendo laburo y freelance. El Marketplace es para startups, capital y pedidos de producto o cofounders.",
  },
];

export const MARKETPLACE_DISCLAIMER =
  "MdPDev no es broker, no intermedia equity y no recomienda inversiones. Las fichas son señal de la comunidad. La due diligence es de las partes.";

function asStartup(row: MarketplaceStartupPublic): MarketplaceStartupPublic {
  return {
    ...row,
    tags: row.tags ?? [],
    looking_for: row.looking_for ?? [],
    founders: Array.isArray(row.founders) ? row.founders : [],
  };
}

function asPedido(row: MarketplacePedidoPublic): MarketplacePedidoPublic {
  return {
    ...row,
    tags: row.tags ?? [],
  };
}

/** Listado público: solo published, vía vista sin columnas privadas. */
export async function getPublishedStartups(): Promise<MarketplaceStartupPublic[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("marketplace_startups_public")
    .select(
      "id, slug, name, one_liner, description, stage, tags, city, website, logo_url, founders, looking_for, ticket_range, has_deck, published_at, created_at",
    )
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return (data as MarketplaceStartupPublic[]).map(asStartup);
}

export async function getPublishedStartupBySlug(
  slug: string,
): Promise<MarketplaceStartupPublic | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("marketplace_startups_public")
    .select(
      "id, slug, name, one_liner, description, stage, tags, city, website, logo_url, founders, looking_for, ticket_range, has_deck, published_at, created_at",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return asStartup(data as MarketplaceStartupPublic);
}

export async function getPublishedPedidos(): Promise<MarketplacePedidoPublic[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("marketplace_pedidos_public")
    .select(
      "id, title, kind, description, publisher_display, organization, tags, budget, deadline, preferred_contact, published_at, created_at",
    )
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return (data as MarketplacePedidoPublic[]).map(asPedido);
}

export async function getPublishedPedidoById(
  id: string,
): Promise<MarketplacePedidoPublic | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("marketplace_pedidos_public")
    .select(
      "id, title, kind, description, publisher_display, organization, tags, budget, deadline, preferred_contact, published_at, created_at",
    )
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return asPedido(data as MarketplacePedidoPublic);
}

export function isUniqueViolation(message: string | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return m.includes("duplicate") || m.includes("unique") || m.includes("email_day");
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
