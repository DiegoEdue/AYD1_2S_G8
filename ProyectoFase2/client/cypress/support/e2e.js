// Comandos compartidos por las pruebas E2E.
// Las pruebas corren contra el front en modo demo (NEXT_PUBLIC_USE_MOCK distinto de "false"):
// no necesitan backend. Cypress limpia localStorage entre pruebas, así que cada prueba
// parte de los datos de ejemplo originales.
import { USUARIOS_DEMO } from "../../src/lib/mock/usuarios-demo";

const PANTALLA_INICIAL = {
  estudiante: "/estudiante/plan-estudio",
  tutor: "/tutor/sesiones/pendientes",
  admin: "/admin/denuncias",
};

// Entra como un usuario simulado SIN pasar por el botón del login: deja la sesión demo
Cypress.Commands.add("entrarComo", (rol, ruta = PANTALLA_INICIAL[rol]) => {
  cy.visit(ruta, {
    onBeforeLoad(win) {
      win.localStorage.setItem("educonnect_user", JSON.stringify(USUARIOS_DEMO[rol]));
    },
  });
  cy.get('nav[aria-label="Navegación principal"]').should("be.visible");
});

// Abre una pantalla del menú lateral sin recargar la página.
Cypress.Commands.add("irAlMenu", (etiqueta) => {
  cy.get('nav[aria-label="Navegación principal"]').contains("a", etiqueta).click();
});

// Tarjeta de sesión (SessionCard) que contiene cierto texto.
Cypress.Commands.add("tarjetaDeSesion", (texto) => cy.contains(".rounded-card", texto));
