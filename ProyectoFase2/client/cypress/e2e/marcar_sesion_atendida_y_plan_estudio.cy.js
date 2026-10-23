/// <reference types="cypress" />

describe("Pruebas End-to-End (E2E) - Atender Sesión y Registrar Plan de Estudio (Tutor)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("CP-E2E-ATENDER-01: Marcar como atendida una sesión pendiente y registrar plan de estudio con recursos siendo tutor", () => {
    const sesionPendiente = {
      id: 301,
      id_sesion: 301,
      estudiante: "Carlos Méndez",
      materia: "Física 1",
      fecha: "2026-10-25",
      hora: "10:00",
      direccion: "Online",
      motivo: "Preparación para el segundo examen parcial",
    };

    // Intercepción de sesiones pendientes del tutor
    cy.intercept("GET", "**/api/tutor/sessions/pending*", {
      statusCode: 200,
      body: {
        status: "success",
        data: [sesionPendiente],
      },
    }).as("getPendingSessions");

    // Intercepción para marcar como atendida la sesión y registrar el plan de estudio
    cy.intercept("PATCH", "**/api/tutor/sessions/301/attend", (req) => {
      expect(req.body).to.have.property("dificultades");
      expect(req.body.dificultades).to.include("Leyes de Newton");
      expect(req.body).to.have.property("recursos");
      expect(req.body.recursos).to.be.an("array").with.lengthOf(2);

      req.reply({
        statusCode: 200,
        body: {
          status: "success",
          message: "Sesión atendida y plan de estudio registrado exitosamente.",
        },
      });
    }).as("attendSession");

    // 1. Iniciar sesión como tutor y navegar a sesiones pendientes
    cy.entrarComo("tutor", "/tutor/sesiones/pendientes");
    cy.wait("@getPendingSessions");

    // 2. Verificar que se muestra la sesión pendiente y abrir modal para atender
    cy.contains("h2", "Sesiones pendientes").should("be.visible");
    cy.contains(".rounded-card", "Carlos Méndez").within(() => {
      cy.contains("Física 1").should("be.visible");
      cy.contains("Online").should("be.visible");
      cy.contains("button", "Marcar atendida").click();
    });

    // 3. Validar apertura del modal "Atender sesión" y diligenciar dificultades
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("Atender sesión").should("be.visible");
      cy.contains("Física 1 con Carlos Méndez").should("be.visible");

      cy.get("#dificultades").type(
        "Leyes de Newton y cinemática en dos dimensiones\nConservación de la energía mecánica"
      );

      // 4. Agregar y configurar Recurso 1 (Video)
      cy.contains("button", "Agregar recurso").click();
      cy.get("#recurso-1-nombre").type("Guía Explicativa de Cinemática");
      cy.get("#recurso-1-tipo").select("Video");
      cy.get("#recurso-1-valor").type("https://educonnect.ejemplo.com/videos/cinematica-newton");
      cy.get("#recurso-1-descripcion").type(
        "Revisar los módulos 1 a 3 y resolver los ejercicios propuestos al final del video."
      );

      // 5. Agregar y configurar Recurso 2 (Texto)
      cy.contains("button", "Agregar recurso").click();
      cy.get("#recurso-2-nombre").type("Formulario y Consejos Prácticos");
      cy.get("#recurso-2-tipo").select("Texto");
      cy.get("#recurso-2-valor").type(
        "Tener presente el uso correcto de unidades del SI y diagramas de cuerpo libre en cada problema."
      );
      cy.get("#recurso-2-descripcion").type(
        "Pautas esenciales para la resolución ordenada de problemas en el examen parcial."
      );

      // 6. Guardar y atender la sesión
      cy.contains("button", "Guardar y atender").click();
    });

    // 7. Validar envío de la petición y retroalimentación en pantalla
    cy.wait("@attendSession");
    cy.contains("Sesión atendida. El plan de estudio quedó registrado en tu historial.").should("be.visible");

    // 8. Verificar que la sesión ya no figura en la lista de pendientes
    cy.contains("No tienes sesiones pendientes por ahora.").should("be.visible");
  });

  it("CP-E2E-ATENDER-02: Consultar la sesión atendida en el historial y verificar el plan de estudio con recursos", () => {
    const sesionHistorial = {
      id: 301,
      id_sesion: 301,
      estudiante: "Carlos Méndez",
      materia: "Física 1",
      fecha: "2026-10-25",
      hora: "10:00",
      direccion: "Online",
      estado: "atendida",
      motivo: "Preparación para el segundo examen parcial",
    };

    const detallePlan = {
      id: 301,
      materia: "Física 1",
      plan: {
        dificultades: "Leyes de Newton y cinemática en dos dimensiones\nConservación de la energía mecánica",
        recursos: [
          {
            nombre: "Guía Explicativa de Cinemática",
            tipo: "Video",
            descripcion: "Revisar los módulos 1 a 3 y resolver los ejercicios propuestos al final del video.",
            recursoUrl: "https://educonnect.ejemplo.com/videos/cinematica-newton",
          },
          {
            nombre: "Formulario y Consejos Prácticos",
            tipo: "Texto",
            descripcion: "Pautas esenciales para la resolución ordenada de problemas en el examen parcial.",
            recursoUrl: "Tener presente el uso correcto de unidades del SI y diagramas de cuerpo libre en cada problema.",
          },
        ],
      },
    };

    // Intercepción del historial del tutor
    cy.intercept("GET", "**/api/tutor/sessions/history*", {
      statusCode: 200,
      body: {
        status: "success",
        data: [sesionHistorial],
      },
    }).as("getHistory");

    // Intercepción del detalle del plan de estudio de la sesión atendida
    cy.intercept("GET", "**/api/tutor/sessions/301/detail", {
      statusCode: 200,
      body: {
        status: "success",
        data: detallePlan,
      },
    }).as("getSessionDetail");

    // 1. Acceder al historial de tutorías
    cy.entrarComo("tutor", "/tutor/sesiones/historial");
    cy.wait("@getHistory");

    // 2. Comprobar que la sesión aparece con estado atendida
    cy.contains(".rounded-card", "Carlos Méndez").within(() => {
      cy.contains("Física 1").should("be.visible");
      cy.contains("Atendida").should("be.visible");

      // 3. Desplegar el plan de estudio
      cy.contains("summary", "Ver plan de estudio").click();
    });

    cy.wait("@getSessionDetail");

    // 4. Verificar que se desplieguen las dificultades identificadas
    cy.contains("Dificultades identificadas").should("be.visible");
    cy.contains("Leyes de Newton y cinemática en dos dimensiones").should("be.visible");
    cy.contains("Conservación de la energía mecánica").should("be.visible");

    // 5. Verificar que se desplieguen los recursos recomendados
    cy.contains("Recursos recomendados").should("be.visible");
    cy.contains("Guía Explicativa de Cinemática").should("be.visible");
    cy.contains("Video").should("be.visible");
    cy.contains("Formulario y Consejos Prácticos").should("be.visible");
    cy.contains("Texto").should("be.visible");
    cy.contains("Tener presente el uso correcto de unidades del SI").should("be.visible");
  });
});
