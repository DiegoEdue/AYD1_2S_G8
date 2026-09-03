import { apiFetch } from "./client";

export async function listarTutores(filtros = {}) {
  const params = new URLSearchParams(
    Object.entries(filtros).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return apiFetch(`/student/catalog${params ? `?${params}` : ""}`);
}

export async function obtenerTutor(id) {
  return apiFetch(`/student/tutor/${id}/availability`);
}

export async function obtenerHorarioTutor(id, fecha) {
  const params = fecha ? `?date=${fecha}` : "";
  return apiFetch(`/student/tutor/${id}/availability${params}`);
}

export async function establecerHorario({ dias, startTime, endTime }) {
  const params = new URLSearchParams({ dias: JSON.stringify(dias), startTime, endTime });
  return apiFetch(`/tutor/schedule?${params.toString()}`, { method: "PUT" });
}

export async function actualizarHorario({ dias, startTime, endTime }) {
  const params = new URLSearchParams({ dias: JSON.stringify(dias), startTime, endTime });
  return apiFetch(`/tutor/schedule?${params.toString()}`, { method: "PUT" });
}
