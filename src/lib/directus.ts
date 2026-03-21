// src/lib/directus.ts
import { createDirectus, rest, staticToken } from '@directus/sdk';

// Define aquí los tipos de tus colecciones de Directus
export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar?: string;
  imagen?: string;
  status: 'published' | 'draft' | 'archived';
}

export interface Schema {
  eventos: Evento[];
}

// If DIRECTUS_URL or DIRECTUS_TOKEN are not set, requests will fail gracefully
// and pages that consume this client will return empty data without breaking the build.
const client = createDirectus<Schema>(process.env.DIRECTUS_URL ?? 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_TOKEN ?? ''))
  .with(rest());

export default client;
