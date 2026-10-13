export const MIN_ESTRELLAS = 0;
export const MAX_ESTRELLAS = 5;
export const MAX_COMENTARIO = 500;
export const MIN_DESCRIPCION_REPORTE = 20;
export const MAX_DESCRIPCION_REPORTE = 1000;

// `valor` es exactamente lo que valida el backend (si no coincide responde 400).
export const CATEGORIAS_REPORTE_TUTOR = [
  { valor: "Ética y profesionalismo", etiqueta: "Ética y profesionalismo" },
  { valor: "Negligencia académica", etiqueta: "Negligencia académica" },
  { valor: "Abuso o conducta inapropiada", etiqueta: "Abuso o Conducta inapropiada" },
  { valor: "Falsificación de información", etiqueta: "Falsificación de información" },
  { valor: "Acoso o intimidación", etiqueta: "Acoso o intimidación" },
  { valor: "Discriminación", etiqueta: "Discriminación" },
  { valor: "Incumplimiento de horarios", etiqueta: "Incumplimiento de horarios" },
  { valor: "Incumplimiento de responsabilidades", etiqueta: "Incumplimiento de responsabilidades" },
  { valor: "Divulgación de información confidencial", etiqueta: "Divulgación de información confidencial" },
  { valor: "Cobros indebidos", etiqueta: "Cobros indebidos" },
];

// Tutor -> estudiante (tutor.controller: CATEGORIAS_REPORTE_VALIDAS).
export const CATEGORIAS_REPORTE_ESTUDIANTE = [
  { valor: "Conducta inapropiada", etiqueta: "Conducta inapropiada" },
  { valor: "Falsificacion de documentos", etiqueta: "Falsificación de documentos" },
  { valor: "Agresion verbal o fisica", etiqueta: "Agresión verbal o física" },
  { valor: "Robo o dano a instalaciones", etiqueta: "Robo o daño a instalaciones" },
  { valor: "Plagio_Copia", etiqueta: "Plagio o copia" },
  { valor: "Inasistencia_Injustificada", etiqueta: "Inasistencia injustificada" },
  { valor: "Incumplimiento_Acuerdos", etiqueta: "Incumplimiento de acuerdos" },
  { valor: "Acoso_Bullying", etiqueta: "Acoso / Bullying" },
  { valor: "Portacion Objetos Peligrosos", etiqueta: "Portación de objetos peligrosos" },
  { valor: "Uso Indebido de la Tecnologia", etiqueta: "Uso indebido de la tecnología" },
];

// Convierte lo que devuelve el backend ("Plagio_Copia") en una opción del select.
export function categoriaDesdeBackend(valor) {
  const conocida = [...CATEGORIAS_REPORTE_TUTOR, ...CATEGORIAS_REPORTE_ESTUDIANTE].find((c) => c.valor === valor);
  return conocida ?? { valor, etiqueta: String(valor).replaceAll("_", " ") };
}

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
