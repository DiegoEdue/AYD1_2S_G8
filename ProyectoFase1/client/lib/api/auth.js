import { apiFetch, setToken } from "./client";

export async function login({ email, password }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (data.requiereSegundoFactor) {
    return { requiereSegundoFactor: true, sesionId: data.sesionId };
  }

  setToken(data.token);
  return { usuario: data.usuario };
}

export async function verificarSegundoFactorAdmin({ sesionId, archivo }) {
  const formData = new FormData();
  formData.append("sesionId", sesionId);
  formData.append("archivo", archivo);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/admin/segundo-factor`,
    { method: "POST", body: formData }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "No pudimos validar tu archivo de segunda autenticación. Verifica el archivo e inténtalo de nuevo."
    );
  }

  setToken(data.token);
  return { usuario: data.usuario };
}

export async function registrarEstudiante(datos) {
  return apiFetch("/auth/registro/estudiante", { method: "POST", body: datos });
}

export async function registrarTutor(datos) {
  return apiFetch("/auth/registro/tutor", { method: "POST", body: datos });
}

export function cerrarSesion() {
  setToken(null);
}
