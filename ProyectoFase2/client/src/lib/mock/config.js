// Interruptor del modo "solo front".
// Mientras NEXT_PUBLIC_USE_MOCK no sea exactamente "false", las pantallas de la Fase 2
// (Sprint 4) leen y escriben datos simulados en el navegador y NO llaman al backend.
// Cuando el backend esté listo: define NEXT_PUBLIC_USE_MOCK=false en .env.local.
export const USAR_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// Datos de la plataforma que aparecen en el encabezado de la constancia PDF (HU-032).
export const PLATAFORMA = {
  nombre: "EduConnect",
  telefono: "+502 2418-9000",
};

// Identidades simuladas del modo demo.
export const ESTUDIANTE_ACTUAL_ID = 1;
export const TUTOR_ACTUAL_ID = 1;
