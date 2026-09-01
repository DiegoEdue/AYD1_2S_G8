"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";

const NOMBRE_ARCHIVO_ESPERADO = "auth2-ayd1.txt";

export default function SegundoFactorAdminPage() {
    const { completarSegundoFactorAdmin } = useAuth();
    const { mostrarToast } = useToast();

    const [archivo, setArchivo] = useState(null);
    const [error, setError] = useState("");
    const [verificando, setVerificando] = useState(false);

    async function onSubmit(ev) {
        ev.preventDefault();
        setError("");

        if (!archivo) {
        setError("Debes subir tu archivo de segunda autenticación para continuar.");
        return;
        }

        setVerificando(true);
        try {
        await completarSegundoFactorAdmin({ archivo });
        mostrarToast("Autenticación de administrador verificada (simulada).", "exito");
        } catch (err) {
        setError(err.message);
        } finally {
        setVerificando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-charcoal px-4 py-10">
        <div className="w-full max-w-md overflow-hidden rounded-card bg-white shadow-soft">
            <div className="p-8">
            <h1 className="font-display text-xl text-charcoal">Segunda autenticación</h1>
            <p className="mt-1 text-sm text-charcoal-light">
                Paso 2 de 2 — sube tu archivo con la llave cifrada para continuar.
            </p>

            {error && (
                <div
                role="alert"
                className="mt-4 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
                >
                {error}
                </div>
            )}

            <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
                <FormField
                label="Archivo de segunda autenticación"
                name="archivo"
                required
                ayuda={`Debe llamarse exactamente ${NOMBRE_ARCHIVO_ESPERADO}`}
                >
                <input
                    id="archivo"
                    type="file"
                    accept=".txt"
                    onChange={(e) => {
                    setArchivo(e.target.files?.[0] || null);
                    setError("");
                    }}
                    className={inputClass(!!error)}
                />
                </FormField>

                <div className="flex gap-3">
                <Link href="/login" className="flex-1">
                    <Button variante="fantasma" type="button" className="w-full" disabled={verificando}>
                    Atrás
                    </Button>
                </Link>
                <Button type="submit" cargando={verificando} className="flex-1">
                    Verificar e ingresar
                </Button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
}
