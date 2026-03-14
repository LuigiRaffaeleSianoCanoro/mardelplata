"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "w-full bg-ocean-700/60 border border-ocean-600/60 text-white placeholder-ocean-400 rounded-xl px-4 py-3.5 text-sm transition-all focus:outline-none focus:border-ocean-300 focus:shadow-[0_0_0_3px_rgba(0,180,216,0.2)]";

  return (
    <section id="contacto" className="py-20 px-6 bg-ocean-800">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-ocean-700/80 border border-ocean-600/50 text-ocean-200 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            ✉️ Contacto
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">Contáctanos</h2>
          <p className="text-ocean-300 text-lg">¿Tenés alguna duda o propuesta? Escribinos.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text"  placeholder="Nombre" required className={inputClass} />
              <input type="email" placeholder="Email"  required className={inputClass} />
            </div>
            <input type="text" placeholder="Asunto" required className={inputClass} />
            <textarea
              rows={5}
              placeholder="Mensaje"
              required
              className={`${inputClass} resize-none`}
            />
            <button
              type="submit"
              className="w-full bg-ocean-400 hover:bg-ocean-300 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-ocean-400/40 hover:-translate-y-0.5"
            >
              Enviar Mensaje →
            </button>
          </form>
        ) : (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">🌊</div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">¡Mensaje enviado!</h3>
            <p className="text-ocean-300 text-lg">Nos pondremos en contacto pronto. ¡Gracias por escribirnos!</p>
          </div>
        )}
      </div>
    </section>
  );
}
