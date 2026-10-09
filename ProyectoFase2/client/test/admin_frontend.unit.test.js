const test = require('node:test');
const assert = require('node:assert/strict');

// ─────────────────────────────────────────────────────────────────────────────
// Funciones y Lógicas de Frontend extraídas de los componentes del Administrador
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. Lógica de construcción de URL de streaming para PdfViewerModal.jsx (HU-038 y HU-039)
 */
function construirUrlStreamPdf({ apiBase = 'http://localhost:4000/api', documentoUrl = '', datosUsuario = null, tipoDocumento = 'carnet' }) {
  const tieneUrlValida = typeof documentoUrl === 'string' && documentoUrl.trim().length > 0;
  const rolUsuario = datosUsuario?.rol
    ? datosUsuario.rol
    : tipoDocumento === 'carnet'
    ? 'estudiante'
    : 'tutor';

  let urlStream = '';
  if (tieneUrlValida && (documentoUrl.startsWith('http://') || documentoUrl.startsWith('https://')) && documentoUrl.includes('cloudinary.com')) {
    urlStream = `${apiBase}/admin/documento/stream?url=${encodeURIComponent(documentoUrl.trim())}`;
  } else if (datosUsuario?.id) {
    urlStream = `${apiBase}/admin/documento/stream?id=${datosUsuario.id}&tipo=${rolUsuario}`;
    if (tieneUrlValida) {
      urlStream += `&url=${encodeURIComponent(documentoUrl.trim())}`;
    }
  } else if (tieneUrlValida) {
    urlStream = `${apiBase}/admin/documento/stream?url=${encodeURIComponent(documentoUrl.trim())}`;
  }
  return urlStream;
}

/**
 * 2. Lógica de preparación de datos de edición de perfil protegiendo correo (HU-040 y HU-041)
 */
function prepararPayloadEdicionPerfil(rol, formValues, correoOriginal) {
  // El correo es estrictamente de solo lectura y nunca debe enviarse modificado
  if (rol === 'estudiante') {
    return {
      nombre: (formValues.nombre || '').trim(),
      apellido: (formValues.apellido || '').trim(),
      carnet: (formValues.carnet || '').trim(),
      genero: formValues.genero || 'M',
      telefono: (formValues.telefono || '').trim(),
      direccion: (formValues.direccion || '').trim(),
      fecha_nacimiento: formValues.fecha_nacimiento || '',
      // Correo protegido
      correoBloqueado: true,
      correoEfectivo: correoOriginal,
    };
  } else {
    return {
      nombre: (formValues.nombre || '').trim(),
      apellido: (formValues.apellido || '').trim(),
      carnet_id: (formValues.carnet_id || '').trim(),
      numero_identificacion_tutor: (formValues.numero_identificacion_tutor || '').trim(),
      genero: formValues.genero || 'M',
      telefono: (formValues.telefono || '').trim(),
      direccion: (formValues.direccion || '').trim(),
      fecha_nacimiento: formValues.fecha_nacimiento || '',
      universidad_graduacion: (formValues.universidad_graduacion || '').trim(),
      especialidad: (formValues.especialidad || '').trim(),
      direccion_tutoria: (formValues.direccion_tutoria || 'Online').trim(),
      correoBloqueado: true,
      correoEfectivo: correoOriginal,
    };
  }
}

/**
 * 3. Lógica del componente RatingStars en reportes/page.jsx (HU-044 y HU-045)
 */
function calcularEstrellasRating(promedio) {
  const num = Number(promedio) || 0;
  const estrellasLlenas = Math.min(5, Math.max(0, Math.round(num)));
  const textoPuntuacion = num > 0 ? num.toFixed(1) : '0.0';

  return {
    estrellasLlenas,
    estrellasVacias: 5 - estrellasLlenas,
    textoFormateado: `${textoPuntuacion} / 5.0`,
    esExcelente: num >= 4.5,
  };
}

/**
 * 4. Lógica de filtrado por pestañas en solicitudes/page.jsx y usuarios/page.jsx (HU-005 y HU-038)
 */
function filtrarColeccionPorRol(elementos, rolSeleccionado) {
  if (!Array.isArray(elementos)) return [];
  return elementos.filter((item) => {
    const rolItem = item.tipo_usuario || item.rol || (item.id_tutor ? 'tutor' : 'estudiante');
    return rolItem === rolSeleccionado;
  });
}

/**
 * 5. Lógica del helper darDeBaja en lib/api/admin.js (HU-040 y HU-041)
 */
