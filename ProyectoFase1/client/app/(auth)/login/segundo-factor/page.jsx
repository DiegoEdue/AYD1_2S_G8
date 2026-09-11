"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";

export default function SegundoFactorAdminPage() {
    const { completarSegundoFactorAdmin } = useAuth();
    const { mostrarToast } = useToast();
    const router = useRouter();

    const [codigo, setCodigo] = useState("");
    const [data] = useState(() => {
        if (typeof window === "undefined") return null;
        const raw = window.sessionStorage.getItem("educonnect_2fa");
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            window.sessionStorage.removeItem("educonnect_2fa");
            return null;
        }
    });
    const [error, setError] = useState("");
    const [verificando, setVerificando] = useState(false);

    useEffect(() => {
        if (!data) {
            router.push("/login");
        }
    }, [data, router]);

    async function onSubmit(ev) {
        ev.preventDefault();
        setError("");

        if (!data?.adminId) {
            setError("No se encontró la sesión de autenticación. Inicia sesión de nuevo.");
            return;
        }

        if (!codigo || codigo.trim().length < 6) {
            setError("Ingresa el código de 6 dígitos de tu aplicación autenticadora.");
            return;
        }

        setVerificando(true);
        try {
            await completarSegundoFactorAdmin({ adminId: data.adminId, token: codigo.trim() });
            sessionStorage.removeItem("educonnect_2fa");
            mostrarToast("Autenticación de administrador verificada.", "exito");
        } catch (err) {
            setError(err.message || "Código de verificación inválido.");
        } finally {
            setVerificando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-charcoal px-4 py-10">
        <div className="w-full max-w-md overflow-hidden rounded-card bg-white shadow-soft">
            <div className="p-8">
            <h1 className="font-display text-xl text-charcoal">Verificación en dos pasos</h1>
            <p className="mt-1 text-sm text-charcoal-light">
                Escanea el código QR con tu app autenticadora y escribe el código de 6 dígitos.
            </p>

            {data?.qr_code && (
                <div className="mt-4 overflow-hidden rounded-lg border border-charcoal/10 bg-paper p-3 text-center">
                    <div dangerouslySetInnerHTML={{ __html: data.qr_code }} />
                </div>
            )}

            {data?.secret && (
                <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-charcoal">
                    <span className="font-semibold">Secreto manual:</span> {data.secret}
                </div>
            )}

            {error && (
                <div
                role="alert"
                className="mt-4 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
                >
                {error}
                </div>
            )}

            <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
                <FormField label="Código de verificación" name="codigo" required>
                <input
                    id="codigo"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                    className={inputClass(!!error)}
                    placeholder="123456"
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
