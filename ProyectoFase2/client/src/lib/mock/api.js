// Implementación simulada de los endpoints de la Fase 2. No hace ninguna llamada de red.
// Cada función devuelve la misma forma que devolverá el backend real, para poder cambiar
// de mock a backend sin tocar las pantallas.
import { ApiError } from "../api/client";
import { PLATAFORMA, ESTUDIANTE_ACTUAL_ID, TUTOR_ACTUAL_ID } from "./config";
import { db, estudiantePorId, persistir, respuesta, tutorPorId } from "./db";
import {
  CATEGORIAS_REPORTE_ESTUDIANTE,
  CATEGORIAS_REPORTE_TUTOR,
  esSesionAtendida,
} from "../evaluaciones";

function buscarSesion(id) {
  const sesion = db().sesiones.find((s) => String(s.id) === String(id));
  if (!sesion) throw new ApiError("No encontramos la sesión.", 404);
  return sesion;
}

function porFechaDesc(a, b) {
  return `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`);
}

function vistaParaEstudiante(s) {
  const e = s.eval.estudiante;
  return {
    id: s.id,
    materia: s.materia,
    fecha: s.fecha,
    hora: s.hora,
    direccion: s.direccion,
    motivo: s.motivo,
    estado: s.estado,
    resumen: s.resumen,
    tutor: tutorPorId(s.tutorId).nombre,
    calificacion: e.calificacion,
    reportada: e.reportada,
  };
}

function vistaParaTutor(s) {
  const e = s.eval.tutor;
  return {
    id: s.id,
    materia: s.materia,
    fecha: s.fecha,
    hora: s.hora,
    direccion: s.direccion,
    motivo: s.motivo,
    estado: s.estado,
    resumen: s.resumen,
    estudiante: estudiantePorId(s.estudianteId).nombre,
    calificacion: e.calificacion,
    reportada: e.reportada,
  };
}

// ---------- Estudiante ----------
export function listarActivasEstudiante() {
  const data = db()
    .sesiones.filter((s) => s.estudianteId === ESTUDIANTE_ACTUAL_ID && s.estado === "activa")
    .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
    .map(vistaParaEstudiante);
  return respuesta({ data });
}

export function listarHistorialEstudiante() {
  const data = db()
    .sesiones.filter((s) => s.estudianteId === ESTUDIANTE_ACTUAL_ID && s.estado !== "activa")
    .sort(porFechaDesc)
    .map(vistaParaEstudiante);
  return respuesta({ data });
}

export function cancelarComoEstudiante(id) {
  const sesion = buscarSesion(id);
  sesion.estado = "cancelada_estudiante";
  persistir();
  return respuesta({ message: "Sesión cancelada." });
}

// HU-031: plan de estudio del estudiante (una entrada por sesión atendida con plan).
export function listarPlanes() {
  const planes = db()
    .sesiones.filter((s) => s.estudianteId === ESTUDIANTE_ACTUAL_ID && esSesionAtendida(s) && s.plan)
    .sort(porFechaDesc)
    .map((s) => {
      const tutor = tutorPorId(s.tutorId);
      return {
        id: s.id,
        idSesion: s.id,
        fecha: s.fecha,
        materia: s.materia,
        tutorNombre: tutor.nombre,
        especialidad: tutor.especialidad,
        identificacion: tutor.identificacion,
        estudianteNombre: estudiantePorId(s.estudianteId).nombre,
        dificultades: s.plan.dificultades,
        recursos: s.plan.recursos,
      };
    });
  return respuesta(planes);
}

// ---------- Tutor ----------
export function listarPendientesTutor() {
  const data = db()
    .sesiones.filter((s) => s.tutorId === TUTOR_ACTUAL_ID && s.estado === "activa")
    .map(vistaParaTutor);
  return respuesta({ data });
}

export function listarHistorialTutor({ page = 1, pageSize = 20 } = {}) {
  const todas = db()
    .sesiones.filter((s) => s.tutorId === TUTOR_ACTUAL_ID && s.estado !== "activa")
    .sort(porFechaDesc)
    .map(vistaParaTutor);
  const inicio = (page - 1) * pageSize;
  return respuesta({ data: todas.slice(inicio, inicio + pageSize) });
}

