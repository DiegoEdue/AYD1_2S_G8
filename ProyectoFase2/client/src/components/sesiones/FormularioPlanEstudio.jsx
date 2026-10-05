"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import Icon from "@/components/ui/Icon";
import { TIPOS_RECURSO, tipoRecurso } from "@/lib/tipos-recurso";
import { armarPayloadPlan, recursoVacio, validarPlanEstudio } from "@/lib/plan-estudio";

// El botón de enviar vive en el footer del Modal y apunta a este id con el atributo `form`.
export const FORM_PLAN_ID = "form-plan-estudio";

const CAMPOS_RECURSO = ["nombre", "tipo", "valor", "descripcion"];

function formatearTamanio(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function FormularioPlanEstudio({ onGuardar, errorServidor = "" }) {
  const [dificultades, setDificultades] = useState("");
  const [recursos, setRecursos] = useState([]);
  const [errores, setErrores] = useState({});
  const siguienteId = useRef(1);
  const idParaEnfocar = useRef(null);
  const botonAgregar = useRef(null);

  // Tras agregar una fila, el cursor va a su campo "Nombre".
  useEffect(() => {
    if (idParaEnfocar.current) {
      document.getElementById(idParaEnfocar.current)?.focus();
      idParaEnfocar.current = null;
    }
  }, [recursos]);

  function agregarRecurso() {
    const id = siguienteId.current++;
    idParaEnfocar.current = `recurso-${id}-nombre`;
    setRecursos((prev) => [...prev, recursoVacio(id)]);
  }

  function quitarRecurso(id) {
    setRecursos((prev) => prev.filter((r) => r.id !== id));
    setErrores((prev) => {
      if (!prev.recursosDetalle?.[id]) return prev;
      const resto = { ...prev.recursosDetalle };
      delete resto[id];
      return { ...prev, recursosDetalle: resto };
    });
    botonAgregar.current?.focus();
  }

  function cambiarRecurso(id, campo, valor) {
    setRecursos((prev) => prev.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)));
  }

  // Al cambiar de tipo se descarta lo que se había puesto para el tipo anterior.
  function cambiarTipo(id, tipo) {
    setRecursos((prev) =>
      prev.map((r) => (r.id === id ? { ...r, tipo, url: "", contenido: "", archivo: null } : r))
    );
    setErrores((prev) => {
      if (!prev.recursosDetalle?.[id]) return prev;
      const { valor, ...resto } = prev.recursosDetalle[id];
      void valor;
      return { ...prev, recursosDetalle: { ...prev.recursosDetalle, [id]: resto } };
    });
  }

  function primerCampoConError(e) {
    if (e.dificultades) return "dificultades";
    for (const r of recursos) {
      const campo = CAMPOS_RECURSO.find((c) => e.recursosDetalle?.[r.id]?.[c]);
      if (campo) return `recurso-${r.id}-${campo}`;
    }
    return null;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    const { valido, errores: e } = validarPlanEstudio({ dificultades, recursos });
    setErrores(e);
    if (!valido) {
      const destino = primerCampoConError(e);
      if (destino) requestAnimationFrame(() => document.getElementById(destino)?.focus());
      return;
    }
    onGuardar(armarPayloadPlan({ dificultades, recursos }));
  }

  function campoValor(r, tipo, base, error) {
    const id = `${base}-valor`;
    if (tipo.entrada === "texto") {
      return (
        <FormField label="Contenido del texto" name={id} required error={error}>
          <textarea
            id={id}
            rows={4}
            value={r.contenido}
            onChange={(ev) => cambiarRecurso(r.id, "contenido", ev.target.value)}
            className={inputClass(!!error)}
          />
        </FormField>
      );
    }
    if (tipo.entrada === "url") {
      return (
        <FormField
          label={tipo.valor === "video" ? "Enlace del video" : "Enlace (URL)"}
          name={id}
          required
          error={error}
          ayuda="Pega la dirección completa, por ejemplo https://..."
        >
          <input
            id={id}
            type="url"
            inputMode="url"
            value={r.url}
            onChange={(ev) => cambiarRecurso(r.id, "url", ev.target.value)}
            className={inputClass(!!error)}
            placeholder="https://"
          />
        </FormField>
      );
    }
    return (
      <FormField
        label={tipo.valor === "pdf" ? "Archivo PDF" : "Archivo de imagen"}
        name={id}
        required
        error={error}
        ayuda={
          r.archivo
            ? `${r.archivo.name} · ${formatearTamanio(r.archivo.size)}`
            : `Tamaño máximo: ${tipo.maxMB} MB.`
        }
      >
        <input
          id={id}
          type="file"
          accept={tipo.accept}
          onChange={(ev) => cambiarRecurso(r.id, "archivo", ev.target.files?.[0] ?? null)}
          className={`block w-full rounded-lg border bg-white text-sm text-charcoal-light file:mr-3 file:cursor-pointer file:border-0 file:bg-cream file:px-4 file:py-2 file:text-sm file:font-semibold file:text-charcoal hover:file:bg-cream-dark ${
            error ? "border-crimson" : "border-charcoal/20"
          }`}
        />
      </FormField>
    );
  }

  return (
    <form id={FORM_PLAN_ID} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {errorServidor && (
        <div
          role="alert"
          className="rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
        >
          {errorServidor}
        </div>
      )}

      <FormField
        label="Dificultades identificadas"
        name="dificultades"
        required
        error={errores.dificultades}
        ayuda="Escribe un tema por línea. El estudiante verá cada línea como un punto de su plan."
      >
        <textarea
          id="dificultades"
          rows={4}
          value={dificultades}
          onChange={(e) => setDificultades(e.target.value)}
          className={inputClass(!!errores.dificultades)}
          placeholder={"Regla de la cadena en funciones compuestas\nLímites al infinito"}
        />
      </FormField>

      <section aria-labelledby="titulo-recursos" className="flex flex-col gap-3">
        <div>
          <h3 id="titulo-recursos" className="font-display text-base text-charcoal">
            Recursos recomendados
          </h3>
          <p className="text-xs text-charcoal-light">
            Opcional. Comparte texto, un enlace, un video, un PDF o una imagen para que el estudiante refuerce estos temas.
          </p>
        </div>

        {errores.recursos && (
          <p role="alert" className="text-xs font-medium text-crimson">
            {errores.recursos}
          </p>
        )}

        {recursos.length === 0 && (
          <p className="rounded-lg border border-dashed border-charcoal/20 px-4 py-6 text-center text-sm text-charcoal-light">
            Todavía no agregaste recursos.
          </p>
        )}

        {recursos.map((r, i) => {
          const e = errores.recursosDetalle?.[r.id] || {};
          const base = `recurso-${r.id}`;
          const tipo = tipoRecurso(r.tipo);
          return (
            <fieldset key={r.id} className="rounded-lg border border-charcoal/10 bg-paper p-4">
              <legend className="px-1 text-sm font-semibold text-charcoal">Recurso {i + 1}</legend>
              <div className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_11rem]">
                  <FormField label="Nombre" name={`${base}-nombre`} required error={e.nombre}>
                    <input
                      id={`${base}-nombre`}
                      type="text"
                      value={r.nombre}
                      onChange={(ev) => cambiarRecurso(r.id, "nombre", ev.target.value)}
                      className={inputClass(!!e.nombre)}
                    />
                  </FormField>
                  <FormField label="Tipo" name={`${base}-tipo`} required error={e.tipo}>
                    <select
                      id={`${base}-tipo`}
                      value={r.tipo}
                      onChange={(ev) => cambiarTipo(r.id, ev.target.value)}
                      className={`${inputClass(!!e.tipo)} bg-white`}
                    >
                      <option value="">Elige un tipo</option>
                      {TIPOS_RECURSO.map((t) => (
                        <option key={t.valor} value={t.valor}>
                          {t.etiqueta}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {tipo.entrada && <div key={r.tipo}>{campoValor(r, tipo, base, e.valor)}</div>}

                <FormField
                  label="Descripción de uso"
                  name={`${base}-descripcion`}
                  required
                  error={e.descripcion}
                >
                  <textarea
                    id={`${base}-descripcion`}
                    rows={2}
                    value={r.descripcion}
                    onChange={(ev) => cambiarRecurso(r.id, "descripcion", ev.target.value)}
                    className={inputClass(!!e.descripcion)}
                  />
                </FormField>
                <div className="flex justify-end">
                  <Button
                    variante="fantasma"
                    tamanio="sm"
                    aria-label={`Quitar recurso ${i + 1}`}
                    onClick={() => quitarRecurso(r.id)}
                  >
                    Quitar
                  </Button>
                </div>
              </div>
            </fieldset>
          );
        })}

        <div>
          <Button ref={botonAgregar} variante="suave" tamanio="sm" onClick={agregarRecurso}>
            <Icon name="Mas" className="h-4 w-4" />
            Agregar recurso
          </Button>
        </div>
      </section>
    </form>
  );
}
