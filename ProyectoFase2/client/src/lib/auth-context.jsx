"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi, loginAdmin, verificarSegundoFactorAdmin, cerrarSesion, resendVerificationToken } from "@/lib/api/auth";
import { setToken } from "@/lib/api/client";

const AuthContext = createContext(null);

const rutasPorRol = {
  estudiante: "/estudiante/tutores",
  tutor: "/tutor/horarios",
  admin: "/admin/solicitudes",
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

  function logout() {
    setToken(null);
    guardarUsuario(null);
    router.push("/login");
    cerrarSesion();
  }

  const value = { usuario, cargando, login, loginComoAdmin, completarSegundoFactorAdmin, logout, guardarUsuario, resendVerification };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