function resolverEndpointBaja(id, rol, motivo) {
  if (!id) throw new Error('ID requerido');
  if (rol === 'estudiante') {
    return {
      endpoint: `/admin/students/${id}/deactivate`,
      method: 'PUT',
      body: { motivo: motivo || 'Baja administrativa' },
    };
  }
  if (rol === 'tutor') {
    return {
      endpoint: `/admin/tutors/${id}/deactivate`,
      method: 'PUT',
      body: { motivo: motivo || 'Baja administrativa' },
    };
  }
  return {
    endpoint: `/admin/usuarios/${id}/dar-de-baja`,
    method: 'PATCH',
    body: { rol, motivo },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Ejecución de la Suite de Pruebas Unitarias del Frontend
// ─────────────────────────────────────────────────────────────────────────────

test('Suite Pruebas Unitarias - Frontend Administrador (Fase 2)', async (t) => {
  // CP-FE-01
  await t.test('CP-FE-01 [HU-038 / HU-039]: Visor PDF debe generar la URL de streaming segura para carnet y CV', () => {
    const configEstudiante = {
      apiBase: 'http://localhost:4000/api',
      documentoUrl: '/uploads/carnet_2023.pdf',
      datosUsuario: { id: 101, rol: 'estudiante' },
      tipoDocumento: 'carnet',
    };

    const urlEstudiante = construirUrlStreamPdf(configEstudiante);
    assert.equal(
      urlEstudiante,
      'http://localhost:4000/api/admin/documento/stream?id=101&tipo=estudiante&url=%2Fuploads%2Fcarnet_2023.pdf'
    );

    const configCloudinary = {
      apiBase: 'http://localhost:4000/api',
      documentoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/cv.pdf',
      datosUsuario: { id: 202, rol: 'tutor' },
      tipoDocumento: 'cv',
    };

    const urlCloudinary = construirUrlStreamPdf(configCloudinary);
    assert.ok(urlCloudinary.startsWith('http://localhost:4000/api/admin/documento/stream?url='));
  });

  // CP-FE-02
  await t.test('CP-FE-02 [HU-040 / HU-041]: Formulario de edición debe proteger el correo manteniéndolo bloqueado', () => {
    const formInput = {
      nombre: '  Ana María  ',
      apellido: 'López Gómez',
      telefono: '5555-1234',
      correo: 'correo_hacker@malicioso.com', // Intento de alteración
    };
    const correoOriginal = 'ana.lopez@ingenieria.usac.edu.gt';

    const payloadEstudiante = prepararPayloadEdicionPerfil('estudiante', formInput, correoOriginal);

    assert.equal(payloadEstudiante.nombre, 'Ana María');
    assert.equal(payloadEstudiante.telefono, '5555-1234');
    assert.equal(payloadEstudiante.correoBloqueado, true);
    assert.equal(payloadEstudiante.correoEfectivo, 'ana.lopez@ingenieria.usac.edu.gt');
  });

  // CP-FE-03
  await t.test('CP-FE-03 [HU-044 / HU-045]: RatingStars debe calcular estrellas activas y formato a 1 decimal', () => {
    const resultadoAlto = calcularEstrellasRating(4.84);
    assert.equal(resultadoAlto.estrellasLlenas, 5);
    assert.equal(resultadoAlto.estrellasVacias, 0);
    assert.equal(resultadoAlto.textoFormateado, '4.8 / 5.0');
    assert.equal(resultadoAlto.esExcelente, true);

    const resultadoMedio = calcularEstrellasRating(3.2);
    assert.equal(resultadoMedio.estrellasLlenas, 3);
    assert.equal(resultadoMedio.estrellasVacias, 2);
    assert.equal(resultadoMedio.textoFormateado, '3.2 / 5.0');
    assert.equal(resultadoMedio.esExcelente, false);
  });

  // CP-FE-04
  await t.test('CP-FE-04 [HU-005 / HU-038]: Filtrado por pestañas debe segregar solicitudes de estudiantes y tutores', () => {
    const solicitudesMixtas = [
      { id: 1, nombre: 'Juan Estudiante', tipo_usuario: 'estudiante' },
      { id: 2, nombre: 'María Tutora', tipo_usuario: 'tutor' },
      { id: 3, nombre: 'Pedro Estudiante', tipo_usuario: 'estudiante' },
    ];

    const soloEstudiantes = filtrarColeccionPorRol(solicitudesMixtas, 'estudiante');
    assert.equal(soloEstudiantes.length, 2);
    assert.ok(soloEstudiantes.every((s) => s.tipo_usuario === 'estudiante'));

    const soloTutores = filtrarColeccionPorRol(solicitudesMixtas, 'tutor');
    assert.equal(soloTutores.length, 1);
    assert.equal(soloTutores[0].nombre, 'María Tutora');
  });

  // CP-FE-05
  await t.test('CP-FE-05 [HU-040 / HU-041]: Helper darDeBaja debe enrutar al endpoint exacto según el rol', () => {
    const estudianteBaja = resolverEndpointBaja(15, 'estudiante', 'Incumplimiento de normas');
    assert.equal(estudianteBaja.endpoint, '/admin/students/15/deactivate');
    assert.equal(estudianteBaja.method, 'PUT');
    assert.equal(estudianteBaja.body.motivo, 'Incumplimiento de normas');

    const tutorBaja = resolverEndpointBaja(30, 'tutor', 'Inasistencias reiteradas');
    assert.equal(tutorBaja.endpoint, '/admin/tutors/30/deactivate');
    assert.equal(tutorBaja.method, 'PUT');
    assert.equal(tutorBaja.body.motivo, 'Inasistencias reiteradas');
  });
});
