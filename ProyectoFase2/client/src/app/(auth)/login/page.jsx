"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";
import VerificacionTokenForm from "@/components/auth/VerificacionTokenForm";
import CuentasDemo from "@/components/auth/CuentasDemo";
import { USAR_MOCKS } from "@/lib/api/client";

export default function LoginPage() {
    const { login, loginComoAdmin } = useAuth();
    const { mostrarToast } = useToast();
    const router = useRouter();

    const [identificador, setIdentificador] = useState("");
    const [password, setPassword] = useState("");
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [errorGeneral, setErrorGeneral] = useState("");
    const [paso, setPaso] = useState("credenciales");

    function validar() {
        const e = {};
        if (!identificador.trim()) {
            e.identificador = "Ingresa tu correo electrónico";
        }
        if (!password) {
            e.password = "Ingresa tu contraseña.";
        }
        setErrores(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        setErrorGeneral("");
        if (!validar()) return;

        setCargando(true);
        const inputLimpio = identificador.trim();
        const tieneArroba = inputLimpio.includes("@");

        try {
            let resultado;
            if (tieneArroba) {
                // Si contiene '@', intentamos primero como Estudiante/Tutor y fallback a Admin
                try {
                    resultado = await login({ email: inputLimpio, password });
                } catch (errEst) {
                    try {
                        resultado = await loginComoAdmin({ nombre_usuario: inputLimpio, password });
                    } catch {
                        throw errEst;
                    }
                }
            } else {
                // Si no contiene '@', intentamos primero como Administrador y fallback a Estudiante/Tutor
                try {
                    resultado = await loginComoAdmin({ nombre_usuario: inputLimpio, password });
                } catch (errAdmin) {
                    try {
                        resultado = await login({ email: inputLimpio, password });
                    } catch {
                        throw errAdmin;
                    }
                }
            }

            if (resultado?.requiereToken) {
                setPaso("token");
                return;
            }

            if (resultado?.requiereSegundoFactor) {
                sessionStorage.setItem(
                    "educonnect_2fa",
                    JSON.stringify({
                        adminId: resultado.adminId,
                        status: resultado.status,
                        qr_code: resultado.qr_code ?? null,
                    })
                );
                router.push("/login/segundo-factor");
                return;
            }

            mostrarToast("Bienvenido a EduConnect.", "exito");
        } catch (err) {
            setErrorGeneral(err.message || "Credenciales incorrectas.");
        } finally {
            setCargando(false);
        }
    }

    async function onVerificarToken(token) {
        setErrorGeneral("");
        setCargando(true);
        try {
            await login({ email: identificador.trim(), password, token });
            mostrarToast("Bienvenido a EduConnect.", "exito");
        } catch (err) {
            setErrorGeneral(err.message || "No pudimos verificar tu cuenta. Revisa el token e inténtalo de nuevo.");
        } finally {
            setCargando(false);
        }
    }

    function volverACredenciales() {
        setPaso("credenciales");
        setPassword("");
        setErrorGeneral("");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
            <div className="w-full max-w-md overflow-hidden rounded-card bg-white shadow-soft">
                <div className="p-8">
                    {paso === "token" ? (
                        <VerificacionTokenForm
                            correo={identificador.trim()}
                            onVerificar={onVerificarToken}
                            onVolver={volverACredenciales}
                            cargando={cargando}
                            errorServidor={errorGeneral}
                        />
                    ) : (
                        <>
                            <h1 className="font-display text-2xl text-charcoal">EduConnect - G8</h1>
                            <p className="mt-1 text-sm text-charcoal-light">
                                Inicia sesión para gestionar tus tutorías académicas.
                            </p>

                            {errorGeneral && (
                                <div
                                    role="alert"
                                    className="mt-4 rounded-lg border border-crimson/30 bg-crimson-light/30 px-4 py-3 text-sm text-crimson-dark"
                                >
                                    {errorGeneral}
                                </div>
                            )}

                            <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
                                <FormField
                                    label="Correo electrónico"
                                    name="identificador"
                                    required
                                    error={errores.identificador}
                                >
                                    <input
                                        id="identificador"
                                        type="text"
                                        autoComplete="username"
                                        value={identificador}
                                        onChange={(e) => setIdentificador(e.target.value)}
                                        className={inputClass(!!errores.identificador)}
                                        placeholder="tucorreo@usac.edu.gt"
                                    />
                                </FormField>

                                <FormField label="Contraseña" name="password" required error={errores.password}>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputClass(!!errores.password)}
                                        placeholder="••••••••"
                                    />
                                </FormField>

                                <Button type="submit" cargando={cargando} className="mt-2 w-full">
                                    Iniciar sesión
                                </Button>
                            </form>

                            <p className="mt-6 text-center text-sm text-charcoal-light">
                                ¿Aún no tienes cuenta?{" "}
                                <Link href="/registro" className="font-semibold text-crimson hover:underline">
                                    Regístrate aquí
                                </Link>
                            </p>

                            {USAR_MOCKS && <CuentasDemo />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
