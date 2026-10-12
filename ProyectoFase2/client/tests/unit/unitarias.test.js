
//   1) Validación de la calificación por estrellas
//   2) Validación del formulario de reporte (categoría y longitud mínima)
//   3) Reglas de negocio: solo sesiones atendidas y una sola calificación
//   4) Validación del plan de estudio que registra el tutor
//   5) Generación de la constancia PDF (encabezado, tabla y firma del tutor)
import { describe, it, expect } from "vitest";
import {
  CATEGORIAS_REPORTE_TUTOR,
  MIN_DESCRIPCION_REPORTE,
  puedeCalificar,
  puedeReportar,
  validarCalificacion,
  validarReporte,
} from "../../src/lib/evaluaciones";
import { validarPlanEstudio } from "../../src/lib/api/plan-estudio";
import { construirConstanciaPdf } from "../../src/lib/pdf/constancia";

describe("Pruebas unitarias del front - Estudiante y Tutor", () => {
  it("1. calificación: acepta de 0 a 5 estrellas y rechaza vacío, decimales o fuera de rango", () => {
    expect(validarCalificacion({ estrellas: 0, comentario: "" }).valido).toBe(true); // 0 es válido
    expect(validarCalificacion({ estrellas: 5, comentario: "" }).valido).toBe(true);
    for (const invalida of [null, undefined, -1, 6, 3.5]) {
      const r = validarCalificacion({ estrellas: invalida, comentario: "" });
      expect(r.valido).toBe(false);
      expect(r.errores.estrellas).toBeDefined();
    }
    // El comentario es opcional para el estudiante pero obligatorio para el tutor.
    expect(validarCalificacion({ estrellas: 4, comentario: "  " }).valido).toBe(true);
    expect(validarCalificacion({ estrellas: 4, comentario: "  " }, { comentarioObligatorio: true }).errores.comentario).toBeDefined();
  });

  it("2. reporte: exige categoría válida y una descripción con longitud mínima", () => {
    const larga = "x".repeat(MIN_DESCRIPCION_REPORTE);
    const categoria = CATEGORIAS_REPORTE_TUTOR[0].valor;

    expect(validarReporte({ categoria, descripcion: larga }, CATEGORIAS_REPORTE_TUTOR).valido).toBe(true);
    expect(validarReporte({ categoria: "", descripcion: larga }, CATEGORIAS_REPORTE_TUTOR).errores.categoria).toBeDefined();
    expect(validarReporte({ categoria: "inventada", descripcion: larga }, CATEGORIAS_REPORTE_TUTOR).errores.categoria).toBeDefined();
    expect(validarReporte({ categoria, descripcion: "corto" }, CATEGORIAS_REPORTE_TUTOR).errores.descripcion).toBeDefined();
    expect(validarReporte({ categoria, descripcion: "   " }, CATEGORIAS_REPORTE_TUTOR).errores.descripcion).toBeDefined();
  });

  it("3. reglas de negocio: solo se califica/reporta una sesión atendida y una única vez", () => {
    const atendida = { estado: "atendida", calificacion: null, reportada: false };
    expect(puedeCalificar(atendida)).toBe(true);
    expect(puedeReportar(atendida)).toBe(true);

    // Activas, pendientes y canceladas no se pueden evaluar.
    for (const estado of ["activa", "pendiente", "cancelada_tutor", "cancelada-estudiante"]) {
      expect(puedeCalificar({ ...atendida, estado })).toBe(false);
      expect(puedeReportar({ ...atendida, estado })).toBe(false);
    }

    // Una vez calificada o reportada, no se repite.
    expect(puedeCalificar({ ...atendida, calificacion: { estrellas: 4 } })).toBe(false);
    expect(puedeReportar({ ...atendida, reportada: true })).toBe(false);
  });

  it("4. plan de estudio: requiere dificultades y al menos un recurso completo", () => {
    expect(validarPlanEstudio({ dificultades: "", recursos: [] }).valido).toBe(false);

    const sinRecursos = validarPlanEstudio({ dificultades: "Límites", recursos: [] });
    expect(sinRecursos.errores.recursos).toBeDefined();

    const incompleto = validarPlanEstudio({
      dificultades: "Límites",
      recursos: [{ id: 1, nombre: "", tipo: "", descripcion: "" }],
    });
    expect(Object.keys(incompleto.errores.recursosDetalle[1])).toEqual(["nombre", "tipo", "descripcion"]);

    const valido = validarPlanEstudio({
      dificultades: "Límites",
      recursos: [{ id: 1, nombre: "Guía", tipo: "Texto", descripcion: "Resolver los ejercicios" }],
    });
    expect(valido.valido).toBe(true);
  });

  it("5. constancia PDF: genera un PDF válido con encabezado, tabla de recursos y firma del tutor", () => {
    const plan = {
      tutorNombre: "Carlos Mendoza",
      especialidad: "Matemática, Física",
      identificacion: "TUT-2020-04587",
      fecha: "2026-09-28",
      dificultades: "Confunde la regla de la cadena.",
      recursos: [{ nombre: "Guía de derivadas", tipo: "Texto", descripcion: "Resolver 10 ejercicios" }],
    };
    const bytes = construirConstanciaPdf(plan, {
      nombrePlataforma: "EduConnect",
      telefono: "+502 2418-9000",
      fechaEmision: new Date(2026, 9, 9),
    });
    const texto = Buffer.from(bytes).toString("latin1");

    expect(texto.startsWith("%PDF-1.4")).toBe(true);
    expect(texto.trimEnd().endsWith("%%EOF")).toBe(true);
    // Encabezado
    expect(texto).toContain("EduConnect");
    expect(texto).toContain("Fecha de emisi");
    expect(texto).toContain("+502 2418-9000");
    // Cuerpo
    expect(texto).toContain("Guía de derivadas".replace("í", "\xed"));
    expect(texto).toContain("Descripci");
    // Pie: firma digital emulada del tutor
    expect(texto).toContain("Firma digital del tutor");
    expect(texto).toContain("Carlos Mendoza");
    expect(texto).toContain("TUT-2020-04587");
  });
});
