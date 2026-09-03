import { apiFetch } from "./client";

// --- Estudiante ---
export async function programarSesion({ idTutor, idMateria, fecha, hora, motivo }) {
  return apiFetch("/student/sessions", {
    method: "POST",
    body: { idTutor, idMateria, fecha, hora, motivo },
  });
}

export async function listarSesionesActivasEstudiante() {
  return apiFetch("/student/sessions/active");
}

export async function listarHistorialEstudiante() {
  return apiFetch("/student/sessions/history");
}

export async function cancelarSesionComoEstudiante(id) {
  return apiFetch(`/student/sessions/${id}/cancel`, { method: "PATCH" });
}

// --- Tutor ---
export async function listarSesionesPendientesTutor() {
  return apiFetch("/tutor/sessions/pending");
}

export async function listarHistorialTutor() {
  return apiFetch("/tutor/sessions/history");
}

export async function atenderSesion(id, { resumen }) {
  return apiFetch(`/tutor/sessions/${id}/attend`, {
    method: "PATCH",
    body: { resumen },
  });
}

export async function cancelarSesionComoTutor(id) {
  return apiFetch(`/tutor/sessions/${id}/cancel`, { method: "PATCH" });
}

// --- Perfil (compartido estudiante/tutor) ---
export async function obtenerPerfil(rol) {
  return apiFetch(rol === "tutor" ? "/tutor/profile" : "/estudiante/profile");
}

export async function actualizarPerfil(datos) {
  return apiFetch("/perfil", { method: "PUT", body: datos });
}
