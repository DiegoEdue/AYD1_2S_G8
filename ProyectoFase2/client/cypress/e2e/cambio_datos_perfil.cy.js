/// <reference types="cypress" />

describe("Pruebas End-to-End (E2E) - Cambio de Datos en Perfil (Estudiante y Tutor)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("CP-E2E-PERFIL-01: Cambio de datos en perfil del estudiante", () => {
    const perfilInicialEstudiante = {
      nombre: "Ana Lucía",
      apellido: "Morales",
      correo: "estudiante@demo.educonnect.gt",
      carnet: "202300001",
      genero: "F",
      fecha_nacimiento: "2002-05-15",
      telefono: "55551234",
      direccion: "Ciudad Universitaria Zona 12",
      foto_url: "",
    };

    const perfilActualizadoEstudiante = {
      ...perfilInicialEstudiante,
      nombre: "Ana Sofía",
      telefono: "55558899",
      direccion: "Zona 10, Edificio Los Próceres",
    };

    // 1. Intercepción de carga inicial de perfil del estudiante
    cy.intercept("GET", "**/api/student/profile", {
      statusCode: 200,
      body: {
        status: "success",
        data: perfilInicialEstudiante,
      },
    }).as("getStudentProfile");

    // 2. Intercepción de actualización de datos de perfil
    cy.intercept("PUT", "**/api/student/profile", {
      statusCode: 200,
      body: {
        status: "success",
        message: "Perfil actualizado exitosamente",
        data: perfilActualizadoEstudiante,
      },
    }).as("updateStudentProfile");

    // 3. Acceder al perfil del estudiante
    cy.entrarComo("estudiante", "/estudiante/perfil");
    cy.location("pathname").should("eq", "/estudiante/perfil");
    cy.wait("@getStudentProfile");

    // 4. Validar visualización de datos y campos bloqueados (inmutables)
    cy.get("form").should("contain", "Ana Lucía Morales");
    cy.contains("p", "Perfil de estudiante").should("be.visible");
    cy.get("#correo").should("be.disabled").and("have.value", "estudiante@demo.educonnect.gt");
    cy.get("#carnet").should("be.disabled").and("have.value", "202300001");

    // 5. Modificar campos permitidos (nombre, teléfono, dirección)
    cy.get("#nombre").clear().type("Ana Sofía");
    cy.get("#telefono").clear().type("55558899");
    cy.get("#direccion").clear().type("Zona 10, Edificio Los Próceres");

    // 6. Guardar los cambios y validar retroalimentación
    cy.contains("button", "Guardar cambios").click();
    cy.wait("@updateStudentProfile");

    // 7. Validar mensaje toast y actualización de los valores
    cy.contains("Perfil actualizado correctamente.").should("be.visible");
    cy.get("#nombre").should("have.value", "Ana Sofía");
    cy.get("#telefono").should("have.value", "55558899");
    cy.get("#direccion").should("have.value", "Zona 10, Edificio Los Próceres");
    cy.get("form").should("contain", "Ana Sofía Morales");
  });

  it("CP-E2E-PERFIL-02: Cambio de datos en perfil del tutor y gestión de especialidades", () => {
    const perfilInicialTutor = {
      id_tutor: 2,
      nombre: "Carlos",
      apellido: "Mendoza",
      correo: "carlos.mendoza@ingenieria.usac.edu.gt",
      carnet_id: "201901234",
      numero_identificacion_tutor: "TUT-9876",
      genero: "M",
      fecha_nacimiento: "1998-08-20",
      telefono: "44441122",
      direccion: "Avenida Las Américas Zona 14",
      direccion_tutoria: "Online",
      anio_inicio_tutorias: 2021,
      universidad_graduacion: "Universidad de San Carlos de Guatemala",
      especialidad: ["Cálculo 1", "Física 1"],
      foto_url: "",
    };

    const perfilActualizadoTutor = {
      ...perfilInicialTutor,
      telefono: "44449988",
      direccion: "Zona 11, Colonia Las Charcas",
      direccion_tutoria: "Física",
      especialidad: ["Cálculo 1", "Física 1", "Química 1"],
    };

    // 1. Intercepción de carga de perfil del tutor
    cy.intercept("GET", "**/api/tutor/profile", {
      statusCode: 200,
      body: {
        status: "success",
        data: perfilInicialTutor,
      },
    }).as("getTutorProfile");

    // 2. Intercepción de actualización del perfil del tutor
    cy.intercept("PATCH", "**/api/tutor/profile", {
      statusCode: 200,
      body: {
        status: "success",
        message: "Perfil actualizado exitosamente",
        data: perfilActualizadoTutor,
      },
    }).as("updateTutorProfile");

    // 3. Acceder al perfil del tutor
    cy.entrarComo("tutor", "/tutor/perfil");
    cy.location("pathname").should("eq", "/tutor/perfil");
    cy.wait("@getTutorProfile");

    // 4. Validar visualización y campos protegidos
    cy.get("form").should("contain", "Carlos Mendoza");
    cy.contains("p", "Perfil de tutor").should("be.visible");
    cy.get("#correo").should("be.disabled").and("have.value", "carlos.mendoza@ingenieria.usac.edu.gt");
    cy.get("#carnet_id").should("be.disabled").and("have.value", "201901234");
    cy.get("#numero_identificacion_tutor").should("be.disabled").and("have.value", "TUT-9876");

    // 5. Modificar campos de contacto y modalidad de tutoría
    cy.get("#telefono").clear().type("44449988");
    cy.get("#direccion").clear().type("Zona 11, Colonia Las Charcas");
    cy.get("#direccion_tutoria").select("Física");

    // 6. Gestionar especialidades: Añadir nueva materia
    cy.contains("button", "Cálculo 1 ×").should("be.visible");
    cy.contains("button", "Física 1 ×").should("be.visible");
    cy.get('input[placeholder="Nueva materia"]').type("Química 1");
    cy.contains("button", "Añadir").click();
    cy.contains("button", "Química 1 ×").should("be.visible");

    // 7. Guardar cambios y verificar notificación
    cy.contains("button", "Guardar cambios").click();
    cy.wait("@updateTutorProfile");

    cy.contains("Perfil actualizado correctamente.").should("be.visible");
    cy.get("#direccion_tutoria").should("have.value", "Física");
    cy.get("#telefono").should("have.value", "44449988");
    cy.get("form").should("contain", "Química 1 ×");
  });
});
