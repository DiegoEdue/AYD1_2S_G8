/// <reference types="cypress" />

describe("Pruebas End-to-End (E2E) - Ver Tutores Disponibles y Planificar Sesión", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("CP-E2E-TUTORES-01: Ver catálogo de tutores disponibles y aplicar filtros de búsqueda", () => {
    const tutoresCatalogo = [
      {
        id_tutor: 2,
        nombre: "Carlos",
        apellido: "Mendoza",
        materias: ["Cálculo 1", "Física 1"],
        universidad_graduacion: "USAC",
        direccion_tutoria: "Online",
        anios: 4,
        genero: "M",
        edad: 28,
        fecha_nacimiento: "1998-05-10",
        foto_url: "",
        dias_atencion: ["Lunes", "Miercoles", "Viernes"],
        hora_inicio_atencion: "08:00",
        hora_fin_atencion: "16:00",
      },
      {
        id_tutor: 3,
        nombre: "Sofía",
        apellido: "Castillo",
        materias: ["Química General"],
        universidad_graduacion: "URL",
        direccion_tutoria: "Física",
        anios: 2,
        genero: "F",
        edad: 26,
        fecha_nacimiento: "2000-08-15",
        foto_url: "",
        dias_atencion: ["Martes", "Jueves"],
        hora_inicio_atencion: "10:00",
        hora_fin_atencion: "14:00",
      },
    ];

    // Intercepción del catálogo de tutores y búsqueda por filtros
    cy.intercept("GET", /.*\/api\/student\/catalog.*/, (req) => {
      const url = new URL(req.url);
      const materia = url.searchParams.get("materia");
      if (materia) {
        const filtrados = tutoresCatalogo.filter((t) =>
          t.materias.some((m) => m.toLowerCase().includes(materia.toLowerCase()))
        );
        req.reply({
          statusCode: 200,
          body: {
            status: "success",
            data: filtrados,
          },
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            status: "success",
            data: tutoresCatalogo,
          },
        });
      }
    }).as("getCatalog");

    // 1. Acceder al módulo de tutores como estudiante
    cy.entrarComo("estudiante", "/estudiante/tutores");
    cy.location("pathname").should("eq", "/estudiante/tutores");
    cy.wait("@getCatalog");

    // 2. Verificar que ambos tutores se muestran en pantalla
    cy.contains("Buscar tutores").should("be.visible");
    cy.contains("h3", "Carlos Mendoza").should("be.visible");
    cy.contains("p", "USAC").should("be.visible");
    cy.contains("span", "Cálculo 1").should("be.visible");

    cy.contains("h3", "Sofía Castillo").should("be.visible");
    cy.contains("p", "URL").should("be.visible");
    cy.contains("span", "Química General").should("be.visible");

    // 3. Filtrar por materia específica ("Cálculo")
    cy.get("#materia").type("Cálculo");
    cy.contains("h3", "Carlos Mendoza").should("be.visible");
    cy.contains("h3", "Sofía Castillo").should("not.exist");

    // 4. Limpiar filtro y comprobar que se restablece la lista
    cy.get("#materia").clear();
    cy.contains("h3", "Carlos Mendoza").should("be.visible");
    cy.contains("h3", "Sofía Castillo").should("be.visible");
  });

  it("CP-E2E-TUTORES-02: Consultar disponibilidad y planificar sesión de tutoría como estudiante", () => {
    const tutorSeleccionado = {
      id_tutor: 2,
      nombre: "Carlos",
      apellido: "Mendoza",
      materias_detalle: [
        { id: 101, nombre: "Cálculo 1" },
        { id: 102, nombre: "Física 1" },
      ],
      materias: ["Cálculo 1", "Física 1"],
      universidad_graduacion: "USAC",
      direccion_tutoria: "Online",
      foto_url: "",
      dias_atencion: ["Lunes", "Miercoles", "Viernes"],
      hora_inicio_atencion: "08:00",
      hora_fin_atencion: "16:00",
    };

    // Intercepción del catálogo de tutores
    cy.intercept("GET", "**/api/student/catalog*", {
      statusCode: 200,
      body: {
        status: "success",
        data: [tutorSeleccionado],
      },
    }).as("getCatalogForDetail");

    // Intercepción de sesiones activas del estudiante
    cy.intercept("GET", "**/api/student/sessions/active", {
      statusCode: 200,
      body: {
        status: "success",
        data: [],
      },
    }).as("getActiveSessions");

    // Intercepción de disponibilidad por fecha específica (Viernes 2026-10-30)
    cy.intercept("GET", "**/api/student/tutor/2/availability*", {
      statusCode: 200,
      body: {
        status: "success",
        data: {
          disponible: true,
          dias_atencion: ["Lunes", "Miercoles", "Viernes"],
          horario_general: {
            inicio: "08:00",
            fin: "16:00",
          },
          franjas: [
            { hora: "08:00", estado: "libre" },
            { hora: "09:00", estado: "ocupada" },
            { hora: "10:00", estado: "libre" },
            { hora: "11:00", estado: "libre" },
          ],
        },
      },
    }).as("getAvailability");

    // Intercepción de programación de sesión
    cy.intercept("POST", "**/api/student/sessions", {
      statusCode: 201,
      body: {
        status: "success",
        message: "Sesión programada correctamente.",
        data: {
          id: 501,
          idTutor: 2,
          idMateria: 101,
          fecha: "2026-10-30",
          hora: "10:00",
          motivo: "Dudas sobre integrales de línea",
        },
      },
    }).as("scheduleSession");

    // 1. Acceder al catálogo y seleccionar el tutor
    cy.entrarComo("estudiante", "/estudiante/tutores");
    cy.wait("@getCatalogForDetail");
    cy.contains(".rounded-card", "Carlos Mendoza").within(() => {
      cy.contains("Ver horarios y agendar").click();
    });

    // 2. Validar navegación a la vista de detalle del tutor
    cy.location("pathname").should("eq", "/estudiante/tutores/2");
    cy.contains("h2", "Carlos Mendoza").should("be.visible");
    cy.contains("Consultar disponibilidad").should("be.visible");

    // 3. Consultar disponibilidad para una fecha válida (2026-10-30 - Viernes)
    const fechaSesion = "2026-10-30";
    cy.get('input[aria-label="Fecha a consultar"]').type(fechaSesion);
    cy.wait("@getAvailability");
    cy.contains("Disponible el Viernes de 08:00 a 16:00.").should("be.visible");
    cy.contains("Franjas del día").should("be.visible");

    // 4. Abrir modal interactivo para planificar la sesión
    cy.contains("button", "Programar sesión").click();
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("Programar sesión con Carlos Mendoza").should("be.visible");

      // Seleccionar franja horaria disponible
      cy.get("#hora").select("10:00");

      // Seleccionar materia
      cy.get("#materia").select("Cálculo 1");

      // Ingresar motivo de la tutoría
      cy.get("#motivo").type("Dudas sobre integrales de línea y teorema de Green");

      // Confirmar programación de la sesión
      cy.contains("button", "Confirmar sesión").click();
    });

    // 5. Validar registro exitoso y redirección a mis sesiones activas
    cy.wait("@scheduleSession");
    cy.contains("Sesión programada correctamente.").should("be.visible");
    cy.location("pathname").should("eq", "/estudiante/sesiones/activas");
    cy.contains("h2", "Mis sesiones").should("be.visible");
  });
});
