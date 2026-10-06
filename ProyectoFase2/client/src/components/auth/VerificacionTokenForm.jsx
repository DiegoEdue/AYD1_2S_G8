"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import { normalizarToken, validarToken } from "@/lib/token";

export default function VerificacionTokenForm({
  correo,
  onVerificar,
  onVolver,
  cargando = false,
  errorServidor = "",
}) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();
    const mensaje = validarToken(token);
    setError(mensaje);
    if (mensaje) return;
    onVerificar(normalizarToken(token));
  }

  return (
    <>
      <h1 className="font-display text-2xl text-charcoal">Verifica tu correo</h1>
      <p className="mt-1 text-sm text-charcoal-light">
        Es tu primer inicio de sesión. Escribe el token que enviamos a{" "}
        <strong className="break-all font-semibold text-charcoal">{correo}</strong>. Solo te lo
        pediremos esta vez.
      </p>

      {errorServidor && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
        >
          {errorServidor}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <FormField
          label="Token de verificación"
          name="token"
          required
          error={error}
          ayuda="Lo encuentras en el correo de bienvenida de EduConnect."
        >
          <input
            id="token"
            type="text"
            autoComplete="one-time-code"
            autoCapitalize="none"
            spellCheck={false}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={`${inputClass(!!error)} font-mono tracking-wide`}
          />
        </FormField>

        <div className="flex gap-3">
          <Button variante="fantasma" className="flex-1" onClick={onVolver} disabled={cargando}>
            Atrás
          </Button>
          <Button type="submit" cargando={cargando} className="flex-1">
            Verificar e ingresar
          </Button>
        </div>
      </form>
    </>
  );
}
