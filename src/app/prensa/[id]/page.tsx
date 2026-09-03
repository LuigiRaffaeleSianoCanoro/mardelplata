import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArchiveNotice from "@/components/prensa/ArchiveNotice";
import JsonLd from "@/components/seo/JsonLd";
import { markdownToHtml } from "@/lib/prensa/markdown";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import {
  getAllPressItems,
  getPressItemById,
  parseArchiveMeta,
  readArchive,
} from "@/content/prensa";
import { PRESS_EVENT_LABELS, PRESS_TYPE_LABELS } from "@/content/prensa/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllPressItems().map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getPressItemById(id);
  if (!item) return { title: "No encontrado" };

  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/prensa/${item.id}` },
    openGraph: {
      title: `${item.title} — Prensa MdPDev`,
      description: item.excerpt,
      url: `/prensa/${item.id}`,
      type: "article",
      publishedTime: item.date,
      images: [ogImageUrl(item.outlet, "Archivo de prensa")],
    },
  };
}

function formatDate(iso: string): string {
  if (!iso || iso === "2026-01-01") return "Fecha pendiente";
  return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PrensaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = getPressItemById(id);
  if (!item) notFound();

  const rawArchive = readArchive(item);
  const archiveMeta = rawArchive ? parseArchiveMeta(rawArchive) : null;
  const archiveHtml = archiveMeta ? markdownToHtml(archiveMeta.body) : null;
  const capturedAt = item.capturedAt ?? archiveMeta?.capturedAt;

  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Prensa", path: "/prensa" },
      { name: item.outlet, path: `/prensa/${item.id}` },
    ]),
  ];

  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main className="prensa-x prensa-x--detail">
        <article className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow">
            <nav className="prensa-x-breadcrumb" aria-label="Miga de pan">
              <Link href="/prensa">Prensa</Link>
              <span aria-hidden> / </span>
              <span>{item.outlet}</span>
            </nav>

            <header className="prensa-x-detail-header">
              <p className="shell-eyebrow">{item.outlet}</p>
              <h1 className="shell-title">{item.title}</h1>
              {item.outletTitle && (
                <p className="prensa-x-card-outlet-title">
                  Título del medio: «{item.outletTitle}»
                </p>
              )}
              <dl className="prensa-x-detail-meta">
                <div>
                  <dt>Publicación</dt>
                  <dd>
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </dd>
                </div>
                <div>
                  <dt>Tipo</dt>
                  <dd>{PRESS_TYPE_LABELS[item.type]}</dd>
                </div>
                {capturedAt && (
                  <div>
                    <dt>Archivo capturado</dt>
                    <dd>
                      <time dateTime={capturedAt}>
                        {formatDate(capturedAt)}
                      </time>
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Temas</dt>
                  <dd>{item.events.map((e) => PRESS_EVENT_LABELS[e]).join(" · ")}</dd>
                </div>
              </dl>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prensa-x-detail-original"
                >
                  Ver nota original en {item.outlet} →
                </a>
              ) : (
                <p className="prensa-x-detail-pending">
                  Sin URL periodística verificada. Si tenés el enlace, podés
                  agregarlo en el repo (ver PR).
                </p>
              )}
            </header>

            <ArchiveNotice />

            {item.archivePartial && (
              <p className="prensa-x-partial">
                Archivo parcial: el medio requiere inicio de sesión para el texto
                completo.
              </p>
            )}

            {item.primarySource && (
              <p className="prensa-x-partial">
                Fuente primaria del evento (no cobertura periodística).
              </p>
            )}

            {item.thumbnailPath && (
              <figure className="prensa-x-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailPath}
                  alt="Poster del video archivado"
                  className="prensa-x-media-poster"
                  loading="lazy"
                />
                {item.videoUrl && (
                  <figcaption>
                    Video (~44s) en{" "}
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      la publicación original
                    </a>
                    . Miniatura archivada desde el post oficial.
                  </figcaption>
                )}
              </figure>
            )}

            {archiveHtml ? (
              <div
                className="prensa-x-archive-body"
                dangerouslySetInnerHTML={{ __html: archiveHtml }}
              />
            ) : (
              <div className="prensa-x-archive-missing">
                <p>{item.excerpt}</p>
                <p>
                  {item.pendingSource
                    ? "Pendiente de fuente periodística."
                    : "No hay copia archivada en el repositorio."}
                </p>
              </div>
            )}

            <footer className="prensa-x-detail-footer">
              <Link href="/prensa" className="prensa-x-link">
                ← Volver al archivo
              </Link>
            </footer>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
