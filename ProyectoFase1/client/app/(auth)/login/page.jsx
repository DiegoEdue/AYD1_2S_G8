"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import FormField, { inputClass } from "@/components/ui/FormField";

export default function LoginPage() {
    const { login, loginComoAdmin } = useAuth();
    const { mostrarToast } = useToast();
    const router = useRouter();

    const [rol, setRol] = useState("estudiante");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [errorGeneral, setErrorGeneral] = useState("");

    function validar() {
        const e = {};
        if (rol === "admin") {
            if (!email.trim()) e.email = "Ingresa tu nombre de usuario.";
        } else {
            if (!email) e.email = "Ingresa tu correo electrónico.";
            else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "El correo no tiene un formato válido.";
        }
        if (!password) e.password = "Ingresa tu contraseña.";
        setErrores(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        setErrorGeneral("");
        if (!validar()) return;

        setCargando(true);
        try {
            let resultado;
            if (rol === "admin") {
                resultado = await loginComoAdmin({ nombre_usuario: email.trim(), password });
            } else {
                resultado = await login({ email: email.trim(), password });
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
            setErrorGeneral(err.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
        <div className="w-full max-w-md overflow-hidden rounded-card bg-white shadow-soft">
            <div className="p-8">
            <h1 className="font-display text-2xl text-charcoal">EduConnect - G8</h1>
            <p className="mt-1 text-sm text-charcoal-light">
                Inicia sesión para gestionar tus tutorías académicas.
            </p>

            <div className="mt-5 flex rounded-full bg-paper p-1">
                {[
                    { valor: "estudiante", etiqueta: "Estudiante/Tutor" },
                    { valor: "admin", etiqueta: "Administrador" },
                ].map((item) => (
                    <button
                        key={item.valor}
                        type="button"
                        onClick={() => setRol(item.valor)}
                        className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                            rol === item.valor
                                ? "bg-charcoal text-white"
                                : "text-charcoal-light hover:text-charcoal"
                        }`}
                    >
                        {item.etiqueta}
                    </button>
                ))}
            </div>

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
                    label={rol === "admin" ? "Nombre de usuario" : "Correo electrónico"}
                    name="email"
                    required
                    error={errores.email}
                >
                <input
                    id="email"
                    type={rol === "admin" ? "text" : "email"}
                    autoComplete={rol === "admin" ? "username" : "email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass(!!errores.email)}
                    placeholder={rol === "admin" ? "admin" : "tucorreo@usac.edu.gt"}
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
            </div>
        </div>
        </div>
    );
}
