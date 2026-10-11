"use client";

import { useState } from "react";

function Estrella({ llena, className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${className} ${llena ? "fill-coral text-coral" : "fill-transparent text-charcoal/30"}`}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 3 1.1-6.1L3.2 9.6l6.1-.8L12 3.2z" />
    </svg>
  );
}

// Selector de 0 a 5 estrellas. El "0" es una opción explícita porque la puntuación mínima es 0.
export function EstrellasInput({ valor, onChange, error }) {
  const [vista, setVista] = useState(null);
  const activo = vista ?? valor ?? -1;

  return (
    <div
      id="estrellas"
      role="radiogroup"
      aria-label="Puntuación de 0 a 5 estrellas"
      onMouseLeave={() => setVista(null)}
      className={`flex w-fit items-center gap-1 rounded-lg border px-2 py-1.5 ${
        error ? "border-crimson" : "border-charcoal/20"
      }`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={valor === 0}
        aria-label="0 estrellas"
        onClick={() => onChange(0)}
        onMouseEnter={() => setVista(0)}
        className={`mr-1 h-7 min-w-7 rounded-full px-2 text-xs font-semibold transition ${
          valor === 0 ? "bg-charcoal text-white" : "bg-charcoal/5 text-charcoal-light hover:bg-charcoal/10"
        }`}
      >
        0
      </button>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setVista(n)}
          className="rounded p-0.5 transition hover:scale-110"
        >
          <Estrella llena={activo >= n} />
        </button>
      ))}
      <span className="ml-2 text-xs font-medium text-charcoal-light" aria-live="polite">
        {valor === null || valor === undefined ? "Sin elegir" : `${valor} de 5`}
      </span>
    </div>
  );
}

// Solo lectura, para mostrar una calificación ya registrada.
export function EstrellasLectura({ valor = 0 }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Estrella key={n} llena={valor >= n} className="h-4 w-4" />
      ))}
      <span className="ml-1 text-xs font-semibold text-charcoal">{valor}/5</span>
    </span>
  );
}
