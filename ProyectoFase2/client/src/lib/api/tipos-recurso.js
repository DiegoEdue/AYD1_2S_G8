// Tipos de recurso que acepta el backend al atender una sesión (HU-035).
export const TIPOS_RECURSO = [
  {
    valor: "Texto",
    etiqueta: "Texto",
    icono: "Texto",
    clase: "bg-cream-light text-charcoal-dark",
    entrada: "texto",
  },
  {
    valor: "Video",
    etiqueta: "Video",
    icono: "Video",
    clase: "bg-coral-light/40 text-crimson-dark",
    entrada: "url",
  },
  {
    valor: "Enlace",
    etiqueta: "Enlace",
    icono: "Enlace",
    clase: "bg-sage-light text-charcoal-dark",
    entrada: "url",
  },
  {
    valor: "PDF",
    etiqueta: "PDF",
    icono: "PDF",
    clase: "bg-crimson-light/30 text-crimson-dark",
    entrada: "archivo",
    accept: "application/pdf",
    maxMB: 10,
  },
  {
    valor: "Imagen",
    etiqueta: "Imagen",
    icono: "Documento",
    clase: "bg-coral-light/20 text-charcoal-dark",
    entrada: "archivo",
    accept: "image/*",
    maxMB: 5,
  },
];

const TIPO_DESCONOCIDO = {
  valor: "",
  etiqueta: "Recurso",
  icono: "Documento",
  clase: "bg-charcoal/10 text-charcoal",
};

// Acepta "PDF", "pdf" o " Pdf ": el servidor siempre responde con el valor canónico,
// pero así la UI no se rompe si cambia la capitalización.
export function tipoRecurso(valor) {
  const buscado = String(valor ?? "").trim().toLowerCase();
  return TIPOS_RECURSO.find((tipo) => tipo.valor.toLowerCase() === buscado) || TIPO_DESCONOCIDO;
}
