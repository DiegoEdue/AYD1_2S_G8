// Base de datos simulada (solo front). Vive en memoria y se respalda en localStorage para
// que sobreviva a recargas y se pueda seguir un flujo entre roles (tutor -> estudiante -> admin).
const CLAVE = "educonnect_mock_db_v1";
let memoria = null;

const TUTORES = {
  1: { id: 1, nombre: "Carlos Mendoza", especialidad: "Matemática, Física", identificacion: "TUT-2020-04587" },
  2: { id: 2, nombre: "María Fernanda López", especialidad: "Química, Biología", identificacion: "TUT-2021-01932" },
};

const ESTUDIANTES = {
  1: { id: 1, nombre: "Ana Lucía Morales" },
  2: { id: 2, nombre: "Diego Ramírez" },
};

function recurso(id, nombre, tipo, descripcion, recursoUrl = "") {
  return { id, nombre, tipo, descripcion, recursoUrl };
}

const sinEval = () => ({
  estudiante: { calificacion: null, reportada: false },
  tutor: { calificacion: null, reportada: false },
});

function semilla() {
  const sesiones = [
    {
      id: 1, materia: "Cálculo Diferencial", fecha: "2026-09-28", hora: "10:00", direccion: "Online", motivo: "Dudas con derivadas e ideas de límite.",
      estado: "atendida", tutorId: 1, estudianteId: 1, resumen: "Se repasaron límites y la regla de la cadena.",
      plan: {
        dificultades: "Confunde la regla de la cadena con la del producto.\nLe cuesta identificar cuándo aplicar límites laterales.",
        recursos: [
          recurso(1, "Guía de derivadas", "Texto", "Resuelve los 10 ejercicios antes de la próxima sesión.", "Practicar primero los ejercicios 1 al 5 y luego los compuestos."),
          recurso(2, "Regla de la cadena explicada", "Video", "Míralo completo y pausa en cada ejemplo.", "https://www.youtube.com/watch?v=H-ybCx8gt-8"),
          recurso(3, "Apuntes de límites", "PDF", "Úsalo como repaso rápido antes de los parciales.", ""),
        ],
      },
      eval: sinEval(),
    },
    {
      id: 2, materia: "Física 1", fecha: "2026-09-21", hora: "15:30", direccion: "Biblioteca central, cubículo 4", motivo: "Cinemática y movimiento parabólico.",
      estado: "atendida", tutorId: 1, estudianteId: 1, resumen: "Se resolvieron problemas de tiro parabólico.",
      plan: {
        dificultades: "Despeja mal las componentes del vector velocidad.",
        recursos: [
          recurso(4, "Simulador de proyectiles (PhET)", "Enlace", "Experimenta con distintos ángulos y velocidades.", "https://phet.colorado.edu/es/simulations/projectile-motion"),
          recurso(5, "Formulario de cinemática", "Texto", "Imprímelo y úsalo en tus ejercicios.", "v = v0 + a·t\nx = x0 + v0·t + ½·a·t²"),
        ],
      },
      eval: {
        estudiante: { calificacion: { estrellas: 4, comentario: "Muy claro explicando." }, reportada: false },
        tutor: { calificacion: null, reportada: false },
      },
    },
    {
      id: 3, materia: "Química General", fecha: "2026-09-14", hora: "09:00", direccion: "Online", motivo: "Balanceo de ecuaciones.",
      estado: "atendida", tutorId: 2, estudianteId: 1, resumen: "Balanceo por tanteo y método algebraico.",
      plan: {
        dificultades: "No identifica los coeficientes al balancear con el método algebraico.",
        recursos: [recurso(6, "Tabla periódica interactiva", "Enlace", "Consulta masas atómicas al balancear.", "https://ptable.com/?lang=es")],
      },
      eval: {
        estudiante: { calificacion: null, reportada: true },
        tutor: { calificacion: null, reportada: false },
      },
    },
    {
      id: 4, materia: "Álgebra Lineal", fecha: "2026-09-10", hora: "11:00", direccion: "Online", motivo: "Matrices y determinantes.",
      estado: "cancelada_tutor", tutorId: 1, estudianteId: 1, plan: null, eval: sinEval(),
    },
    {
      id: 5, materia: "Cálculo Integral", fecha: "2026-10-15", hora: "14:00", direccion: "Online", motivo: "Integrales por sustitución.",
      estado: "activa", tutorId: 1, estudianteId: 1, plan: null, eval: sinEval(),
    },
    {
      id: 6, materia: "Estadística", fecha: "2026-09-30", hora: "16:00", direccion: "Edificio T-3, salón 201", motivo: "Distribución normal.",
      estado: "atendida", tutorId: 1, estudianteId: 2, resumen: "Se trabajó con tablas Z y probabilidades.",
      plan: {
        dificultades: "Interpreta mal el área bajo la curva.\nOlvida estandarizar antes de usar la tabla.",
        recursos: [recurso(7, "Calculadora de la normal", "Enlace", "Verifica tus resultados de tarea.", "https://onlinestatbook.com/2/calculators/normal_dist.html")],
      },
      eval: sinEval(),
    },
    {
      id: 7, materia: "Física 2", fecha: "2026-10-17", hora: "10:30", direccion: "Online", motivo: "Ley de Coulomb.",
      estado: "activa", tutorId: 1, estudianteId: 2, plan: null, eval: sinEval(),
    },
    {
      id: 8, materia: "Programación 1", fecha: "2026-09-18", hora: "13:00", direccion: "Online", motivo: "Ciclos y arreglos.",
      estado: "atendida", tutorId: 1, estudianteId: 2, resumen: "Ejercicios con for y while.",
      plan: {
        dificultades: "Errores de índice fuera de rango en arreglos.",
        recursos: [recurso(8, "Guía de arreglos", "Texto", "Haz los ejercicios 3 y 4.", "Recuerda que el último índice es longitud - 1.")],
      },
      eval: {
        estudiante: { calificacion: null, reportada: false },
        tutor: { calificacion: { estrellas: 5, comentario: "Muy participativo." }, reportada: false },
      },
    },
    {
      id: 9, materia: "Biología Celular", fecha: "2026-10-20", hora: "08:30", direccion: "Online", motivo: "Mitosis y meiosis.",
      estado: "activa", tutorId: 2, estudianteId: 1, plan: null, eval: sinEval(),
    },
  ];

  const denuncias = [
    {
      id: 1, tipo: "tutores", idSesion: 3, categoria: "Negligencia académica",
      motivo: "El tutor llegó 30 minutos tarde y no preparó el material de la sesión.",
      denunciado_nombre: "María Fernanda López", denunciante_nombre: "Ana Lucía Morales",
      fecha: "2026-09-15T10:00:00Z", estado: "pendiente",
    },
    {
      id: 2, tipo: "estudiantes", idSesion: 8, categoria: "Conducta inapropiada",
      motivo: "El estudiante usó lenguaje ofensivo durante la sesión y se negó a seguir indicaciones.",
      denunciado_nombre: "Diego Ramírez", denunciante_nombre: "Carlos Mendoza",
      fecha: "2026-09-19T09:30:00Z", estado: "pendiente",
    },
  ];

  return { sesiones, denuncias, siguienteIdDenuncia: 3, siguienteIdRecurso: 100 };
}

function leerAlmacenamiento() {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.localStorage.getItem(CLAVE);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

export function persistir() {
  if (typeof window === "undefined" || !memoria) return;
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(memoria));
  } catch {
    // Si el almacenamiento está lleno o bloqueado, el modo demo sigue funcionando en memoria.
  }
}

export function db() {
  if (!memoria) {
    memoria = leerAlmacenamiento() ?? semilla();
    persistir();
  }
  return memoria;
}

export function reiniciarDb() {
  memoria = semilla();
  persistir();
  return memoria;
}

export function tutorPorId(id) {
  return TUTORES[id];
}

export function estudiantePorId(id) {
  return ESTUDIANTES[id];
}

// Simula la latencia de red para que se vean los estados de "cargando".
export function respuesta(valor, ms = 250) {
  const copia = valor === undefined ? undefined : JSON.parse(JSON.stringify(valor));
  return new Promise((resolver) => setTimeout(() => resolver(copia), ms));
}
