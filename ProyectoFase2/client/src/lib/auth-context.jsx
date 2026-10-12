"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi, loginAdmin, verificarSegundoFactorAdmin, cerrarSesion, resendVerificationToken } from "@/lib/api/auth";
import { setToken } from "@/lib/api/client";
import { USUARIOS_DEMO } from "@/lib/mock/usuarios-demo";

const AuthContext = createContext(null);

const rutasPorRol = {
  estudiante: "/estudiante/tutores",
  tutor: "/tutor/horarios",
  admin: "/admin/solicitudes",
};

// En modo demo se aterriza directo en una pantalla de la Fase 2 (las demás dependen del backend).
const RUTAS_DEMO = {
  estudiante: "/estudiante/plan-estudio",
  tutor: "/tutor/sesiones/pendientes",
  admin: "/admin/denuncias",
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cargarUsuario = window.setTimeout(() => {
      const stored = window.localStorage.getItem("educonnect_user");
      if (stored) {
        try {
          setUsuario(JSON.parse(stored));
        } catch {
          window.localStorage.removeItem("educonnect_user");
        }
      }
      setCargando(false);
    }, 0);

    return () => window.clearTimeout(cargarUsuario);
  }, []);

  function guardarUsuario(data) {
    setUsuario(data);
    if (data) window.localStorage.setItem("educonnect_user", JSON.stringify(data));
    else window.localStorage.removeItem("educonnect_user");
  }

  async function login({ email, password, verification_token }) {
    const response = await loginApi({ email, password, verification_token });

    if (response?.requiereSegundoFactor) {
      return response;
    }

    if (response?.requiresVerification) {
      return response;
    }

    if (response?.usuario) {
      guardarUsuario(response.usuario);
      router.push(rutasPorRol[response.usuario.rol] || "/");
    }

    return response;
  }

  async function resendVerification({ email }) {
    const response = await resendVerificationToken({ email });
    return response;
  }

  async function completarSegundoFactorAdmin({ adminId, token }) {
    const response = await verificarSegundoFactorAdmin({ adminId, token });

    if (response?.usuario) {
      guardarUsuario(response.usuario);
      router.push(rutasPorRol[response.usuario.rol] || "/");
    }

    return response;
  }

  async function loginComoAdmin({ nombre_usuario, password }) {
    const response = await loginAdmin({ nombre_usuario, password });

    if (response?.requiereSegundoFactor) {
      return response;
    }

    if (response?.usuario) {
      guardarUsuario(response.usuario);
      router.push(rutasPorRol[response.usuario.rol] || "/");
    }

    return response;
  }

  // Modo solo front: entra sin backend como un usuario simulado de cada rol.
  function entrarComoDemo(rol) {
    const demo = USUARIOS_DEMO[rol];
    if (!demo) return;
    guardarUsuario(demo);
    router.push(RUTAS_DEMO[rol] || "/");
  }

  function logout() {
    setToken(null);
    guardarUsuario(null);
    router.push("/login");
    cerrarSesion();
  }

  const value = { usuario, cargando, login, loginComoAdmin, completarSegundoFactorAdmin, logout, guardarUsuario, resendVerification, entrarComoDemo };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
