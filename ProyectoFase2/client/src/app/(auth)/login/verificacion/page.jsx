"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import OtpInput from "@/components/ui/OtpInput";

export default function VerificacionPrimerInicioPage() {
    const { login, resendVerification } = useAuth();
    const { mostrarToast } = useToast();
    const router = useRouter();

    const [codigo, setCodigo] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const [data] = useState(() => {
        if (typeof window === "undefined") return null;
        const raw = window.sessionStorage.getItem("educonnect_pending_auth");
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            window.sessionStorage.removeItem("educonnect_pending_auth");
            return null;
        }
    });

    useEffect(() => {
        if (!data) {
            router.push("/login");
        }
    }, [data, router]);

    if (!data) return null;

    async function onSubmit(ev) {
        ev.preventDefault();
        setError("");

        if (!codigo || codigo.trim().length < 6) {
            setError("Ingresa el código de 6 dígitos enviado a tu correo.");
            return;
        }

        setCargando(true);
        try {
            // Pasamos verification_token como lo requiere auth.js
            const respuesta = await login({
                email: data.identificador,
                password: data.password,
                verification_token: codigo.trim(),
            });

            // Si el token aún es inválido o expiró
            if (respuesta?.requiresVerification) {
                setError(respuesta.message || "Código de verificación inválido o expirado.");
                return;
            }

            sessionStorage.removeItem("educonnect_pending_auth");
            mostrarToast("Correo verificado exitosamente. ¡Bienvenido!", "exito");
        } catch (err) {
            setError(err.message || "Código de verificación inválido o expirado.");
        } finally {
            setCargando(false);
        }
    }

    async function handleReenviar() {
        setCargando(true);
        setError("");
        try {
            if (resendVerification) {
                await resendVerification({ email: data.identificador });
            }
            mostrarToast("Nuevo código enviado a tu correo institucional.", "exito");
        } catch (err) {
            setError(err.message || "Error al solicitar un nuevo código.");
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-charcoal px-4 py-10">
            <div className="w-full max-w-md overflow-hidden rounded-card bg-white shadow-soft">
                <div className="p-8">
                    <h1 className="font-display text-xl text-charcoal">
                        Verifica tu correo electrónico
                    </h1>
                    <p className="mt-1 text-sm text-charcoal-light">
                        Es tu primer inicio de sesión. Ingresa el código de 6 dígitos que enviamos a{" "}
                        <strong className="break-all font-semibold text-charcoal">{data.identificador}</strong>.
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
                            label="Código de verificación"
                            name="codigo"
                            required
                        >
                            <OtpInput
                                length={6}
                                value={codigo}
                                onChange={(valor) => {
                                    setCodigo(valor);
                                    if (error) setError("");
                                }}
                                status={error ? "error" : "idle"}
                                disabled={cargando}
                                autoFocus
                                aria-label="Código enviado a tu correo"
                            />
                        </FormField>

                        <div className="flex gap-3">
                            <Link href="/login" className="flex-1">
                                <Button
                                    variante="fantasma"
                                    type="button"
                                    className="w-full"
                                    disabled={cargando}
                                    onClick={() => sessionStorage.removeItem("educonnect_pending_auth")}
                                >
                                    Atrás
                                </Button>
                            </Link>
                            <Button type="submit" cargando={cargando} className="flex-1">
                                Verificar e ingresar
                            </Button>
                        </div>

                        <Button
                            type="button"
                            variante="fantasma"
                            className="mt-1 w-full text-xs"
                            onClick={handleReenviar}
                            disabled={cargando}
                        >
                            ¿No recibiste el código? Reenviar correo
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}