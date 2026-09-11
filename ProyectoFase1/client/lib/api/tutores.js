import { apiFetch } from "./client";

export async function listarTutores(filtros = {}) {
  const filtrosApi = {
    materia: filtros.materia,
    universidad: filtros.universidad,
    experienciaMin: filtros.experienciaMin,
    sexo: filtros.genero,
    edadMin: filtros.edadMin,
    edadMax: filtros.edadMax,
  };
  const entradas = Object.entries(filtrosApi).filter(([, valor]) => valor !== "" && valor != null);
  const params = new URLSearchParams(entradas).toString();
  return apiFetch(`${entradas.length ? "/student/catalog/search" : "/student/catalog"}${params ? `?${params}` : ""}`);
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
