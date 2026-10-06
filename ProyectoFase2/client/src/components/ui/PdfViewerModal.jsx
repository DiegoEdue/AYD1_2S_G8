"use client";

import { useEffect, useRef } from "react";
import Button from "./Button";
import Icon from "./Icon";

export default function PdfViewerModal({
  abierto,
  onCerrar,
  titulo = "Visualizador de Documento PDF",
  subTitulo = "",
  documentoUrl = "",
  tipoDocumento = "carnet", // "carnet" | "cv"
  datosUsuario = null,
  onAprobar = null,
  onRechazar = null,
  cargandoAccion = false,
}) {
  const dialogRef = useRef(null);
  const onCerrarRef = useRef(onCerrar);

  useEffect(() => {
    onCerrarRef.current = onCerrar;
  }, [onCerrar]);

  useEffect(() => {
    if (!abierto) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCerrarRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [abierto]);

  if (!abierto) return null;

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const tieneUrlValida =
    typeof documentoUrl === "string" && documentoUrl.trim().length > 0;

  // Determinar el rol correcto con precedencia estricta
  const rolUsuario = datosUsuario?.rol
    ? datosUsuario.rol
    : tipoDocumento === "carnet"
    ? "estudiante"
    : "tutor";

  // Generar URL de transmisión segura con headers inline desde el backend
  let urlStream = "";
  if (datosUsuario?.id) {
    urlStream = `${apiBase}/admin/documento/stream?id=${datosUsuario.id}&tipo=${rolUsuario}`;
    if (tieneUrlValida) {
      urlStream += `&url=${encodeURIComponent(documentoUrl.trim())}`;
    }
  } else if (tieneUrlValida) {
    urlStream = `${apiBase}/admin/documento/stream?url=${encodeURIComponent(documentoUrl.trim())}`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-xs"
      onClick={onCerrar}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex h-[90vh] w-full max-w-4xl flex-col rounded-card bg-white shadow-soft"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
              <Icon name="Documento" className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg text-charcoal">{titulo}</h2>
                <span className="rounded bg-charcoal/5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                  PDF
                </span>
              </div>
              {subTitulo && (
                <p className="text-xs text-charcoal-light">{subTitulo}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {urlStream && (
              <a
                href={urlStream}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-button border border-charcoal/20 px-3 py-1.5 text-xs font-medium text-charcoal transition-colors hover:bg-charcoal/5"
                title="Abrir en pestaña nueva"
              >
                <Icon name="Externo" className="h-3.5 w-3.5" />
                <span>Abrir en nueva pestaña</span>
              </a>
            )}
            <button
              onClick={onCerrar}
              aria-label="Cerrar visor"
              className="rounded-full p-2 text-charcoal-light transition-colors hover:bg-charcoal/10 hover:text-charcoal"
            >
              <Icon name="X" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Visor de Contenido */}
        <div className="relative flex-1 min-h-0 bg-paper/60 p-4">
          {urlStream ? (
            <div className="h-full w-full overflow-hidden rounded-lg border border-charcoal/15 bg-white shadow-xs">
              <iframe
                key={urlStream}
                src={urlStream}
                className="h-full w-full border-0"
                title={titulo}
              />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto rounded-lg border border-dashed border-charcoal/25 bg-white p-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-crimson/10 text-crimson">
                <Icon name="Documento" className="h-7 w-7" />
              </div>
              <h3 className="font-display text-base font-semibold text-charcoal">
                {tipoDocumento === "carnet"
                  ? "Carnet Universitario"
                  : "Curriculum Vitae"}
              </h3>
              <p className="mt-1 max-w-md text-xs text-charcoal-light">
                Visualización preliminar generada para la revisión.
              </p>

              {datosUsuario && (
                <div className="mt-6 w-full max-w-lg rounded-xl border border-charcoal/10 bg-paper/40 p-5 text-left text-xs">
                  <div className="mb-3 flex items-center justify-between border-b border-charcoal/10 pb-2">
                    <span className="font-semibold uppercase tracking-wider text-charcoal-light">
                      Ficha de Registro
                    </span>
                    <span className="rounded-full bg-crimson/10 px-2.5 py-0.5 font-medium text-crimson">
                      {datosUsuario.rol === "estudiante" ? "Estudiante" : "Tutor"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <span className="text-charcoal-light">Nombre completo:</span>
                      <p className="font-medium text-charcoal">{datosUsuario.nombre}</p>
                    </div>
                    <div>
                      <span className="text-charcoal-light">Carnet / ID:</span>
                      <p className="font-mono font-medium text-charcoal">
                        {datosUsuario.carnet}
                      </p>
                    </div>
                    <div>
                      <span className="text-charcoal-light">Correo:</span>
                      <p className="font-medium text-charcoal">{datosUsuario.correo}</p>
                    </div>
                    <div>
                      <span className="text-charcoal-light">Género:</span>
                      <p className="font-medium text-charcoal">{datosUsuario.genero}</p>
                    </div>
                    {datosUsuario.fechaNacimiento && datosUsuario.fechaNacimiento !== "-" && (
                      <div>
                        <span className="text-charcoal-light">Fecha de nacimiento:</span>
                        <p className="font-medium text-charcoal">
                          {datosUsuario.fechaNacimiento}
                        </p>
                      </div>
                    )}
                    {datosUsuario.especialidad && datosUsuario.especialidad !== "-" && (
                      <div>
                        <span className="text-charcoal-light">Especialidad:</span>
                        <p className="font-medium text-charcoal">
                          {datosUsuario.especialidad}
                        </p>
                      </div>
                    )}
                    {datosUsuario.identificacionTutor &&
                      datosUsuario.identificacionTutor !== "-" && (
                        <div>
                          <span className="text-charcoal-light">No. Identificación:</span>
                          <p className="font-mono font-medium text-charcoal">
                            {datosUsuario.identificacionTutor}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              )}

              <p className="mt-4 text-[11px] text-charcoal-light">
                El archivo PDF se cargará de forma automática al recibir el enlace.
              </p>
            </div>
          )}
        </div>

        {/* Pie de página con acciones directas */}
        <div className="flex items-center justify-between border-t border-charcoal/10 px-6 py-4">
          <Button
            variante="fantasma"
            onClick={onCerrar}
            disabled={cargandoAccion}
          >
            Cerrar visor
          </Button>

          {(onAprobar || onRechazar) && (
            <div className="flex items-center gap-3">
              {onRechazar && (
                <Button
                  variante="peligro"
                  onClick={onRechazar}
                  disabled={cargandoAccion}
                >
                  Rechazar solicitud
                </Button>
              )}
              {onAprobar && (
                <Button
                  variante="secundario"
                  onClick={onAprobar}
                  disabled={cargandoAccion}
                >
                  Aceptar solicitud
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
