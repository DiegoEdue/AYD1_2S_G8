/// <reference types="cypress" />
// HU-048 · Pruebas E2E del Sprint 4 con Cypress (front con datos simulados).
//
//   1) HU-035 → HU-031/032  Atención de la sesión, registro del plan de estudio y descarga de la constancia PDF
//   2) HU-033 / HU-034      El estudiante califica y reporta al tutor; el reporte llega al administrador
//   3) HU-036 / HU-037      El tutor califica y reporta al estudiante; el reporte llega al administrador
//   4) HU-033 / HU-034 / HU-036 / HU-037  Reglas: solo sesiones atendidas y una sola calificación

const REPORTE_LARGO =
  "El tutor no preparó el material acordado y la sesión no cumplió los objetivos planteados.";

describe("Pruebas E2E - Módulo estudiante y tutor", () => {
  it("1. Atención de sesión con plan de estudio y descarga de constancia PDF", () => {
    // Tutor: atiende la sesión y registra el plan de estudio.
    cy.entrarComo("tutor");
    cy.location("pathname").should("eq", "/tutor/sesiones/pendientes");
    cy.tarjetaDeSesion("Cálculo Integral").contains("button", "Marcar atendida").click();

    cy.get('[role="dialog"]').within(() => {
      cy.get("#dificultades").type("Sustitución en integrales\nCambio de límites");
      cy.contains("button", "Agregar recurso").click();
      cy.get("#recurso-1-nombre").type("Guía de sustitución");
      cy.get("#recurso-1-tipo").select("Texto");
      cy.get("#recurso-1-valor").type("Resuelve los ejercicios 1 al 6.");
      cy.get("#recurso-1-descripcion").type("Practícalo antes de la próxima sesión.");
      cy.contains("button", "Guardar y atender").click();
    });
    cy.contains("Cálculo Integral").should("not.exist");

    // Estudiante: ve el plan registrado y descarga la constancia.
    cy.entrarComo("estudiante");
    cy.location("pathname").should("eq", "/estudiante/plan-estudio");
    cy.contains("Cálculo Integral").should("be.visible");
    cy.contains("Sustitución en integrales").should("be.visible");
    cy.contains("Guía de sustitución").should("be.visible");

    cy.contains("button", /Descargar constancia/i).first().click();
    cy.readFile("cypress/downloads/educonnect-plan-5.pdf", "latin1", { timeout: 10000 })
      .should("contain", "%PDF-1.4")
      .and("contain", "EduConnect")
      .and("contain", "Firma digital del tutor")
      .and("contain", "Carlos Mendoza")
      .and("contain", "Guía de sustitución".replace("í", "\xed"));
  });

  it("2. El estudiante califica y reporta al tutor y el reporte llega al administrador", () => {
    cy.entrarComo("estudiante");
    cy.irAlMenu("Historial");

    // Calificar: la puntuación es obligatoria y el comentario es opcional.
    cy.tarjetaDeSesion("Cálculo Diferencial").contains("button", "Calificar tutor").click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("button", "Enviar calificación").click();
      cy.contains("Elige una puntuación de 0 a 5 estrellas.").should("be.visible");
      cy.get('[role="radio"][aria-label="4 estrellas"]').click();
      cy.contains("button", "Enviar calificación").click();
    });
    cy.tarjetaDeSesion("Cálculo Diferencial").should("contain", "Tu calificación");

    // Reportar: categoría obligatoria y descripción con longitud mínima.
    cy.tarjetaDeSesion("Cálculo Diferencial").contains("button", "Reportar tutor").click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("button", "Enviar reporte").click();
      cy.contains("Elige una categoría.").should("be.visible");
      cy.get("#categoria").select("Negligencia académica");
      cy.get("#descripcion").type("Muy corto");
      cy.contains("button", "Enviar reporte").click();
      cy.contains("Explica con más detalle").should("be.visible");
      cy.get("#descripcion").clear().type(REPORTE_LARGO);
      cy.contains("button", "Enviar reporte").click();
    });
    cy.tarjetaDeSesion("Cálculo Diferencial").should("contain", "Reporte enviado");

    // Administrador: recibe la denuncia contra el tutor.
    cy.entrarComo("admin");
    cy.location("pathname").should("eq", "/admin/denuncias");
    cy.contains("tr", "Carlos Mendoza").within(() => {
      cy.contains("Negligencia académica");
      cy.contains("Ana Lucía Morales");
      cy.contains("Pendiente");
    });
  });

  it("3. El tutor califica y reporta al estudiante y el reporte llega al administrador", () => {
    cy.entrarComo("tutor");
    cy.irAlMenu("Historial");

    // Calificar: aquí el comentario es obligatorio.
    cy.tarjetaDeSesion("Estadística").contains("button", "Calificar estudiante").click();
    cy.get('[role="dialog"]').within(() => {
      cy.get('[role="radio"][aria-label="3 estrellas"]').click();
      cy.contains("button", "Enviar calificación").click();
      cy.contains("Escribe un comentario explicando tu evaluación.").should("be.visible");
      cy.get("#comentario").type("Llegó sin preparar la tarea, pero mejoró durante la sesión.");
      cy.contains("button", "Enviar calificación").click();
    });
    cy.tarjetaDeSesion("Estadística").should("contain", "Tu calificación");

    // Reportar al estudiante.
    cy.tarjetaDeSesion("Estadística").contains("button", "Reportar estudiante").click();
    cy.get('[role="dialog"]').within(() => {
      cy.get("#categoria").select("Agresión verbal / física");
      cy.get("#descripcion").type("Levantó la voz y faltó el respeto de forma reiterada durante la tutoría.");
      cy.contains("button", "Enviar reporte").click();
    });
    cy.tarjetaDeSesion("Estadística").should("contain", "Reporte enviado");

    // Administrador: la denuncia aparece en la pestaña de estudiantes.
    cy.entrarComo("admin");
    cy.contains("button", "Denuncias contra Estudiantes").click();
    cy.contains("tr", "Agresión verbal / física").within(() => {
      cy.contains("Diego Ramírez");
      cy.contains("Carlos Mendoza");
    });
  });

  it("4. Reglas de negocio: solo sesiones atendidas y una única calificación por sesión", () => {
    cy.entrarComo("estudiante");
    cy.irAlMenu("Historial");

    // Cancelada: no se puede calificar ni reportar.
    cy.tarjetaDeSesion("Álgebra Lineal")
      .should("not.contain", "Calificar tutor")
      .and("not.contain", "Reportar tutor");

    // Ya calificada: muestra su calificación y no vuelve a ofrecer el botón.
    cy.tarjetaDeSesion("Física 1")
      .should("contain", "Tu calificación")
      .and("not.contain", "Calificar tutor");

    // Ya reportada: queda marcada y no se puede reportar de nuevo.
    cy.tarjetaDeSesion("Química General")
      .should("contain", "Reporte enviado")
      .and("not.contain", "Reportar tutor");

    // Las sesiones activas no aparecen en el historial, por lo que no se pueden evaluar.
    cy.contains("Cálculo Integral").should("not.exist");
  });
});
