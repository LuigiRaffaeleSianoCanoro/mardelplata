// src/app/eventos/page.tsx
import client from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { Evento } from '@/lib/directus';

export const revalidate = 60; // ISR: revalidar cada 60 segundos

async function getEventos(): Promise<Evento[]> {
  try {
    const eventos = await client.request(
      readItems('eventos', {
        filter: { status: { _eq: 'published' } },
        sort: ['fecha'],
        fields: ['id', 'titulo', 'descripcion', 'fecha', 'lugar', 'imagen', 'status'],
      })
    );
    return eventos as Evento[];
  } catch (error) {
    console.error(
      'Error fetching eventos from Directus (URL: %s):',
      process.env.DIRECTUS_URL ?? 'http://localhost:8055',
      error
    );
    return [];
  }
}

export default async function EventosPage() {
  const eventos = await getEventos();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Eventos de la Comunidad</h1>
      <p className="text-gray-600 mb-8">
        Próximos eventos de la comunidad dev de Mar del Plata.
      </p>

      {eventos.length === 0 ? (
        <p className="text-gray-500">
          No hay eventos publicados por el momento. ¡Volvé pronto!
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{evento.titulo}</h2>
              {evento.fecha && (
                <p className="text-sm text-gray-500 mb-2">
                  📅{' '}
                  {new Date(evento.fecha).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              {evento.lugar && (
                <p className="text-sm text-gray-500 mb-3">📍 {evento.lugar}</p>
              )}
              <p className="text-gray-700">{evento.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
