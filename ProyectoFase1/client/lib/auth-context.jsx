"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

const CORREO_DEMO_ADMIN = "admin@educonnect.gt";

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const router = useRouter();

    function guardarUsuario(data) {
        setUsuario(data);
    }

    async function login({ email }) {
        await new Promise((r) => setTimeout(r, 350));
        if (email.trim().toLowerCase() === CORREO_DEMO_ADMIN) {
        return { requiereSegundoFactor: true };
        }

        const usuarioDemo = { nombre: "Usuario demo", correo: email, rol: "estudiante" };
        guardarUsuario(usuarioDemo);
        return { usuario: usuarioDemo };
    }

    async function completarSegundoFactorAdmin({ archivo }) {
        await new Promise((r) => setTimeout(r, 350));
        if (!archivo || archivo.name !== "auth2-ayd1.txt") {
        throw new Error('El archivo debe llamarse exactamente "auth2-ayd1.txt".');
        }
        const usuarioAdmin = { nombre: "Admin EduConnect", correo: CORREO_DEMO_ADMIN, rol: "administrador" };
        guardarUsuario(usuarioAdmin);
        return usuarioAdmin;
    }

    function logout() {
        setUsuario(null);
        router.push("/login");
    }

    const value = useMemo(
        () => ({ usuario, cargando: false, login, completarSegundoFactorAdmin, logout, guardarUsuario }),
        [usuario]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
