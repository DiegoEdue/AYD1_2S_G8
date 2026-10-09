// Comandos auxiliares para pruebas E2E del módulo Administrador
Cypress.Commands.add("setAdminSession", () => {
  window.localStorage.setItem(
    "auth_user",
    JSON.stringify({
      id: 1,
      nombre_usuario: "admin",
      rol: "admin",
      token: "fake-jwt-admin-token",
    })
  );
});
