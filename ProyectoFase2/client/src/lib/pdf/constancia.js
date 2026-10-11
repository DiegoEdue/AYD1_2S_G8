// Generador de la constancia del Plan de Estudio en PDF (HU-032), sin dependencias externas.
// Escribe un PDF 1.4 básico (A4, Helvetica) directamente, así funciona sin backend.

const ANCHO = 595.28;
const ALTO = 841.89;
const MARGEN = 50;
const ALTO_PIE = 120;
const CRIMSON = [0.91, 0.29, 0.37];
const CHARCOAL = [0.165, 0.212, 0.231];
const GRIS = [0.4, 0.45, 0.47];
const BLANCO = [1, 1, 1];

const REEMPLAZOS = { "–": "-", "—": "-", "‘": "'", "’": "'", "“": '"', "”": '"', "…": "...", "·": "-", "½": "1/2", "²": "2" };

// Helvetica estándar solo cubre Latin-1 (acentos y ñ incluidos). Lo demás se reemplaza.
function aLatin1(texto) {
  let salida = "";
  for (const caracter of String(texto ?? "")) {
    const c = REEMPLAZOS[caracter] ?? caracter;
    for (const parte of c) {
      const codigo = parte.codePointAt(0);
      if (codigo === 10 || codigo === 13 || codigo === 9) salida += " ";
      else salida += codigo >= 32 && codigo <= 255 ? parte : "?";
    }
  }
  return salida;
}

