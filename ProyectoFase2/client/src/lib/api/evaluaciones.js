import { apiFetch } from "./client";
import { USAR_MOCK } from "../mock/config";
import * as mock from "../mock/api";

// HU-033 / HU-036: calificar a la contraparte de una sesión atendida.
//   rol="estudiante" -> califica al tutor      body: { estrellas, comentario }
//   rol="tutor"      -> califica al estudiante body: { estrellas, comentario }
export async function calificarContraparte(rol, idSesion, { estrellas, comentario }) {
  if (USAR_MOCK) return mock.calificar(rol, idSesion, { estrellas, comentario });

  // TODO(backend): confirmar las rutas definitivas con el equipo de backend.
  const ruta =
    rol === "estudiante"
      ? `/student/sessions/${idSesion}/rating`
      : `/tutor/sessions/${idSesion}/rating`;
  return apiFetch(ruta, { method: "POST", body: { estrellas, comentario } });
}

// HU-034 / HU-037: reportar a la contraparte. El reporte llega al módulo del administrador.
export async function reportarContraparte(rol, idSesion, { categoria, descripcion }) {
  if (USAR_MOCK) return mock.reportar(rol, idSesion, { categoria, descripcion });

  // TODO(backend): confirmar las rutas definitivas con el equipo de backend.
  const ruta =
    rol === "estudiante"
      ? `/student/sessions/${idSesion}/report`
      : `/tutor/sessions/${idSesion}/report`;
  return apiFetch(ruta, { method: "POST", body: { categoria, descripcion } });
}
