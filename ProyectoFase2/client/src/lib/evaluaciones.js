export const MIN_ESTRELLAS = 0;
export const MAX_ESTRELLAS = 5;
export const MAX_COMENTARIO = 500;
export const MIN_DESCRIPCION_REPORTE = 20;
export const MAX_DESCRIPCION_REPORTE = 1000;

export const CATEGORIAS_REPORTE_TUTOR = [
  { valor: "etica_profesionalismo", etiqueta: "Ética y profesionalismo" },
  { valor: "negligencia_academica", etiqueta: "Negligencia académica" },
  { valor: "abuso_conducta_inapropiada", etiqueta: "Abuso / Conducta inapropiada" },
  { valor: "falsificacion", etiqueta: "Falsificación" },
  { valor: "otro", etiqueta: "Otro" },
];

export const CATEGORIAS_REPORTE_ESTUDIANTE = [
  { valor: "conducta_inapropiada", etiqueta: "Conducta inapropiada" },
  { valor: "falsificacion_documentos", etiqueta: "Falsificación de documentos" },
  { valor: "agresion", etiqueta: "Agresión verbal / física" },
  { valor: "robo_dano", etiqueta: "Robo o daño a instalaciones" },
  { valor: "otro", etiqueta: "Otro" },
];

function normalizarEstado(estado = "") {
  return String(estado).trim().toLowerCase().replaceAll("_", "-");
}

// Solo las sesiones atendidas se pueden calificar o reportar (no activas, pendientes ni canceladas).
export function esSesionAtendida(sesion) {
  const estado = normalizarEstado(sesion?.estado);
  return estado === "atendida" || estado === "atendido";
}

// Una sesión atendida se califica una sola vez.
export function puedeCalificar(sesion) {
  return esSesionAtendida(sesion) && !sesion?.calificacion;
}

export function puedeReportar(sesion) {
  return esSesionAtendida(sesion) && !sesion?.reportada;
}

export function validarCalificacion({ estrellas, comentario }, { comentarioObligatorio = false } = {}) {
  const errores = {};

  const valida =
    Number.isInteger(estrellas) && estrellas >= MIN_ESTRELLAS && estrellas <= MAX_ESTRELLAS;
  if (!valida) errores.estrellas = "Elige una puntuación de 0 a 5 estrellas.";

  const texto = String(comentario ?? "").trim();
  if (comentarioObligatorio && !texto) {
    errores.comentario = "Escribe un comentario explicando tu evaluación.";
  } else if (texto.length > MAX_COMENTARIO) {
    errores.comentario = `El comentario no puede superar ${MAX_COMENTARIO} caracteres.`;
  }

  return { valido: Object.keys(errores).length === 0, errores };
}

export function validarReporte({ categoria, descripcion }, categorias = []) {
  const errores = {};

  if (!categorias.some((c) => c.valor === categoria)) {
    errores.categoria = "Elige una categoría.";
  }

  const texto = String(descripcion ?? "").trim();
  if (!texto) {
    errores.descripcion = "Describe lo ocurrido para que la administración pueda revisarlo.";
  } else if (texto.length < MIN_DESCRIPCION_REPORTE) {
    errores.descripcion = `Explica con más detalle (mínimo ${MIN_DESCRIPCION_REPORTE} caracteres).`;
  } else if (texto.length > MAX_DESCRIPCION_REPORTE) {
    errores.descripcion = `La descripción no puede superar ${MAX_DESCRIPCION_REPORTE} caracteres.`;
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
