import { apiFetch } from "./client";

export async function listarTutores(filtros = {}) {
  const params = new URLSearchParams(
    Object.entries(filtros).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return apiFetch(`/tutores${params ? `?${params}` : ""}`);
}

export async function obtenerTutor(id) {
  return apiFetch(`/tutores/${id}`);
}

export async function obtenerHorarioTutor(id, fecha) {
  const params = fecha ? `?fecha=${fecha}` : "";
  return apiFetch(`/tutores/${id}/horario${params}`);
}

export async function establecerHorario({ dias, horaInicio, horaFin }) {
  return apiFetch("/tutor/horario", {
    method: "POST",
    body: { dias, horaInicio, horaFin },
  });
}

export async function actualizarHorario({ dias, horaInicio, horaFin }) {
  return apiFetch("/tutor/horario", {
    method: "PUT",
    body: { dias, horaInicio, horaFin },
  });
}
