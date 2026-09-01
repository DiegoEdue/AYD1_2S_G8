"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PREVIEW_ROL, RUTA_POR_ROL, USUARIOS_DEMO } from "@/lib/preview-config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(USUARIOS_DEMO[PREVIEW_ROL]);
  const router = useRouter();

  function guardarUsuario(data) {
    setUsuario(data);
  }

  async function login({ email }) {
    await new Promise((r) => setTimeout(r, 350)); // simula latencia de red

    if (email.trim().toLowerCase() === USUARIOS_DEMO.administrador.correo) {
      return { requiereSegundoFactor: true, sesionId: "demo-sesion-admin" };
    }

    const usuarioDemo = USUARIOS_DEMO[PREVIEW_ROL];
    guardarUsuario(usuarioDemo);
    router.push(RUTA_POR_ROL[usuarioDemo.rol]);
    return { usuario: usuarioDemo };
  }

  async function completarSegundoFactorAdmin({ archivo }) {
    await new Promise((r) => setTimeout(r, 350));
    if (!archivo || archivo.name !== "auth2-ayd1.txt") {
      throw new Error('El archivo debe llamarse exactamente "auth2-ayd1.txt".');
    }
    guardarUsuario(USUARIOS_DEMO.administrador);
    router.push(RUTA_POR_ROL.administrador);
    return USUARIOS_DEMO.administrador;
  }

  function logout() {
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
