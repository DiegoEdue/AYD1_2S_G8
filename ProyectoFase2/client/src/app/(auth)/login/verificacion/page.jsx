"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import VerificacionTokenForm from "@/components/auth/VerificacionTokenForm";

export default function VerificacionPage() {
    const router = useRouter();
    const { login, resendVerification } = useAuth();
    const { mostrarToast } = useToast();

    const [authData, setAuthData] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [errorServidor, setErrorServidor] = useState("");

    useEffect(() => {
        const data = sessionStorage.getItem("educonnect_pending_auth");
        if (!data) {
            router.replace("/login");
            return;
        }
        const parsed = JSON.parse(data);
        setAuthData(parsed);
    }, [router]);

    if (!authData) return null;

    async function handleVerificar(token) {
        setErrorServidor("");
        setCargando(true);

        try {
            const res = await login({
                email: authData.identificador,
                password: authData.password,
                verification_token: token,
            });

            sessionStorage.removeItem("educonnect_pending_auth");
            mostrarToast("Bienvenido a EduConnect.", "exito");

            if (res?.requiereSegundoFactor) {
                sessionStorage.setItem(
                    "educonnect_2fa",
                    JSON.stringify({
                        adminId: res.adminId,
                        status: res.status,
                        qr_code: res.qr_code ?? null,
                    })
                );
                router.push("/login/segundo-factor");
            }
        } catch (err) {
            setErrorServidor(err.message || "Código inválido o expirado.");
        } finally {
            setCargando(false);
        }
    }

    async function handleResendToken() {
        setErrorServidor("");
        setCargando(true);
        try {
            const resultado = await resendVerification({ email: authData.identificador });
            if (resultado?.status === "success") {
                mostrarToast("Nuevo código de verificación enviado a su correo.", "exito");
                setAuthData((prev) => ({ ...prev, tokenExpired: false }));
            } else {
                setErrorServidor(resultado?.message || "Error al reenviar código");
            }
        } catch (err) {
            setErrorServidor(err.message || "Error al reenviar código");
        } finally {
            setCargando(false);
        }
    }

    function handleVolver() {
        sessionStorage.removeItem("educonnect_pending_auth");
        router.push("/login");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-charcoal px-4 py-10">
            <div className="w-full max-w-md overflow-hidden rounded-card bg-white p-8 shadow-soft">
                <VerificacionTokenForm
                    correo={authData.identificador}
                    tokenExpirado={authData.tokenExpired}
                    onVerificar={handleVerificar}
                    onReenviar={handleResendToken}
                    onVolver={handleVolver}
                    cargando={cargando}
                    errorServidor={errorServidor}
                />
            </div>
        </div>
    );
}