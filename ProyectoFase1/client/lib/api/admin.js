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

export async function listarUsuarios(rol) {
  return apiFetch(`/admin/usuarios?rol=${rol}`);
}

export async function darDeBaja(id, rol, motivo) {
  return apiFetch(`/admin/usuarios/${id}/dar-de-baja`, {
    method: "PATCH",
    body: { rol, motivo },
  });
}

export async function obtenerReportes() {
  return apiFetch("/admin/reportes");
}
