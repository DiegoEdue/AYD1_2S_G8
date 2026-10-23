/// <reference types="cypress" />

describe("Pruebas End-to-End (E2E) - Moderación de Denuncias (Administrador)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("CP-E2E-DENUNCIAS-01: Ver denuncias contra tutores, verificar la causa y dar de baja al tutor infractor", () => {
    const denunciasTutores = [
      {
        id: 101,
        categoria: "Incumplimiento de horarios",
        motivo: "El tutor no se presentó a la sesión programada de las 10:00 y no notificó previamente a los estudiantes.",
        denunciado_nombre: "Carlos Mendoza",
        denunciado_foto: "",
        denunciante_nombre: "Ana Lucía Morales",
        fecha: "2026-10-21T09:00:00.000Z",
        estado: "pendiente",
      },
    ];

    // Intercepción de listado de denuncias contra tutores
    cy.intercept("GET", "**/api/admin/denuncias?tipo=tutores", {
      statusCode: 200,
      body: {
        status: "success",
        data: denunciasTutores,
      },
    }).as("getDenunciasTutores");

    // Intercepción de resolución de denuncia (Dar de baja)
    cy.intercept("PATCH", "**/api/admin/denuncias/101/resolver", (req) => {
      expect(req.body).to.deep.include({
        accion: "dar_de_baja",
        tipo: "tutores",
      });
      expect(req.body.motivo).to.include("Reincidencia injustificada");

      req.reply({
        statusCode: 200,
        body: {
          status: "success",
          message: "Se aplicó la baja al tutor y se notificó por correo.",
        },
      });
    }).as("resolveDenunciaBaja");

    // 1. Acceder al panel de denuncias como administrador
    cy.entrarComo("admin", "/admin/denuncias");
    cy.wait("@getDenunciasTutores");

    // 2. Verificar títulos e interfaz principal de moderación
    cy.contains("h2", "Inspección y Moderación de Denuncias").should("be.visible");
    cy.get('button[role="tab"][aria-selected="true"]').should("contain.text", "Denuncias contra Tutores");

    // 3. Validar presencia del tutor denunciado, categoría y motivo de la denuncia en la tabla
    cy.contains("td", "Incumplimiento de horarios").should("be.visible");
    cy.contains("td", "Carlos Mendoza").should("be.visible");
    cy.contains("td", "Ana Lucía Morales").should("be.visible");
    cy.contains("td", "El tutor no se presentó a la sesión programada").should("be.visible");

    // 4. Hacer clic en "Dar de baja" para verificar la causa en el modal
    cy.contains("tr", "Carlos Mendoza").within(() => {
      cy.contains("button", "Dar de baja").click();
    });

    // 5. Validar modal de resolución y detalle de la causa de la denuncia
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("¿Dar de baja a Carlos Mendoza?").should("be.visible");
      cy.contains("Detalle del reporte:").should("be.visible");
      cy.contains("El tutor no se presentó a la sesión programada de las 10:00").should("be.visible");

      // 6. Ingresar justificación administrativa y confirmar baja
      cy.get("#motivoResolucion").type("Reincidencia injustificada en ausencia a tutorías confirmadas.");
      cy.contains("button", "Sí, dar de baja").click();
    });

    // 7. Validar retroalimentación toast y actualización de la tabla
    cy.wait("@resolveDenunciaBaja");
    cy.contains("Se aplicó la baja al usuario Carlos Mendoza y se notificó por correo.").should("be.visible");

    // 8. Verificar que el estado cambió a sancionado y los botones quedaron deshabilitados
    cy.contains("tr", "Carlos Mendoza").within(() => {
      cy.contains("Sancionado").should("be.visible");
      cy.contains("button", "Dar de baja").should("be.disabled");
      cy.contains("button", "Rechazar denuncia").should("be.disabled");
    });
  });

  it("CP-E2E-DENUNCIAS-02: Ver denuncias contra estudiantes, verificar la causa y rechazar/descartar denuncia como admin", () => {
    const denunciasTutoresVacio = [];
    const denunciasEstudiantes = [
      {
        id: 202,
        categoria: "Conducta inapropiada",
        motivo: "El estudiante utilizó expresiones agresivas durante la sesión virtual de dudas.",
        denunciado_nombre: "Mateo García",
        denunciado_foto: "",
        denunciante_nombre: "Sofía Castillo",
        fecha: "2026-10-21T11:30:00.000Z",
        estado: "pendiente",
      },
    ];

    // Intercepción inicial de tutores y luego de estudiantes
    cy.intercept("GET", "**/api/admin/denuncias?tipo=tutores", {
      statusCode: 200,
      body: {
        status: "success",
        data: denunciasTutoresVacio,
      },
    }).as("getDenunciasTutoresInit");

    cy.intercept("GET", "**/api/admin/denuncias?tipo=estudiantes", {
      statusCode: 200,
      body: {
        status: "success",
        data: denunciasEstudiantes,
      },
    }).as("getDenunciasEstudiantes");

    // Intercepción de resolución de denuncia (Rechazar denuncia)
    cy.intercept("PATCH", "**/api/admin/denuncias/202/resolver", (req) => {
      expect(req.body).to.deep.include({
        accion: "rechazar_denuncia",
        tipo: "estudiantes",
      });
      expect(req.body.motivo).to.include("falta de pruebas concluyentes");

      req.reply({
        statusCode: 200,
        body: {
          status: "success",
          message: "Denuncia descartada.",
        },
      });
    }).as("resolveDenunciaRechazo");

    // 1. Acceder al panel de denuncias como administrador
    cy.entrarComo("admin", "/admin/denuncias");
    cy.wait("@getDenunciasTutoresInit");

    // 2. Cambiar a la pestaña de denuncias contra estudiantes
    cy.contains('button[role="tab"]', "Denuncias contra Estudiantes").click();
    cy.wait("@getDenunciasEstudiantes");

    // 3. Validar presencia del estudiante denunciado, categoría y motivo
    cy.contains("td", "Conducta inapropiada").should("be.visible");
    cy.contains("td", "Mateo García").should("be.visible");
    cy.contains("td", "Sofía Castillo").should("be.visible");
    cy.contains("td", "El estudiante utilizó expresiones agresivas").should("be.visible");

    // 4. Hacer clic en "Rechazar denuncia" para verificar causa y abrir modal
    cy.contains("tr", "Mateo García").within(() => {
      cy.contains("button", "Rechazar denuncia").click();
    });

    // 5. Validar modal de descarte de denuncia
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("¿Rechazar y descartar esta denuncia?").should("be.visible");
      cy.contains("Detalle del reporte:").should("be.visible");
      cy.contains("El estudiante utilizó expresiones agresivas durante la sesión virtual").should("be.visible");

      // 6. Ingresar justificación administrativa y confirmar rechazo
      cy.get("#motivoResolucion").type("Queja desestimada por falta de pruebas concluyentes; primer llamado preventivo.");
      cy.contains("button", "Sí, rechazar denuncia").click();
    });

    // 7. Validar retroalimentación toast de denuncia rechazada
    cy.wait("@resolveDenunciaRechazo");
    cy.contains("La denuncia contra Mateo García fue rechazada y descartada.").should("be.visible");

    // 8. Verificar que el estado cambió a descartado y los botones quedaron inhabilitados
    cy.contains("tr", "Mateo García").within(() => {
      cy.contains("Descartado").should("be.visible");
      cy.contains("button", "Dar de baja").should("be.disabled");
      cy.contains("button", "Rechazar denuncia").should("be.disabled");
    });
  });
});
