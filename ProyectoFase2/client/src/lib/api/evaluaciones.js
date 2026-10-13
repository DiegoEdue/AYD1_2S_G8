import { apiFetch } from "./client";

// HU-033 / HU-036: calificar a la contraparte de una sesión atendida.
export async function calificarContraparte(rol, idSesion, { estrellas, comentario }) {
  if (rol === "estudiante") {
    return apiFetch(`/student/sessions/${idSesion}/rating`, {
      method: "POST",
      body: { estrellas, comentario },
    });
  }
  return apiFetch(`/tutor/sessions/${idSesion}/rating`, {
    method: "PUT",
    body: { estrellas, comentario },
  });
}

// HU-034 / HU-037: reportar a la contraparte. El reporte llega al módulo del administrador.
export async function reportarContraparte(rol, idSesion, { categoria, descripcion }) {
  if (rol === "estudiante") {
    return apiFetch(`/student/sessions/${idSesion}/report`, {
      method: "POST",
      body: { categoria, descripcion },
    });
  }
  return apiFetch(`/tutor/sessions/${idSesion}/report`, {
    method: "POST",
    body: { categoria, motivo: descripcion },
  });
}
