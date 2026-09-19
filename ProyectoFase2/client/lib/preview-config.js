export const PREVIEW_ROL = "administrador";

export const RUTA_POR_ROL = {
  estudiante: "/estudiante/tutores",
  tutor: "/tutor/sesiones/pendientes",
  administrador: "/admin/solicitudes",
};

export const USUARIOS_DEMO = {
  estudiante: { nombre: "Carlos Gómez", rol: "estudiante", correo: "carlos@usac.edu.gt", foto: null },
  tutor: { nombre: "Ana Ramírez", rol: "tutor", correo: "ana@usac.edu.gt", foto: null },
  administrador: { nombre: "Admin EduConnect", rol: "administrador", correo: "admin@educonnect.gt", foto: null },
};
