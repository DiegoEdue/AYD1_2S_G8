import { apiFetch, apiFetchBlob } from "./client";
import { TIPOS_RECURSO } from "./tipos-recurso";

// GET /student/study-plans  (HU-031)
export function normalizarPlan(fila) {
  const tutor = fila?.tutor ?? {};
  const especialidades = Array.isArray(tutor.especialidades) ? tutor.especialidades : [];
  return {
    id: fila.idPlan,
    idSesion: fila.idSesion,
    fecha: fila.fechaUltimaSesion,
    tutorNombre: tutor.nombreCompleto,
    especialidad: especialidades.join(", "),
    identificacion: tutor.numeroIdentificacion,
    dificultades: fila.dificultadesIdentificadas ?? [],
    recursos: (fila.recursosRecomendados ?? []).map(normalizarRecurso),
  };
}

export async function listarPlanesEstudio() {
  const response = await apiFetch("/student/study-plans");
  const filas = Array.isArray(response?.data) ? response.data : [];
  return filas.map(normalizarPlan);
}

function guardarBlob(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// HU-032: constancia del plan de estudio en PDF.
// GET /student/study-plans/:id/pdf  (la plantilla oficial la arma el servidor).
export async function descargarPlanPdf(planOId) {
  // Acepta el plan completo o solo su id (así sirve con cualquier versión de la pantalla).
  const idPlan = planOId && typeof planOId === "object" ? planOId.id : planOId;
  guardarBlob(await apiFetchBlob(`/student/study-plans/${idPlan}/pdf`), `educonnect-plan-${idPlan}.pdf`);
}

export function recursoVacio(id) {
  return { id, nombre: "", tipo: "", descripcion: "", recursoUrl: "" };
}

export function validarPlanEstudio({ dificultades, recursos }) {
  const errores = {};

  if (!String(dificultades ?? "").trim()) {
    errores.dificultades = "Describe al menos una dificultad identificada.";
  }

  if (recursos.length === 0) {
    errores.recursos = "Agrega al menos un recurso recomendado.";
  } else {
    const detalle = {};
    for (const recurso of recursos) {
      const e = {};
      if (!recurso.nombre.trim()) e.nombre = "Escribe el nombre del recurso.";
      if (!TIPOS_RECURSO.some((tipo) => tipo.valor === recurso.tipo)) e.tipo = "Elige un tipo de recurso.";
      if (!recurso.descripcion.trim()) e.descripcion = "Explica cómo usar este recurso.";
      if (Object.keys(e).length > 0) detalle[recurso.id] = e;
    }
    if (Object.keys(detalle).length > 0) errores.recursosDetalle = detalle;
  }

  return { valido: Object.keys(errores).length === 0, errores };
}

function archivoABase64(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export async function armarPayloadPlan({ dificultades, recursos }) {
  const recursosFormateados = await Promise.all(
    recursos.map(async (r) => {
      let archivoBase64 = null;
      if (r.archivo instanceof File) {
        archivoBase64 = await archivoABase64(r.archivo);
      }

      return {
        nombre: r.nombre,
        tipo: r.tipo,
        descripcion: r.descripcion,
        url: r.url || "",
        contenido: r.contenido || "",
        archivo: archivoBase64,
      };
    })
  );

  return {
    dificultades: dificultades,
    dificultad: dificultades,
    recursos: recursosFormateados,
  };
}

export function normalizarDificultades(entrada) {
  const lista = Array.isArray(entrada) ? entrada : entrada ? [entrada] : [];
  const textos = lista.flatMap((item) => {
    const texto = typeof item === "string" ? item : (item?.descripcion ?? item?.texto ?? "");
    return String(texto)
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter(Boolean);
  });
  return textos.map((texto, indice) => ({ id: String(indice), texto }));
}

export function normalizarRecurso(bruto) {
  const r = bruto ?? {};
  return {
    id: r.id ?? r.id_recurso ?? null,
    nombre: r.nombre ?? r.name ?? "",
    tipo: r.tipo ?? r.type ?? "",
    descripcion: r.descripcionUso ?? r.descripcion_uso ?? r.descripcion ?? r.description ?? "",
    recursoUrl: r.recursoUrl ?? r.url_recurso ?? r.url ?? "",
  };
}
