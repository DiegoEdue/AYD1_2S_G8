import { apiFetch } from "./client";

export async function listarSolicitudes() {
  return apiFetch("/admin/solicitudes");
}

export async function aprobarSolicitud(id, rol) {
  return apiFetch(`/admin/solicitudes/${id}/aprobar`, {
    method: "PATCH",
    body: { rol },
  });
}

export async function rechazarSolicitud(id, rol) {
  return apiFetch(`/admin/solicitudes/${id}/rechazar`, {
    method: "PATCH",
    body: { rol },
  });
}

export async function obtenerDocumentoEstudiante(id) {
  return apiFetch(`/admin/students/${id}/documento`);
}

export async function obtenerDocumentoTutor(id) {
  return apiFetch(`/admin/tutors/${id}/documento`);
}

export async function listarUsuarios(rol) {
  if (rol === "estudiante") {
    return apiFetch("/admin/students/approved");
  }
  if (rol === "tutor") {
    return apiFetch("/admin/tutors/approved");
  }
  return apiFetch(`/admin/usuarios?rol=${rol}`);
}

export async function listarEstudiantesAprobados() {
  return apiFetch("/admin/students/approved");
}

export async function darDeBajaEstudiante(id, motivo) {
  return apiFetch(`/admin/students/${id}/deactivate`, {
    method: "PUT",
    body: { motivo },
  });
}

export async function listarTutoresAprobados() {
  return apiFetch("/admin/tutors/approved");
}

export async function darDeBajaTutor(id, motivo) {
  return apiFetch(`/admin/tutors/${id}/deactivate`, {
    method: "PUT",
    body: { motivo },
  });
}

export async function darDeBaja(id, rol, motivo) {
  if (rol === "estudiante") {
    return darDeBajaEstudiante(id, motivo);
  }
  if (rol === "tutor") {
    return darDeBajaTutor(id, motivo);
  }
  return apiFetch(`/admin/usuarios/${id}/dar-de-baja`, {
    method: "PATCH",
    body: { rol, motivo },
  });
}

export async function actualizarEstudianteAdmin(id, datos) {
  return apiFetch(`/admin/students/${id}`, {
    method: "PUT",
    body: datos,
  });
}

export async function actualizarTutorAdmin(id, datos) {
  return apiFetch(`/admin/tutors/${id}`, {
    method: "PUT",
    body: datos,
  });
}

export async function listarDenuncias(tipo = "tutores") {
  return apiFetch(`/admin/denuncias?tipo=${tipo}`);
}

export async function resolverDenuncia(id, accion, motivo = "") {
  return apiFetch(`/admin/denuncias/${id}/resolver`, {
    method: "PATCH",
    body: { accion, motivo },
  });
}

export async function obtenerCalificacionesTutores() {
  return apiFetch("/admin/ratings/tutors");
}

export async function obtenerCalificacionesEstudiantes() {
  return apiFetch("/admin/ratings/students");
}

export async function obtenerReportes() {
  return apiFetch("/admin/reportes");
}
