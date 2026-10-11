"use client";

import { useState } from "react";
import FormField, { inputClass } from "@/components/ui/FormField";
import { EstrellasInput } from "@/components/ui/Estrellas";
import { MAX_COMENTARIO, validarCalificacion } from "@/lib/evaluaciones";

// El botón de enviar vive en el footer del Modal y apunta a este id con el atributo `form`.
export const FORM_CALIFICACION_ID = "form-calificacion";

export default function FormularioCalificacion({
  onEnviar,
  comentarioObligatorio = false,
  etiquetaComentario = "Comentario",
  ayudaComentario,
  errorServidor = "",
}) {
  const [estrellas, setEstrellas] = useState(null);
  const [comentario, setComentario] = useState("");
  const [errores, setErrores] = useState({});

  function onSubmit(ev) {
    ev.preventDefault();
    const { valido, errores: e } = validarCalificacion({ estrellas, comentario }, { comentarioObligatorio });
    setErrores(e);
    if (!valido) {
      const destino = e.estrellas ? document.querySelector("#estrellas [role=radio]") : document.getElementById("comentario");
      destino?.focus();
      return;
    }
    onEnviar({ estrellas, comentario: comentario.trim() });
  }

  return (
    <form id={FORM_CALIFICACION_ID} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {errorServidor && (
        <div role="alert" className="rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark">
          {errorServidor}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-charcoal">
          Puntuación<span className="ml-0.5 text-crimson">*</span>
        </p>
        <EstrellasInput valor={estrellas} onChange={setEstrellas} error={errores.estrellas} />
        {errores.estrellas && (
          <p role="alert" className="text-xs font-medium text-crimson">
            {errores.estrellas}
          </p>
        )}
      </div>

      <FormField
        label={etiquetaComentario}
        name="comentario"
        required={comentarioObligatorio}
        error={errores.comentario}
        ayuda={ayudaComentario}
      >
        <textarea
          id="comentario"
          rows={4}
          maxLength={MAX_COMENTARIO}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className={inputClass(!!errores.comentario)}
        />
      </FormField>
    </form>
  );
}
