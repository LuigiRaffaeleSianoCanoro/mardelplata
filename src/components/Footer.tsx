"use client";

// Footer — banda decorativa con onda + faro + skyline encima de un
// bloque dark con socials, brand center y newsletter, + barra inferior
// con links legales y copyright.

import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: hook a /api/newsletter o similar
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail("");
  };

  return (
    <footer className="footer-x">
      <div className="footer-x-wave" aria-hidden>
        <Image
          src="/footer-wave.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center center" }}
        />
        <div className="footer-x-wave-fade" />
      </div>

      <div className="footer-x-main">
        <div className="footer-x-grid">
          <ul className="footer-x-socials">
            <li>
              <a href="https://github.com/mardelplata-dev" aria-label="GitHub" target="_blank" rel="noopener">
                <GithubIcon />
              </a>
            </li>
            <li>
              <a href="https://discord.gg/mdp-dev" aria-label="Discord" target="_blank" rel="noopener">
                <DiscordIcon />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/mardelplata-dev" aria-label="LinkedIn" target="_blank" rel="noopener">
                <LinkedinIcon />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/mardelplata.dev.ar/" aria-label="Instagram" target="_blank" rel="noopener">
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@mardelplata-dev" aria-label="YouTube" target="_blank" rel="noopener">
                <YoutubeIcon />
              </a>
            </li>
          </ul>

          <div className="footer-x-brand">
            <h3 className="footer-x-brand-name">
              mardelplata<span>.dev</span>
            </h3>
            <p className="footer-x-brand-tag">
              Comunidad IT de Mar del Plata y la costa atlántica
            </p>
          </div>

          <form className="footer-x-newsletter" onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className="footer-x-newsletter-label">
              Recibí novedades en tu correo
            </label>
            <div className="footer-x-newsletter-row">
              <input
                id="newsletter-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-x-newsletter-input"
                required
              />
              <button
                type="submit"
                className="footer-x-newsletter-submit"
                aria-label="Suscribir"
              >
                {submitted ? "✓" : "→"}
              </button>
            </div>
          </form>
        </div>

        <div className="footer-x-legal">
          <ul className="footer-x-legal-links">
            <li><a href="/sobre-nosotros">Sobre nosotros</a></li>
            <li><a href="#manifiesto">Código de conducta</a></li>
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/prensa">Prensa</a></li>
            <li><a href="/terminos">Términos</a></li>
            <li><a href="/privacidad">Privacidad</a></li>
          </ul>
          <span className="footer-x-copy">
            © {new Date().getFullYear()} mardelplata.dev
          </span>
        </div>
      </div>
    </footer>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.95-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.19a10.93 10.93 0 0 1 5.74 0c2.2-1.5 3.16-1.19 3.16-1.19.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.42.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.32 4.37A19.79 19.79 0 0 0 16.4 3l-.2.4a17.95 17.95 0 0 0-5.4 0L10.6 3a19.79 19.79 0 0 0-3.92 1.37C3.84 8.6 3.07 12.7 3.45 16.74a19.93 19.93 0 0 0 6.07 3.07l.49-.7a13.5 13.5 0 0 1-2.13-1.04c.18-.13.35-.27.52-.41 4.13 1.93 8.59 1.93 12.66 0 .17.14.34.28.52.41-.69.42-1.4.78-2.13 1.05l.49.7a19.93 19.93 0 0 0 6.07-3.08c.46-4.66-.71-8.72-2.7-12.37zM9.16 14.42c-1.21 0-2.2-1.13-2.2-2.51 0-1.39.97-2.52 2.2-2.52s2.21 1.13 2.2 2.52c0 1.38-.97 2.51-2.2 2.51zm5.68 0c-1.21 0-2.2-1.13-2.2-2.51 0-1.39.97-2.52 2.2-2.52s2.21 1.13 2.2 2.52c0 1.38-.97 2.51-2.2 2.51z"/>
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.62 0 4.29 2.39 4.29 5.49v6.25zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.22-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.93 3.9 2.39 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.63-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.5.7c-1 .2-1.7 1-2 2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1 1.8 2 2 2 .7 9.5.7 9.5.7s7.5 0 9.5-.7c1-.2 1.7-1 2-2 .5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
    </svg>
  );
}
