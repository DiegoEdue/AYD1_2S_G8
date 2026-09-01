import { apiFetch } from "./client";

// --- Estudiante ---
export async function programarSesion({ tutorId, fecha, hora, materia, motivo }) {
  return apiFetch("/sesiones", {
    method: "POST",
    body: { tutorId, fecha, hora, materia, motivo },
  });
}

export async function listarSesionesActivasEstudiante() {
  return apiFetch("/estudiante/sesiones/activas");
}

export async function listarHistorialEstudiante() {
  return apiFetch("/estudiante/sesiones/historial");
}

export async function cancelarSesionComoEstudiante(id) {
  return apiFetch(`/sesiones/${id}/cancelar`, { method: "PATCH" });
}

// --- Tutor ---
export async function listarSesionesPendientesTutor() {
  return apiFetch("/tutor/sesiones/pendientes");
}

export async function listarHistorialTutor() {
  return apiFetch("/tutor/sesiones/historial");
}

export async function atenderSesion(id, { resumen }) {
  return apiFetch(`/sesiones/${id}/atender`, {
    method: "PATCH",
    body: { resumen },
  });
}

export async function cancelarSesionComoTutor(id) {
  return apiFetch(`/sesiones/${id}/cancelar`, { method: "PATCH" });
}

// --- Perfil (compartido estudiante/tutor) ---
export async function obtenerPerfil() {
  return apiFetch("/perfil");
}

export async function actualizarPerfil(datos) {
  return apiFetch("/perfil", { method: "PUT", body: datos });
}
