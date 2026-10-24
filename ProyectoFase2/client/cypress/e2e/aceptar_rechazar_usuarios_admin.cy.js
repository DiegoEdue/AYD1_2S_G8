/// <reference types="cypress" />

describe("Pruebas End-to-End (E2E) - Aceptar o Rechazar Estudiantes y Tutores (Administrador)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("CP-E2E-SOLICITUDES-01: Aceptar y rechazar solicitudes de registro de estudiantes como administrador", () => {
    const solicitudesIniciales = [
      {
        id_estudiante: 101,
        tipo_usuario: "estudiante",
        nombre: "Juan",
        apellido: "Pérez",
        carnet: "202301001",
        correo: "juan.perez@ingenieria.usac.edu.gt",
        genero: "M",
        fecha_nacimiento: "2002-04-10",
      },
      {
        id_estudiante: 102,
        tipo_usuario: "estudiante",
        nombre: "María",
        apellido: "Gómez",
        carnet: "202302002",
        correo: "maria.gomez@ingenieria.usac.edu.gt",
        genero: "F",
        fecha_nacimiento: "2003-08-15",
      },
    ];

    // Intercepción de solicitudes pendientes
    cy.intercept("GET", "**/api/admin/solicitudes", {
      statusCode: 200,
      body: {
        status: "success",
        data: solicitudesIniciales,
      },
    }).as("getSolicitudesEstudiantes");

    // Intercepción de aprobación de estudiante
    cy.intercept("PATCH", "**/api/admin/solicitudes/101/aprobar", (req) => {
      expect(req.body).to.deep.include({ rol: "estudiante" });
      req.reply({
        statusCode: 200,
        body: {
          status: "success",
          message: "Estudiante aprobado exitosamente.",
        },
      });
    }).as("aprobarEstudiante");

    // Intercepción de rechazo de estudiante
    cy.intercept("PATCH", "**/api/admin/solicitudes/102/rechazar", (req) => {
      expect(req.body).to.deep.include({ rol: "estudiante" });
      req.reply({
        statusCode: 200,
        body: {
          status: "success",
          message: "Estudiante rechazado.",
        },
      });
    }).as("rechazarEstudiante");

    // 1. Acceder al módulo de solicitudes pendientes como administrador
    cy.entrarComo("admin", "/admin/solicitudes");
    cy.wait("@getSolicitudesEstudiantes");

    // 2. Validar presencia del título y pestaña activa de estudiantes
    cy.contains("h2", "Solicitudes pendientes").should("be.visible");
    cy.get('button[role="tab"][aria-selected="true"]').should("contain.text", "Estudiantes");

    // 3. Comprobar que ambos estudiantes figuran en la tabla con sus datos
    cy.contains("tr", "Juan Pérez").within(() => {
      cy.contains("202301001").should("be.visible");
      cy.contains("juan.perez@ingenieria.usac.edu.gt").should("be.visible");
      cy.contains("button", "Aceptar").should("be.visible");
      cy.contains("button", "Rechazar").should("be.visible");
    });

    cy.contains("tr", "María Gómez").within(() => {
      cy.contains("202302002").should("be.visible");
      cy.contains("maria.gomez@ingenieria.usac.edu.gt").should("be.visible");
    });

    // 4. Aceptar la solicitud de Juan Pérez
    cy.contains("tr", "Juan Pérez").within(() => {
      cy.contains("button", "Aceptar").click();
    });

    // 5. Validar modal de aprobación y confirmar
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("¿Aprobar esta solicitud de registro?").should("be.visible");
      cy.contains("El usuario Juan Pérez quedará habilitado").should("be.visible");
      cy.contains("button", "Sí, aprobar").click();
    });

    // 6. Validar respuesta de aprobación y remoción de la fila
    cy.wait("@aprobarEstudiante");
    cy.contains("Solicitud de Juan Pérez aprobada con éxito. Se le notificó por correo.").should("be.visible");
    cy.contains("tr", "Juan Pérez").should("not.exist");
    cy.contains("tr", "María Gómez").should("be.visible");

    // 7. Rechazar la solicitud de María Gómez
    cy.contains("tr", "María Gómez").within(() => {
      cy.contains("button", "Rechazar").click();
    });

    // 8. Validar modal de rechazo y confirmar
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("¿Rechazar esta solicitud de registro?").should("be.visible");
      cy.contains("La solicitud de María Gómez será declinada").should("be.visible");
      cy.contains("button", "Sí, rechazar").click();
    });

    // 9. Validar respuesta de rechazo y lista vacía
    cy.wait("@rechazarEstudiante");
    cy.contains("Solicitud de María Gómez rechazada. Se le notificó por correo.").should("be.visible");
    cy.contains("tr", "María Gómez").should("not.exist");
    cy.contains("No hay solicitudes de estudiantes pendientes en este momento.").should("be.visible");
  });

  it("CP-E2E-SOLICITUDES-02: Aceptar y rechazar solicitudes de registro de tutores como administrador", () => {
    const solicitudesTutores = [
      {
        id_tutor: 201,
        tipo_usuario: "tutor",
        nombre: "Roberto",
        apellido: "Morales",
        carnet: "201800111",
        numero_identificacion_tutor: "TUT-201800111",
        correo: "roberto.morales@ingenieria.usac.edu.gt",
        genero: "M",
        especialidad: "Matemática y Física",
      },
      {
        id_tutor: 202,
        tipo_usuario: "tutor",
        nombre: "Laura",
        apellido: "Estrada",
        carnet: "201700222",
        numero_identificacion_tutor: "TUT-201700222",
        correo: "laura.estrada@ingenieria.usac.edu.gt",
        genero: "F",
        especialidad: "Química y Biología",
      },
    ];

    // Intercepción de solicitudes
    cy.intercept("GET", "**/api/admin/solicitudes", {
      statusCode: 200,
      body: {
        status: "success",
        data: solicitudesTutores,
      },
    }).as("getSolicitudesTutores");

    // Intercepción de aprobación de tutor
    cy.intercept("PATCH", "**/api/admin/solicitudes/201/aprobar", (req) => {
      expect(req.body).to.deep.include({ rol: "tutor" });
      req.reply({
        statusCode: 200,
        body: {
          status: "success",
          message: "Tutor aprobado exitosamente.",
        },
      });
    }).as("aprobarTutor");

    // Intercepción de rechazo de tutor
    cy.intercept("PATCH", "**/api/admin/solicitudes/202/rechazar", (req) => {
      expect(req.body).to.deep.include({ rol: "tutor" });
      req.reply({
        statusCode: 200,
        body: {
          status: "success",
          message: "Tutor rechazado.",
        },
      });
    }).as("rechazarTutor");

    // 1. Acceder al módulo de solicitudes pendientes como administrador
    cy.entrarComo("admin", "/admin/solicitudes");
    cy.wait("@getSolicitudesTutores");

    // 2. Conmutar a la pestaña de Tutores
    cy.contains('button[role="tab"]', "Tutores").click();
    cy.get('button[role="tab"][aria-selected="true"]').should("contain.text", "Tutores");

    // 3. Comprobar que ambos tutores se muestran con especialidad y no. identificación
    cy.contains("tr", "Roberto Morales").within(() => {
      cy.contains("201800111").should("be.visible");
      cy.contains("TUT-201800111").should("be.visible");
      cy.contains("Matemática y Física").should("be.visible");
      cy.contains("button", "Aceptar").should("be.visible");
      cy.contains("button", "Rechazar").should("be.visible");
    });

    cy.contains("tr", "Laura Estrada").within(() => {
      cy.contains("201700222").should("be.visible");
      cy.contains("Química y Biología").should("be.visible");
    });

    // 4. Aceptar la solicitud de Roberto Morales
    cy.contains("tr", "Roberto Morales").within(() => {
      cy.contains("button", "Aceptar").click();
    });

    // 5. Validar modal de aprobación y confirmar
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("¿Aprobar esta solicitud de registro?").should("be.visible");
      cy.contains("El usuario Roberto Morales quedará habilitado").should("be.visible");
      cy.contains("button", "Sí, aprobar").click();
    });

    // 6. Validar respuesta de aprobación y actualización de la lista
    cy.wait("@aprobarTutor");
    cy.contains("Solicitud de Roberto Morales aprobada con éxito. Se le notificó por correo.").should("be.visible");
    cy.contains("tr", "Roberto Morales").should("not.exist");
    cy.contains("tr", "Laura Estrada").should("be.visible");

    // 7. Rechazar la solicitud de Laura Estrada
    cy.contains("tr", "Laura Estrada").within(() => {
      cy.contains("button", "Rechazar").click();
    });

    // 8. Validar modal de rechazo y confirmar
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("¿Rechazar esta solicitud de registro?").should("be.visible");
      cy.contains("La solicitud de Laura Estrada será declinada").should("be.visible");
      cy.contains("button", "Sí, rechazar").click();
    });

    // 9. Validar respuesta de rechazo y lista vacía
    cy.wait("@rechazarTutor");
    cy.contains("Solicitud de Laura Estrada rechazada. Se le notificó por correo.").should("be.visible");
    cy.contains("tr", "Laura Estrada").should("not.exist");
    cy.contains("No hay solicitudes de tutores pendientes en este momento.").should("be.visible");
  });
});
