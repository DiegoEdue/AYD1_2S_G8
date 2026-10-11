"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import OtpInput from "@/components/ui/OtpInput";

export default function VerificacionTokenForm({
  correo,
  tokenExpirado = false,
  onVerificar,
  onReenviar,
  onVolver,
  cargando = false,
  errorServidor = "",
}) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();
    const tokenLimpio = token.trim();

    if (!tokenLimpio) {
      setError("Ingresa el código de verificación.");
      return;
    }

    if (tokenLimpio.length < 6) {
      setError("El código debe ser de 6 dígitos.");
      return;
    }

    setError("");
    onVerificar(tokenLimpio);
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
          ayuda={
            tokenExpirado
              ? "El código anterior ha expirado (24h). Solicita uno nuevo."
              : "Ingresa el código de 6 dígitos enviado a tu correo."
          }
        >
          <OtpInput
            length={6}
            value={token}
            onChange={(valor) => {
              setToken(valor);
              if (error) setError("");
            }}
            status={error || errorServidor ? "error" : "idle"}
            disabled={cargando}
            autoFocus
            aria-label="Código de verificación"
          />
        </FormField>

        <div className="flex gap-3">
          <Button type="button" variante="fantasma" className="flex-1" onClick={onVolver} disabled={cargando}>
            Atrás
          </Button>
          <Button type="submit" cargando={cargando} className="flex-1">
            Verificar e ingresar
          </Button>
        </div>

        {onReenviar && (
          <Button
            type="button"
            variante="fantasma"
            className="mt-1 w-full text-xs"
            onClick={onReenviar}
            disabled={cargando}
          >
            {tokenExpirado ? "Reenviar código" : "No recibí el código, reenviar"}
          </Button>
        )}
      </form>
    </>
  );
}