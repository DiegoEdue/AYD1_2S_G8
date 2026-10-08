import { useState } from "react";
import Icon from "./Icon";
import Button from "@/components/ui/Button";
import PdfViewerModal from "@/components/ui/PdfViewerModal";
import { tipoRecurso } from "@/lib/api/tipos-recurso";
import { normalizarDificultades, normalizarRecurso } from "@/lib/api/plan-estudio";

const ETIQUETA_ENLACE = { 
  video: "Ver video", 
  imagen: "Ver imagen completa", 
  enlace: "Abrir enlace" 
};

function Contenido({ recurso, tipo, onAbrirPdf }) {
  const valor = recurso.url_recurso || recurso.recursoUrl || recurso.url || recurso.contenido;

  if (!valor) return null;

  const tipoNormalizado = tipo.valor.toLowerCase();

  // Mostrar Texto directamente en pantalla
  if (tipo.entrada === "texto" || tipoNormalizado === "texto") {
    return (
      <p className="mt-2 whitespace-pre-line rounded-lg bg-cream-light/60 px-3 py-2 text-sm text-charcoal">
        {valor}
      </p>
    );
  }

  // Si es PDF: Botón para abrir el Visor Embebido (PdfViewerModal)
  if (tipoNormalizado === "pdf") {
    return (
      <div className="mt-2">
        <Button
          variante="fantasma"
          tamanio="sm"
          className="border border-charcoal/20 hover:border-charcoal/40 text-crimson"
          onClick={() => onAbrirPdf(recurso, valor)}
        >
          <Icon name="Documento" className="h-4 w-4 text-crimson" />
          <span>Ver PDF</span>
        </Button>
      </div>
    );
  }

  // Garantizar URL completa para Imagen, Video o Enlace
  const urlFinal = valor.startsWith("http") ? valor : `https://${valor}`;

  return (
    <div className="mt-2 flex flex-col items-start gap-2">
      {tipoNormalizado === "imagen" && (
        <a href={urlFinal} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFinal}
            alt={recurso.nombre}
            loading="lazy"
            className="max-h-40 rounded-lg border border-charcoal/10 object-cover"
          />
        </a>
      )}
      <a
        href={urlFinal}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-crimson hover:underline inline-flex items-center gap-1"
      >
        {ETIQUETA_ENLACE[tipoNormalizado] || "Abrir recurso"}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    </div>
  );
}

export default function PlanEstudioDetalle({ dificultades = [], recursos = [] }) {
  const items = normalizarDificultades(dificultades);
  const [documentoVisor, setDocumentoVisor] = useState(null);

  const abrirVisorPdf = (recurso, url) => {
    setDocumentoVisor({
      titulo: recurso.nombre || "Recurso PDF",
      subTitulo: recurso.descripcion || "Plan de estudio",
      documentoUrl: url,
    });
  };

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
                    <Contenido recurso={r} tipo={tipo} onAbrirPdf={abrirVisorPdf} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Visor Embebido de PDF (Reutilizado del Admin) */}
      <PdfViewerModal
        abierto={!!documentoVisor}
        onCerrar={() => setDocumentoVisor(null)}
        titulo={documentoVisor?.titulo}
        subTitulo={documentoVisor?.subTitulo}
        documentoUrl={documentoVisor?.documentoUrl}
        tipoDocumento="pdf"
      />
    </div>
  );
}