function escapar(texto) {
  return aLatin1(texto).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

const num = (n) => Number(n).toFixed(2);
const color = (c) => c.map(num).join(" ");

// Estimación conservadora del ancho de Helvetica (promedio por carácter).
function anchoTexto(texto, tamanio, negrita = false) {
  return aLatin1(texto).length * tamanio * (negrita ? 0.58 : 0.54);
}

export function ajustarTexto(texto, anchoMax, tamanio, negrita = false) {
  const maxCaracteres = Math.max(1, Math.floor(anchoMax / (tamanio * (negrita ? 0.58 : 0.54))));
  const lineas = [];
  for (const parrafo of String(texto ?? "").split(/\r?\n/)) {
    let actual = "";
    for (let palabra of parrafo.split(/\s+/).filter(Boolean)) {
      while (palabra.length > maxCaracteres) {
        if (actual) {
          lineas.push(actual);
          actual = "";
        }
        lineas.push(palabra.slice(0, maxCaracteres));
        palabra = palabra.slice(maxCaracteres);
      }
      const prueba = actual ? `${actual} ${palabra}` : palabra;
      if (prueba.length > maxCaracteres) {
        lineas.push(actual);
        actual = palabra;
      } else {
        actual = prueba;
      }
    }
    lineas.push(actual);
  }
  return lineas.length ? lineas : [""];
}

class Pagina {
  constructor() {
    this.ops = [];
  }

  // y se mide desde el borde superior de la hoja.
  texto(x, ySup, texto, { tamanio = 10, negrita = false, color: c = CHARCOAL } = {}) {
    this.ops.push(
      `${color(c)} rg BT /${negrita ? "F2" : "F1"} ${tamanio} Tf ${num(x)} ${num(ALTO - ySup)} Td (${escapar(texto)}) Tj ET`
    );
  }

  rect(x, ySup, ancho, alto, c) {
    this.ops.push(`${color(c)} rg ${num(x)} ${num(ALTO - ySup - alto)} ${num(ancho)} ${num(alto)} re f`);
  }

  linea(x1, y1, x2, y2, c = CHARCOAL, grosor = 0.6) {
    this.ops.push(`${color(c)} RG ${grosor} w ${num(x1)} ${num(ALTO - y1)} m ${num(x2)} ${num(ALTO - y2)} l S`);
  }

  contenido() {
    return this.ops.join("\n");
  }
}

function formatearFecha(fecha) {
  return fecha.toLocaleDateString("es-GT", { day: "numeric", month: "long", year: "numeric" });
}

function formatearFechaIso(iso) {
  const [y, m, d] = String(iso ?? "").slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "No disponible";
  return formatearFecha(new Date(y, m - 1, d));
}

function dificultadesComoLista(entrada) {
  const lista = Array.isArray(entrada) ? entrada : entrada ? [entrada] : [];
  return lista
    .flatMap((item) => String(typeof item === "string" ? item : (item?.texto ?? item?.descripcion ?? "")).split(/\r?\n/))
    .map((l) => l.trim())
    .filter(Boolean);
}

function dibujarEncabezado(pagina, { nombrePlataforma, telefono, fechaEmision }) {
  pagina.rect(0, 0, ANCHO, 100, CRIMSON);
  pagina.texto(MARGEN, 44, nombrePlataforma, { tamanio: 26, negrita: true, color: BLANCO });
  pagina.texto(MARGEN, 63, "Constancia oficial de Plan de Estudio", { tamanio: 11, color: BLANCO });
  pagina.texto(MARGEN, 84, `Fecha de emisión: ${fechaEmision}`, { tamanio: 9.5, color: BLANCO });
  pagina.texto(MARGEN + 250, 84, `Teléfono de contacto: ${telefono}`, { tamanio: 9.5, color: BLANCO });
}

function dibujarPie(pagina, plan, numero, total, nombrePlataforma) {
  const y = ALTO - ALTO_PIE;
  pagina.linea(MARGEN, y, ANCHO - MARGEN, y, GRIS, 0.8);
  pagina.texto(MARGEN, y + 18, "Firma digital del tutor", { tamanio: 8.5, color: GRIS });
  pagina.texto(MARGEN, y + 36, plan.tutorNombre || "Tutor", { tamanio: 13, negrita: true });
  pagina.texto(MARGEN, y + 52, `Especialidad: ${plan.especialidad || "No disponible"}`, { tamanio: 9.5 });
  pagina.texto(MARGEN, y + 66, `No. de identificación: ${plan.identificacion || "No disponible"}`, { tamanio: 9.5 });
  pagina.texto(MARGEN, y + 90, `Documento generado electrónicamente por ${nombrePlataforma}. Firma digital emulada.`, {
    tamanio: 7.5,
    color: GRIS,
  });
  pagina.texto(ANCHO - MARGEN - 60, y + 90, `Página ${numero} de ${total}`, { tamanio: 7.5, color: GRIS });
}

const COLUMNAS = [
  { titulo: "Nombre", ancho: 150 },
  { titulo: "Tipo", ancho: 60 },
  { titulo: "Descripción de uso", ancho: ANCHO - MARGEN * 2 - 210 },
];
const TAM_CELDA = 9;
const INTERLINEA = 12;

function dibujarCabeceraTabla(pagina, y) {
  pagina.rect(MARGEN, y, ANCHO - MARGEN * 2, 20, CHARCOAL);
  let x = MARGEN;
  for (const col of COLUMNAS) {
    pagina.texto(x + 6, y + 14, col.titulo, { tamanio: 9.5, negrita: true, color: BLANCO });
    x += col.ancho;
  }
  return y + 20;
}

// Arma la lista de páginas con su contenido.
function maquetar(plan, opciones) {
  const paginas = [];
  let pagina = new Pagina();
  paginas.push(pagina);
  dibujarEncabezado(pagina, opciones);

  const limite = ALTO - ALTO_PIE - 14;
  let y = 130;

  const nuevaPagina = () => {
    pagina = new Pagina();
    paginas.push(pagina);
    pagina.texto(MARGEN, 40, `${opciones.nombrePlataforma} - Constancia de Plan de Estudio (continuación)`, {
      tamanio: 9,
      color: GRIS,
    });
    pagina.linea(MARGEN, 48, ANCHO - MARGEN, 48, GRIS, 0.5);
    y = 70;
  };

  // Datos generales
  const datos = [
    ["Estudiante", plan.estudianteNombre],
    ["Materia", plan.materia],
    ["Fecha de la última sesión", formatearFechaIso(plan.fecha)],
  ].filter(([, v]) => v);
  for (const [etiqueta, valor] of datos) {
    pagina.texto(MARGEN, y, `${etiqueta}:`, { tamanio: 10, negrita: true });
    pagina.texto(MARGEN + 150, y, valor, { tamanio: 10 });
    y += 16;
  }
  y += 10;

  // Dificultades
  const dificultades = dificultadesComoLista(plan.dificultades);
  pagina.texto(MARGEN, y, "Dificultades identificadas", { tamanio: 11.5, negrita: true, color: CRIMSON });
  y += 16;
  if (dificultades.length === 0) {
    pagina.texto(MARGEN, y, "No se registraron dificultades.", { tamanio: 9.5, color: GRIS });
    y += 14;
  }
  for (const d of dificultades) {
    const lineas = ajustarTexto(d, ANCHO - MARGEN * 2 - 14, 9.5);
    if (y + lineas.length * INTERLINEA > limite) nuevaPagina();
    pagina.texto(MARGEN, y, "-", { tamanio: 9.5 });
    lineas.forEach((l, i) => pagina.texto(MARGEN + 12, y + i * INTERLINEA, l, { tamanio: 9.5 }));
    y += lineas.length * INTERLINEA + 3;
  }
  y += 12;

  // Tabla de recursos
  if (y + 60 > limite) nuevaPagina();
  pagina.texto(MARGEN, y, "Recursos recomendados", { tamanio: 11.5, negrita: true, color: CRIMSON });
  y += 12;
  y = dibujarCabeceraTabla(pagina, y);

  const recursos = Array.isArray(plan.recursos) ? plan.recursos : [];
  if (recursos.length === 0) {
    pagina.texto(MARGEN + 6, y + 16, "El tutor no recomendó recursos en esta tutoría.", { tamanio: 9.5, color: GRIS });
    pagina.linea(MARGEN, y + 24, ANCHO - MARGEN, y + 24, GRIS, 0.4);
  }
  for (const r of recursos) {
    const celdas = [r.nombre, r.tipo, r.descripcion].map((t, i) =>
      ajustarTexto(t, COLUMNAS[i].ancho - 12, TAM_CELDA, i === 0)
    );
    const filas = Math.max(...celdas.map((c) => c.length));
    const alto = filas * INTERLINEA + 10;
    if (y + alto > limite) {
      nuevaPagina();
      y = dibujarCabeceraTabla(pagina, y);
    }
    let x = MARGEN;
    celdas.forEach((lineas, i) => {
      lineas.forEach((l, k) => pagina.texto(x + 6, y + 14 + k * INTERLINEA, l, { tamanio: TAM_CELDA, negrita: i === 0 }));
      x += COLUMNAS[i].ancho;
    });
    pagina.linea(MARGEN, y + alto, ANCHO - MARGEN, y + alto, GRIS, 0.4);
    y += alto;
  }

  paginas.forEach((p, i) => dibujarPie(p, plan, i + 1, paginas.length, opciones.nombrePlataforma));
  return paginas;
}

function ensamblar(paginas) {
  // Objetos: 1 catálogo, 2 árbol de páginas, 3 y 4 fuentes, luego (página, contenido) por cada página.
  const objetos = [];
  const idsPagina = paginas.map((_, i) => 5 + i * 2);
  objetos[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objetos[2] = `<< /Type /Pages /Kids [${idsPagina.map((id) => `${id} 0 R`).join(" ")}] /Count ${paginas.length} >>`;
  objetos[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objetos[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
  paginas.forEach((pagina, i) => {
    const flujo = pagina.contenido();
    objetos[5 + i * 2] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(ANCHO)} ${num(ALTO)}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + i * 2} 0 R >>`;
    objetos[6 + i * 2] = `<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`;
  });

  let salida = "%PDF-1.4\n";
  const posiciones = [];
  for (let id = 1; id < objetos.length; id++) {
    posiciones[id] = salida.length;
    salida += `${id} 0 obj\n${objetos[id]}\nendobj\n`;
  }
  const inicioXref = salida.length;
  salida += `xref\n0 ${objetos.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objetos.length; id++) {
    salida += `${String(posiciones[id]).padStart(10, "0")} 00000 n \n`;
  }
  salida += `trailer\n<< /Size ${objetos.length} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`;

  // Todo el contenido es Latin-1, así que 1 carácter = 1 byte.
  const bytes = new Uint8Array(salida.length);
  for (let i = 0; i < salida.length; i++) bytes[i] = salida.charCodeAt(i) & 0xff;
  return bytes;
}

/**
 * @param {object} plan  { tutorNombre, especialidad, identificacion, estudianteNombre?, materia?,
 *                         fecha?, dificultades, recursos: [{ nombre, tipo, descripcion }] }
 * @param {object} [opciones] { nombrePlataforma, telefono, fechaEmision: Date }
 * @returns {Uint8Array} bytes del PDF
 */
export function construirConstanciaPdf(plan, opciones = {}) {
  const datos = {
    nombrePlataforma: opciones.nombrePlataforma ?? "EduConnect",
    telefono: opciones.telefono ?? "No disponible",
    fechaEmision: formatearFecha(opciones.fechaEmision ?? new Date()),
  };
  return ensamblar(maquetar(plan ?? {}, datos));
}
