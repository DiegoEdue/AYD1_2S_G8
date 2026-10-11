"use client";

import { useState } from "react";
import FormField, { inputClass } from "@/components/ui/FormField";
import { MAX_DESCRIPCION_REPORTE, MIN_DESCRIPCION_REPORTE, validarReporte } from "@/lib/evaluaciones";

export const FORM_REPORTE_ID = "form-reporte";

export default function FormularioReporte({ categorias, onEnviar, etiquetaDescripcion = "Descripción", errorServidor = "" }) {
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState({});

  function onSubmit(ev) {
    ev.preventDefault();
    const { valido, errores: e } = validarReporte({ categoria, descripcion }, categorias);
    setErrores(e);
    if (!valido) {
      document.getElementById(e.categoria ? "categoria" : "descripcion")?.focus();
      return;
    }
    onEnviar({ categoria, descripcion: descripcion.trim() });
  }

  return (
    <form id={FORM_REPORTE_ID} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {errorServidor && (
        <div role="alert" className="rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark">
          {errorServidor}
        </div>
      )}

      <FormField label="Categoría" name="categoria" required error={errores.categoria}>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={`${inputClass(!!errores.categoria)} bg-white`}
        >
          <option value="">Elige una categoría</option>
          {categorias.map((c) => (
            <option key={c.valor} value={c.valor}>
              {c.etiqueta}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label={etiquetaDescripcion}
        name="descripcion"
        required
        error={errores.descripcion}
        ayuda={`Mínimo ${MIN_DESCRIPCION_REPORTE} caracteres. Lo revisará la administración.`}
      >
        <textarea
          id="descripcion"
          rows={5}
          maxLength={MAX_DESCRIPCION_REPORTE}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={inputClass(!!errores.descripcion)}
        />
      </FormField>
    </form>
  );
}