export function detalleSesionTutor(id) {
  const sesion = buscarSesion(id);
  return respuesta({
    data: { materia: sesion.materia, plan: sesion.plan },
  });
}

// HU-035: atender una sesión registra el plan de estudio.
export function atender(id, { dificultades, recursos }) {
  const sesion = buscarSesion(id);
  if (sesion.estado !== "activa") {
    throw new ApiError("Solo se pueden atender sesiones activas.", 409);
  }
  const datos = db();
  sesion.estado = "atendida";
  sesion.resumen = "Sesión atendida por el tutor.";
  sesion.plan = {
    dificultades,
    recursos: recursos.map((r) => ({
      id: datos.siguienteIdRecurso++,
      nombre: r.nombre,
      tipo: r.tipo,
      descripcion: r.descripcion,
      recursoUrl: r.url || r.contenido || r.archivo || "",
    })),
  };
  persistir();
  return respuesta({ message: "Sesión atendida." });
}

export function cancelarComoTutor(id) {
  const sesion = buscarSesion(id);
  sesion.estado = "cancelada_tutor";
  persistir();
  return respuesta({ message: "Sesión cancelada.", emailSent: true });
}

// ---------- Calificaciones y reportes (HU-033, HU-034, HU-036, HU-037) ----------
// rol = quien evalúa. "estudiante" evalúa al tutor; "tutor" evalúa al estudiante.
export function calificar(rol, id, { estrellas, comentario }) {
  const sesion = buscarSesion(id);
  if (!esSesionAtendida(sesion)) {
    throw new ApiError("Solo puedes calificar sesiones atendidas.", 409);
  }
  const evaluacion = sesion.eval[rol];
  if (evaluacion.calificacion) {
    throw new ApiError("Ya calificaste esta sesión.", 409);
  }
  evaluacion.calificacion = { estrellas, comentario: comentario || "" };
  persistir();
  return respuesta({ message: "Calificación registrada." });
}

export function reportar(rol, id, { categoria, descripcion }) {
  const sesion = buscarSesion(id);
  if (!esSesionAtendida(sesion)) {
    throw new ApiError("Solo puedes reportar sesiones atendidas.", 409);
  }
  const evaluacion = sesion.eval[rol];
  if (evaluacion.reportada) {
    throw new ApiError("Ya enviaste un reporte de esta sesión.", 409);
  }

  const datos = db();
  const esEstudiante = rol === "estudiante";
  const categorias = esEstudiante ? CATEGORIAS_REPORTE_TUTOR : CATEGORIAS_REPORTE_ESTUDIANTE;
  const etiqueta = categorias.find((c) => c.valor === categoria)?.etiqueta ?? categoria;

  datos.denuncias.unshift({
    id: datos.siguienteIdDenuncia++,
    tipo: esEstudiante ? "tutores" : "estudiantes",
    idSesion: sesion.id,
    categoria: etiqueta,
    motivo: descripcion,
    denunciado_nombre: esEstudiante
      ? tutorPorId(sesion.tutorId).nombre
      : estudiantePorId(sesion.estudianteId).nombre,
    denunciante_nombre: esEstudiante
      ? estudiantePorId(sesion.estudianteId).nombre
      : tutorPorId(sesion.tutorId).nombre,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  });
  evaluacion.reportada = true;
  persistir();
  return respuesta({ message: "Reporte enviado." });
}

// ---------- Administrador ----------
export function listarDenunciasAdmin(tipo = "tutores") {
  return respuesta({ data: db().denuncias.filter((d) => d.tipo === tipo) });
}

export function resolverDenunciaAdmin(id, accion) {
  const denuncia = db().denuncias.find((d) => String(d.id) === String(id));
  if (!denuncia) throw new ApiError("No encontramos la denuncia.", 404);
  denuncia.estado = accion === "dar_de_baja" ? "sancionado" : "descartado";
  persistir();
  return respuesta({ message: "Denuncia resuelta." });
}

export { PLATAFORMA };
