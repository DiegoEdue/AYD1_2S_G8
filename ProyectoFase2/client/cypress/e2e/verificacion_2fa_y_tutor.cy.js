/// <reference types="cypress" />

describe("Pruebas End-to-End (E2E) - Verificación 2FA y Gestión de Sesiones del Tutor", () => {
  beforeEach(() => {
    // Limpieza de almacenamiento antes de cada prueba
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("CP-E2E-01: Verificación de dos pasos (2FA) para el administrador", () => {
    // Intercepción del login inicial solicitando 2FA
    cy.intercept("POST", "**/api/admin/login", {
      statusCode: 200,
      body: {
        status: "pending_2fa_verify",
        adminId: 1,
        message: "Se requiere autenticación de dos factores",
      },
    }).as("loginAdmin2FA");

    // Intercepción de verificación de código incorrecto y código correcto
    cy.intercept("POST", "**/api/admin/verify-2fa", (req) => {
      if (req.body.token === "000000") {
        req.reply({
          statusCode: 400,
          body: {
            status: "error",
            message: "Código de verificación inválido.",
          },
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            status: "success",
            token: "admin-jwt-token-2fa-valido",
            user: {
              id: 1,
              nombre_usuario: "admin",
              correo: "admin@ingenieria.usac.edu.gt",
              rol: "admin",
            },
          },
        });
      }
    }).as("verify2FA");

    // Intercepción para la pantalla posterior a la autenticación (panel de administración)
    cy.intercept("GET", "**/api/admin/solicitudes*", {
      statusCode: 200,
      body: { status: "success", data: [] },
    }).as("getSolicitudes");

    // 1. Visitar pantalla de login
    cy.visit("/login");
    cy.contains("EduConnect - G8").should("be.visible");

    // 2. Ingresar credenciales del administrador
    cy.get("#identificador").type("admin");
    cy.get("#password").type("Admin123*");
    cy.contains("button", "Iniciar sesión").click();

    // 3. Validar redirección a segundo factor
    cy.wait("@loginAdmin2FA");
    cy.location("pathname").should("eq", "/login/segundo-factor");
    cy.contains("Verificación en dos pasos").should("be.visible");
    cy.contains("Ingresa el código vigente de tu aplicación autenticadora.").should("be.visible");

    // 4. Intentar código incorrecto para validar manejo de errores
    const codigoErroneo = "000000";
    cy.get('[data-slot="otp-input-slot"]').each(($el, index) => {
      cy.wrap($el).type(codigoErroneo[index]);
    });
    cy.contains("button", "Verificar e ingresar").click();
    cy.wait("@verify2FA");
    cy.get('[role="alert"]').should("contain", "Código de verificación inválido.");

    // 5. Limpiar casillas e ingresar código válido de 6 dígitos
    cy.get('[data-slot="otp-input-slot"]').each(($el) => {
      cy.wrap($el).type("{backspace}");
    });
    const codigoValido = "123456";
    cy.get('[data-slot="otp-input-slot"]').each(($el, index) => {
      cy.wrap($el).type(codigoValido[index]);
    });
    cy.contains("button", "Verificar e ingresar").click();
    cy.wait("@verify2FA");

    // 6. Validar ingreso exitoso al módulo de administración
    cy.location("pathname").should("eq", "/admin/solicitudes");
    cy.contains("Solicitudes pendientes").should("be.visible");
  });

  it("CP-E2E-02: Planificar horario de atención y planificar sesión siendo tutor", () => {
    // Intercepción de horario del tutor
    cy.intercept("GET", "**/api/tutor/schedule", {
      statusCode: 200,
      body: {
        status: "success",
        data: {
          dias: ["Lunes", "Miercoles"],
          hora_inicio: "08:00",
          hora_fin: "12:00",
        },
      },
    }).as("getSchedule");

    cy.intercept("PUT", "**/api/tutor/schedule*", {
      statusCode: 200,
      body: {
        status: "success",
        message: "Horario actualizado correctamente.",
      },
    }).as("updateSchedule");

    // Intercepción de sesiones pendientes del tutor
    const sesionPlanificar = {
      id: 101,
      id_sesion: 101,
      materia: "Cálculo Integral",
      estudiante: "Juan Estudiante",
      fecha: "2026-10-25",
      hora: "09:00",
      direccion: "Online",
      motivo: "Preparación para el segundo examen parcial",
      estado: "pendiente",
    };

    cy.intercept("GET", "**/api/tutor/sessions/pending", {
      statusCode: 200,
      body: {
        status: "success",
        data: [sesionPlanificar],
      },
    }).as("getPendingSessions");

    cy.intercept("PATCH", "**/api/tutor/sessions/101/attend", {
      statusCode: 200,
      body: {
        status: "success",
        message: "Sesión atendida exitosamente.",
      },
    }).as("attendSession");

    // 1. Acceder a configuración y planificación de horarios del tutor
    cy.entrarComo("tutor", "/tutor/horarios");
    cy.location("pathname").should("eq", "/tutor/horarios");
    cy.contains("Mis horarios de atención").should("be.visible");
    cy.wait("@getSchedule");

    // 2. Modificar horario seleccionando un nuevo día (Viernes)
    cy.contains("button", "Viernes").click();
    cy.contains("button", "Guardar horario").click();
    cy.wait("@updateSchedule");
    cy.contains("Horario actualizado correctamente.").should("be.visible");

    // 3. Navegar a sesiones pendientes para planificar y atender la sesión
    cy.irAlMenu("Sesiones pendientes");
    cy.wait("@getPendingSessions");
    cy.location("pathname").should("eq", "/tutor/sesiones/pendientes");
    cy.contains("Cálculo Integral").should("be.visible");
    cy.contains("Juan Estudiante").should("be.visible");

    // 4. Abrir modal para planificar la tutoría (registrar plan de estudio)
    cy.tarjetaDeSesion("Cálculo Integral").contains("button", "Marcar atendida").click();
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("Atender sesión").should("be.visible");
      cy.get("#dificultades").type("Integración por partes y fracciones parciales.");

      // Agregar recursos pedagógicos al plan de estudio
      cy.contains("button", "Agregar recurso").click();
      cy.get("#recurso-1-nombre").type("Guía de Integración por Partes");
      cy.get("#recurso-1-tipo").select("Texto");
      cy.get("#recurso-1-valor").type("Ejercicios del 10 al 25 del capítulo 7.");
      cy.get("#recurso-1-descripcion").type("Resolver antes de la siguiente clase.");

      // Guardar el plan y atender la sesión
      cy.contains("button", "Guardar y atender").click();
    });

    // 5. Verificar que la sesión se guardó y se retiró de las pendientes
    cy.wait("@attendSession");
    cy.contains("Sesión atendida. El plan de estudio quedó registrado en tu historial.").should("be.visible");
    cy.contains("Cálculo Integral").should("not.exist");
  });

  it("CP-E2E-03: Cancelar sesión como tutor con notificación al estudiante", () => {
    const sesionACancelar = {
      id: 202,
      id_sesion: 202,
      materia: "Física Básica",
      estudiante: "María Gómez",
      fecha: "2026-10-28",
      hora: "14:00",
      direccion: "Online",
      motivo: "Dudas sobre leyes de Newton",
      estado: "pendiente",
    };

    cy.intercept("GET", "**/api/tutor/sessions/pending", {
      statusCode: 200,
      body: {
        status: "success",
        data: [sesionACancelar],
      },
    }).as("getPendingForCancel");

    cy.intercept("PATCH", "**/api/tutor/sessions/202/cancel", {
      statusCode: 200,
      body: {
        status: "success",
        message: "Sesión cancelada con éxito.",
        emailSent: true,
      },
    }).as("cancelSession");

    // 1. Ingresar como tutor a la vista de sesiones pendientes
    cy.entrarComo("tutor", "/tutor/sesiones/pendientes");
    cy.wait("@getPendingForCancel");
    cy.contains("Física Básica").should("be.visible");
    cy.contains("María Gómez").should("be.visible");

    // 2. Hacer clic en Cancelar para abrir el modal de confirmación
    cy.tarjetaDeSesion("Física Básica").contains("button", "Cancelar").click();

    // 3. Validar advertencia y confirmar cancelación
    cy.get('[role="dialog"]').should("be.visible").within(() => {
      cy.contains("¿Cancelar esta sesión?").should("be.visible");
      cy.contains("Se enviará un correo automático a María Gómez").should("be.visible");
      cy.contains("button", "Sí, cancelar sesión").click();
    });

    // 4. Validar resultado de cancelación
    cy.wait("@cancelSession");
    cy.contains("Sesión cancelada. Se notificó por correo a María Gómez.").should("be.visible");
    cy.contains("Física Básica").should("not.exist");
    cy.contains("No tienes sesiones pendientes por ahora.").should("be.visible");
  });
});
