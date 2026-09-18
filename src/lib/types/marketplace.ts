export type MarketplaceStatus = "pending" | "published" | "rejected" | "archived";

export type StartupStage = "idea" | "mvp" | "early_revenue" | "growth";

export type StartupLookingFor = "capital" | "clientes" | "talento" | "partners" | "mentores";

export type PedidoKind =
  | "invertiria"
  | "necesito_producto"
  | "busco_cofounder"
  | "corporate_challenge"
  | "otro";

export type PedidoPreferredContact = "email_via_platform" | "form_reply";

export type MarketplaceLeadKind = "startup_contact" | "startup_deck" | "pedido_interest";

export type MarketplaceLeadStatus = "new" | "notified" | "archived";

export interface StartupFounderPublic {
  name: string;
  role?: string;
  linkedin?: string;
  x?: string;
}

/** Columnas de `marketplace_startups_public`. Sin email, teléfono ni deck. */
export interface MarketplaceStartupPublic {
  id: string;
  slug: string;
  name: string;
  one_liner: string;
  description: string;
  stage: StartupStage;
  tags: string[];
  city: string;
  website: string | null;
  logo_url: string | null;
  founders: StartupFounderPublic[];
  looking_for: StartupLookingFor[];
  ticket_range: string | null;
  has_deck: boolean;
  published_at: string | null;
  created_at: string;
}

/** Columnas de `marketplace_pedidos_public`. Sin email ni LinkedIn privado. */
export interface MarketplacePedidoPublic {
  id: string;
  title: string;
  kind: PedidoKind;
  description: string;
  publisher_display: string;
  organization: string | null;
  tags: string[];
  budget: string | null;
  deadline: string | null;
  preferred_contact: PedidoPreferredContact;
  published_at: string | null;
  created_at: string;
}

export interface MarketplaceStartupAdmin extends MarketplaceStartupPublic {
  contact_email: string;
  contact_phone: string | null;
  deck_url: string | null;
  extra_docs_url: string | null;
  status: MarketplaceStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  updated_at: string;
}

export interface MarketplacePedidoAdmin extends MarketplacePedidoPublic {
  contact_email: string;
  linkedin_url: string | null;
  status: MarketplaceStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  updated_at: string;
}

export interface MarketplaceLeadAdmin {
  id: string;
  kind: MarketplaceLeadKind;
  startup_id: string | null;
  pedido_id: string | null;
  from_name: string;
  from_email: string;
  message: string;
  status: MarketplaceLeadStatus;
  created_at: string;
}

export const STARTUP_NAME_MAX = 80;
export const STARTUP_ONE_LINER_MAX = 120;
export const STARTUP_DESCRIPTION_MAX = 600;
export const STARTUP_TAGS_MAX = 8;
export const PEDIDO_TITLE_MAX = 140;
export const PEDIDO_DESCRIPTION_MAX = 2000;
export const PEDIDO_DESCRIPTION_MIN = 20;
export const LEAD_MESSAGE_MAX = 1000;
export const LEAD_MESSAGE_MIN = 10;
