import { apiFetch } from "./client";
import { normalizarRecurso } from "./plan-estudio";

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

// El servidor pagina este historial (por defecto 20 por página, máximo 100).
export async function listarHistorialTutor({ page = 1, pageSize = 20 } = {}) {
  return apiFetch(`/tutor/sessions/history?page=${page}&pageSize=${pageSize}`);
}

// HU-013 / HU-035: atender una sesión registra el plan de estudio.
// body: { dificultades: string, recursos: [{ nombre, tipo, descripcion }] }
export async function atenderSesion(id, { dificultades, recursos }) {
  return apiFetch(`/tutor/sessions/${id}/attend`, {
    method: "PATCH",
    body: { dificultades, recursos },
  });
}

// GET /tutor/sessions/:id/detail → incluye el plan de estudio de una sesión atendida.
// El servidor devuelve el plan con claves en inglés ({ dificulties, resources: [{ name, type, description }] });
// aquí se lleva a la misma forma que usa el resto de la app.
export async function obtenerDetalleSesionTutor(id) {
  const response = await apiFetch(`/tutor/sessions/${id}/detail`);
  const detalle = response?.data ?? {};
  const plan = detalle.plan;
  return {
    ...detalle,
    plan: plan
      ? {
          dificultades: plan.dificulties ?? plan.dificultades ?? "",
          recursos: (plan.resources ?? plan.recursos ?? []).map(normalizarRecurso),
        }
      : null,
  };
}

export async function cancelarSesionComoTutor(id) {
  return apiFetch(`/tutor/sessions/${id}/cancel`, { method: "PATCH" });
}

// --- Perfil (compartido estudiante/tutor) ---
// GET /tutor/profile responde en snake_case, pero PATCH /tutor/profile responde en camelCase
// (fotoUrl, carnetId, subjects…). Se unifica a snake_case, que es lo que usan las páginas.
function normalizarPerfilTutor(d) {
  if (!d) return d;
  return {
    ...d,
    id_tutor: d.id_tutor ?? d.id,
    carnet_id: d.carnet_id ?? d.carnetId,
    fecha_nacimiento: d.fecha_nacimiento ?? d.fechaNacimiento,
    foto_url: d.foto_url ?? d.fotoUrl,
    numero_identificacion_tutor: d.numero_identificacion_tutor ?? d.numeroIdentificacionTutor,
    direccion_tutoria: d.direccion_tutoria ?? d.direccionTutoria,
    anio_inicio_tutorias: d.anio_inicio_tutorias ?? d.anioInicioTutorias,
    universidad_graduacion: d.universidad_graduacion ?? d.universidadGraduacion,
    especialidad: Array.isArray(d.especialidad)
      ? d.especialidad
      : Array.isArray(d.subjects)
        ? d.subjects.map((materia) => materia.nombre)
        : (d.especialidad ?? []),
  };
}

export async function obtenerPerfil(rol) {
  if (rol === "tutor") {
    const response = await apiFetch("/tutor/profile");
    return { ...response, data: normalizarPerfilTutor(response?.data) };
  }
  return apiFetch("/estudiante/profile");
}

export async function actualizarPerfil(rol, datos) {
  if (rol === "tutor") {
    const payload = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      fechaNacimiento: datos.fecha_nacimiento,
      genero: datos.genero,
      direccion: datos.direccion,
      telefono: datos.telefono,
      fotoUrl: datos.foto_url,
      direccionTutoria: datos.direccion_tutoria,
      anioInicioTutorias: datos.anio_inicio_tutorias,
      universidadGraduacion: datos.universidad_graduacion,
      especialidad: datos.especialidad,
    };

    if (datos.password_nueva) payload.password = datos.password_nueva;

    const response = await apiFetch("/tutor/profile", { method: "PATCH", body: payload });
    return { ...response, data: normalizarPerfilTutor(response?.data) };
  }

  const payload = {
    nombre: datos.nombre,
    apellido: datos.apellido,
    genero: datos.genero,
    direccion: datos.direccion,
    telefono: datos.telefono,
    fecha_nacimiento: datos.fecha_nacimiento,
    ...(datos.foto_url ? { foto_url: datos.foto_url } : {}),
  };

  if (datos.password_nueva) {
    payload.password_actual = datos.password_actual;
    payload.password_nueva = datos.password_nueva;
  }

  return apiFetch("/student/profile", { method: "PUT", body: payload });
}
