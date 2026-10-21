describe("Pruebas End-to-End (E2E) - Modulo Administrador (Fase 2)", () => {
  beforeEach(() => {
    // Interceptar llamadas al backend con mocks 
    cy.intercept("GET", "**/api/admin/solicitudes", {
      statusCode: 200,
      body: {
        status: "success",
        data: [
          {
            id_estudiante: 101,
            nombre: "Juan",
            apellido: "Pérez",
            carnet: "202301001",
            correo: "juan.perez@ingenieria.usac.edu.gt",
            genero: "M",
            fecha_nacimiento: "2002-04-10",
            foto_url: "",
            carnet_pdf_url: "https://example.com/carnet.pdf",
            tipo_usuario: "estudiante",
          },
        ],
      },
    }).as("getSolicitudes");

    cy.intercept("GET", "**/api/admin/students/approved", {
      statusCode: 200,
      body: {
        status: "success",
        data: [
          {
            id_estudiante: 201,
            nombre: "Ana",
            apellido: "López",
            carnet: "202209999",
            correo: "ana.lopez@ingenieria.usac.edu.gt",
            genero: "F",
            telefono: "55554433",
            direccion: "Zona 12, Ciudad",
            fecha_nacimiento: "2001-11-20",
            estado_aprobacion: "aprobado",
          },
        ],
      },
    }).as("getStudentsApproved");

    cy.intercept("GET", "**/api/admin/tutors/approved", {
      statusCode: 200,
      body: {
        status: "success",
        data: [],
      },
    }).as("getTutorsApproved");

    cy.intercept("GET", "**/api/admin/reportes", {
      statusCode: 200,
      body: {
        status: "success",
        data: {
          totales: { sesiones: 25, estudiantes: 18, tutores: 6 },
          porEstado: [
            { estado: "Atendida", cantidad: 20 },
            { estado: "Cancelada_Estudiante", cantidad: 5 },
          ],
          porMateria: [{ materia: "Análisis y Diseño 1", cantidad: 14 }],
          porTutor: [{ tutor: "Ing. Carlos Mendoza", sesiones: 10 }],
          cancelacionesPorMateria: [{ materia: "Física 1", total_canceladas: 4 }],
          horariosDemandados: [{ franja_horaria: "10:00", total_sesiones: 8 }],
        },
      },
    }).as("getReportes");

    cy.intercept("GET", "**/api/admin/ratings/tutors", {
      statusCode: 200,
      body: {
        status: "success",
        data: [
          {
            id_tutor: 1,
            nombre: "Ing. Carlos Mendoza",
            especialidad: "Ciencias de la Computación",
            promedio_estrellas: 4.9,
          },
        ],
      },
    }).as("getTutorRatings");

    cy.intercept("GET", "**/api/admin/ratings/students", {
      statusCode: 200,
      body: {
        status: "success",
        data: [
          {
            id_estudiante: 201,
            nombre: "Ana López",
            carnet: "202209999",
            promedio_estrellas: 5.0,
          },
        ],
      },
    }).as("getStudentRatings");

    cy.intercept("GET", "**/api/admin/denuncias*", {
      statusCode: 200,
      body: {
        status: "success",
        data: [
          {
            id: 1,
            tipo: "tutor",
            categoria: "Inasistencia",
            motivo: "El tutor no se presentó a la sesión programada.",
            denunciado_nombre: "Tutor Prueba",
            denunciante_nombre: "Estudiante Alumno",
            fecha: "2026-10-08",
            estado: "pendiente",
          },
        ],
      },
    }).as("getDenuncias");
  });

  it("CP-E2E-01: Flujo integral del administrador con visor PDF, edición protegida y reportes", () => {
    // 1. Acceder a Solicitudes Pendientes
    cy.visit("/admin/solicitudes");
    cy.contains("Solicitudes pendientes").should("be.visible");
    cy.wait("@getSolicitudes");

    // 2. Verificar datos de estudiante en la tabla
    cy.contains("Juan Pérez").should("be.visible");
    cy.contains("202301001").should("be.visible");
    cy.contains("juan.perez@ingenieria.usac.edu.gt").should("be.visible");

    // 3. Probar apertura interactiva del visor PDF (HU-038)
    cy.contains("button", "Ver Carnet PDF").click();
    cy.contains("Carnet Escaneado: Juan Pérez").should("be.visible");
    cy.get("iframe").should("exist");

    // 4. Cerrar el visor de PDF
    cy.contains("button", "Cerrar visor").click();
    cy.contains("Carnet Escaneado: Juan Pérez").should("not.exist");

    // 5. Navegar a Gestión de Usuarios (HU-040 y HU-041)
    cy.visit("/admin/usuarios");
    cy.contains("Gestión de Usuarios Aprobados").should("be.visible");
    cy.wait("@getStudentsApproved");
    cy.contains("Ana López").should("be.visible");

    // 6. Abrir modal de edición y verificar que el campo correo esté deshabilitado
    cy.contains("button", "Editar").first().click();
    cy.contains("Editar perfil de Estudiante").should("be.visible");
    cy.get('input[name="correo"], input[disabled]').should("be.disabled");

    // Cerrar modal de edición
    cy.contains("button", "Cancelar").click();

    // 7. Navegar a Reportes Analíticos (HU-044, HU-045, HU-046)
    cy.visit("/admin/reportes");
    cy.contains("Reportes y Evaluaciones").should("be.visible");
    cy.wait("@getReportes");

    // 8. Navegar a Moderación de Denuncias (HU-042 y HU-043)
    cy.visit("/admin/denuncias");
    cy.contains("Inspección y Moderación de Denuncias").should("be.visible");
    cy.wait("@getDenuncias");
    cy.contains("Inasistencia").should("be.visible");
  });
});
