import Icon from "./Icon";
import { tipoRecurso } from "@/lib/api/tipos-recurso";
import { normalizarDificultades, normalizarRecurso } from "@/lib/api/plan-estudio";

const ETIQUETA_ENLACE = { video: "Ver video", pdf: "Abrir PDF", imagen: "Ver imagen completa", enlace: "Abrir enlace" };

function Contenido({ recurso, tipo }) {
  if (tipo.entrada === "texto" && recurso.contenido) {
    return (
      <p className="mt-2 whitespace-pre-line rounded-lg bg-cream-light/60 px-3 py-2 text-sm text-charcoal">
        {recurso.contenido}
      </p>
    );
  }
  if (!recurso.url) return null;

  return (
    <div className="mt-2 flex flex-col items-start gap-2">
      {tipo.valor === "imagen" && (
        <a href={recurso.url} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recurso.url}
            alt={recurso.nombre}
            loading="lazy"
            className="max-h-40 rounded-lg border border-charcoal/10 object-cover"
          />
        </a>
      )}
      <a
        href={recurso.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-crimson hover:underline"
      >
        {ETIQUETA_ENLACE[tipo.valor] || "Abrir recurso"}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    </div>
  );
}

// Dificultades + recursos de una tutoría. Lo usan "Mi plan de estudio" (estudiante)
// y el historial del tutor, para que ambos vean exactamente lo mismo.
export default function PlanEstudioDetalle({ dificultades = [], recursos = [] }) {
  const items = normalizarDificultades(dificultades);

  return (
    <div className="flex flex-col gap-5">
      <section aria-label="Dificultades identificadas">
        <h4 className="text-sm font-semibold text-charcoal">Dificultades identificadas</h4>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-charcoal-light">No se registraron dificultades.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1.5">
            {items.map((d) => (
              <li key={d.id} className="flex gap-2 text-sm text-charcoal">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                {d.texto}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Recursos recomendados">
        <h4 className="text-sm font-semibold text-charcoal">Recursos recomendados</h4>
        {recursos.length === 0 ? (
          <p className="mt-2 text-sm text-charcoal-light">El tutor no recomendó recursos en esta tutoría.</p>
        ) : (
          <ul className="mt-2 grid gap-3 sm:grid-cols-2">
            {recursos.map((bruto, i) => {
              const r = normalizarRecurso(bruto);
              const tipo = tipoRecurso(r.tipo);
              return (
                <li
                  key={r.id ?? i}
                  className="flex gap-3 rounded-lg border border-charcoal/10 bg-white p-3"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tipo.clase}`}
                  >
                    <Icon name={tipo.icono} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-charcoal">{r.nombre}</p>
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${tipo.clase}`}
                    >
                      {tipo.etiqueta}
                    </span>
                    <p className="mt-1 text-sm text-charcoal-light">{r.descripcion}</p>
                    <Contenido recurso={r} tipo={tipo} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
