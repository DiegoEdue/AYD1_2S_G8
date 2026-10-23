/**
 * Pruebas Unitarias — Controlador Admin
 * HU-040: Gestión de Estudiantes Activos
 * HU-041: Gestión de Tutores Activos
 * HU-042: Inspección de Reportes contra Tutores
 * HU-043: Inspección de Reportes contra Estudiantes
 * HU-044: Reporte de Calificaciones de Tutores
 * HU-045: Reporte de Calificaciones de Estudiantes
 * HU-046: Reportes Analíticos Generales
 *
 * Framework: Jest  |  Ejecutar: npm run test:unit
 */

// ── Mocks globales ────────────────────────────────────────────────────────────
// IMPORTANTE: jest.mock con factory evita que Node cargue el archivo real de db.js
// (que haría require('postgres') y fallaría porque el paquete no está instalado en dev).
// Este es el mismo patrón que usa student-feedback.unit.test.js.
jest.mock('../../../src/config/db', () => {
  const mockQuery = jest.fn();
  const mockDb = jest.fn();
  mockDb.query = mockQuery;
  mockDb.pool = {};
  return mockDb;
});
jest.mock('../../../src/services/email', () => ({
  sendApprovalEmail: jest.fn().mockResolvedValue(undefined),
  sendDeactivationEmail: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../../src/config/cloudinary', () => ({
  url: jest.fn(() => 'https://signed.cloudinary.url/doc.pdf'),
}));
jest.mock('../../../src/utils/twoFactor', () => ({
  generateSecret: jest.fn(() => 'FAKESECRET'),
  encryptSecret: jest.fn(() => 'iv:tag:enc'),
  decryptSecret: jest.fn(() => 'FAKESECRET'),
  generateQrDataUrl: jest.fn().mockResolvedValue('data:image/png;base64,fake'),
  verifyTotp: jest.fn(() => false),
}));

const db = require('../../../src/config/db');
const { sendDeactivationEmail } = require('../../../src/services/email');

const {
  getApprovedStudents,
  updateStudentAdmin,
  deactivateStudent,
  getApprovedTutors,
  updateTutorAdmin,
  deactivateTutor,
  getDenuncias,
  resolverDenuncia,
  getTutorRatings,
  getStudentRatings,
  getReports,
} = require('../../../src/controllers/admin');

/** Helper: objeto res de Express simulado con jest.fn() */
const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-040 — getApprovedStudents
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-040 — getApprovedStudents', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 200 y la lista completa de estudiantes aprobados', async () => {
    const filas = [
      { id_estudiante: 1, nombre: 'Ana', apellido: 'López', correo: 'ana@mail.com', estado_aprobacion: 'aprobado' },
      { id_estudiante: 2, nombre: 'Luis', apellido: 'García', correo: 'luis@mail.com', estado_aprobacion: 'aprobado' },
    ];
    db.query.mockResolvedValueOnce({ rows: filas });

    const res = mockRes();
    await getApprovedStudents({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', count: 2, data: filas });
  });

  test('devuelve 200 con lista vacía si no hay estudiantes aprobados', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = mockRes();
    await getApprovedStudents({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', count: 0, data: [] });
  });

  test('devuelve 500 si la base de datos lanza un error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.query.mockRejectedValueOnce(new Error('DB timeout'));

    const res = mockRes();
    await getApprovedStudents({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-040 — updateStudentAdmin
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-040 — updateStudentAdmin', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 404 si el estudiante no existe en la BD', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: '999' }, body: { nombre: 'Nuevo' } };
    const res = mockRes();
    await updateStudentAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: 'Estudiante no encontrado.' })
    );
  });

  test('actualiza el estudiante y devuelve 200 con los datos actualizados', async () => {
    const estudianteActualizado = {
      id_estudiante: 5, nombre: 'Carlos', apellido: 'Pérez', carnet: '2021001',
      genero: 'Masculino', direccion: 'Zona 1', telefono: '55551234',
      fecha_nacimiento: '2000-01-01', correo: 'carlos@mail.com',
      foto_url: null, estado_aprobacion: 'aprobado',
    };
    db.query
      .mockResolvedValueOnce({ rows: [{ id_estudiante: 5 }] })
      .mockResolvedValueOnce({ rows: [estudianteActualizado] });

    const req = { params: { id: '5' }, body: { nombre: 'Carlos', apellido: 'Pérez' } };
    const res = mockRes();
    await updateStudentAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Estudiante actualizado exitosamente.',
      data: estudianteActualizado,
    });
  });

  test('el correo NO se incluye en el UPDATE — campo bloqueado por la HU', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id_estudiante: 5 }] })
      .mockResolvedValueOnce({ rows: [{ id_estudiante: 5, nombre: 'Test' }] });

    const req = {
      params: { id: '5' },
      body: { nombre: 'Test', correo: 'hackeado@mail.com' },
    };
    const res = mockRes();
    await updateStudentAdmin(req, res);

    const updateSql = db.query.mock.calls[1][0];
    expect(updateSql).not.toMatch(/correo\s*=/);
  });

  test('devuelve 500 si la BD falla durante el UPDATE', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.query
      .mockResolvedValueOnce({ rows: [{ id_estudiante: 5 }] })
      .mockRejectedValueOnce(new Error('constraint violation'));

    const req = { params: { id: '5' }, body: { nombre: 'Test' } };
    const res = mockRes();
    await updateStudentAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-040 — deactivateStudent
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-040 — deactivateStudent', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 404 si el estudiante no existe', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: '99' }, body: {} };
    const res = mockRes();
    await deactivateStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Estudiante no encontrado.' })
    );
  });

  test('da de baja al estudiante: elimina registros, devuelve 200 y envía correo', async () => {
    const estudiante = { id_estudiante: 7, nombre: 'Sofía', apellido: 'Ramírez', correo: 'sofia@mail.com' };
    db.query.mockResolvedValue({ rows: [estudiante], rowCount: 1 });

    const req = { params: { id: '7' }, body: { motivo: 'Conducta inapropiada' } };
    const res = mockRes();
    await deactivateStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      data: expect.objectContaining({
        id_estudiante: 7,
        estado_aprobacion: 'baja',
        motivo: 'Conducta inapropiada',
      }),
    }));
    expect(sendDeactivationEmail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'sofia@mail.com',
      role: 'Estudiante',
    }));
  });

  test('usa el motivo por defecto si no se envía ninguno', async () => {
    db.query.mockResolvedValue({
      rows: [{ id_estudiante: 8, nombre: 'Pedro', apellido: 'Ruiz', correo: 'p@mail.com' }],
      rowCount: 1,
    });

    const req = { params: { id: '8' }, body: {} };
    const res = mockRes();
    await deactivateStudent(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ motivo: 'No especificado' }) })
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-041 — getApprovedTutors
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-041 — getApprovedTutors', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 200 y la lista de tutores con especialidad y materias', async () => {
    const tutores = [
      { id_tutor: 1, nombre: 'Juan', apellido: 'Pérez', especialidad: 'Matemáticas', materias: [], estado_aprobacion: 'aprobado' },
    ];
    db.query.mockResolvedValueOnce({ rows: tutores });

    const res = mockRes();
    await getApprovedTutors({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', count: 1, data: tutores });
  });

  test('devuelve 500 si la BD falla', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.query.mockRejectedValueOnce(new Error('connection refused'));

    const res = mockRes();
    await getApprovedTutors({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-041 — updateTutorAdmin
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-041 — updateTutorAdmin', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 404 si el tutor no existe', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: '888' }, body: { nombre: 'Test' } };
    const res = mockRes();
    await updateTutorAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Tutor no encontrado.' })
    );
  });

  test('actualiza el tutor y devuelve 200 con los datos actualizados', async () => {
    const tutorActualizado = { id_tutor: 2, nombre: 'María', apellido: 'Cruz', correo: 'm@mail.com' };
    db.query
      .mockResolvedValueOnce({ rows: [{ id_tutor: 2 }] })
      .mockResolvedValueOnce({ rows: [tutorActualizado] });

    const req = { params: { id: '2' }, body: { nombre: 'María' } };
    const res = mockRes();
    await updateTutorAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Tutor actualizado exitosamente.',
      data: tutorActualizado,
    });
  });

  test('sincroniza materias: borra las anteriores e inserta las nuevas', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id_tutor: 3 }] })
      .mockResolvedValueOnce({ rows: [{ id_tutor: 3 }] })
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [{ id_materia: 10 }] })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 });

    const req = { params: { id: '3' }, body: { nombre: 'Roberto', materias: ['Álgebra'] } };
    const res = mockRes();
    await updateTutorAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(db.query.mock.calls[2][0]).toContain('DELETE FROM tutor_materia');
    expect(db.query.mock.calls[3][0]).toContain('INSERT INTO materia');
  });

  test('el correo NO está en los parámetros del UPDATE del tutor', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id_tutor: 4 }] })
      .mockResolvedValueOnce({ rows: [{ id_tutor: 4 }] });

    const req = { params: { id: '4' }, body: { nombre: 'Test', correo: 'intento@hack.com' } };
    const res = mockRes();
    await updateTutorAdmin(req, res);

    const updateSql = db.query.mock.calls[1][0];
    expect(updateSql).not.toMatch(/correo\s*=/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-041 — deactivateTutor
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-041 — deactivateTutor', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 404 si el tutor no existe', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: '77' }, body: {} };
    const res = mockRes();
    await deactivateTutor(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Tutor no encontrado.' })
    );
  });

  test('da de baja al tutor: 1 SELECT + 8 DELETE, devuelve 200 y envía correo', async () => {
    const tutor = { id_tutor: 6, nombre: 'Andrés', apellido: 'Solís', correo: 'a@mail.com' };
    db.query.mockResolvedValue({ rows: [tutor], rowCount: 1 });

    const req = { params: { id: '6' }, body: { motivo: 'Incumplimiento' } };
    const res = mockRes();
    await deactivateTutor(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      data: expect.objectContaining({ id_tutor: 6, estado_aprobacion: 'baja' }),
    }));
    expect(db.query).toHaveBeenCalledTimes(10); // 1 SELECT + 9 DELETE
    expect(sendDeactivationEmail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'a@mail.com',
      role: 'Tutor',
      reason: 'Incumplimiento',
    }));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-042 & HU-043 — getDenuncias
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-042 & HU-043 — getDenuncias', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 400 si el tipo es inválido', async () => {
    const req = { query: { tipo: 'empleados' } };
    const res = mockRes();
    await getDenuncias(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(db.query).not.toHaveBeenCalled();
  });

  test('tipo=tutores consulta tutor_reports y devuelve 200', async () => {
    const denuncias = [{
      id: 1, tipo: 'tutor', categoria: 'Negligencia académica',
      motivo: 'No explicó', denunciado_nombre: 'Juan Pérez',
      denunciante_nombre: 'Ana López', fecha: '2026-10-01', estado: 'pendiente',
    }];
    db.query.mockResolvedValueOnce({ rows: denuncias });

    const req = { query: { tipo: 'tutores' } };
    const res = mockRes();
    await getDenuncias(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: denuncias });
    expect(db.query.mock.calls[0][0]).toContain('tutor_reports');
  });

  test('tipo=estudiantes consulta student_reports y devuelve 200', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const req = { query: { tipo: 'estudiantes' } };
    const res = mockRes();
    await getDenuncias(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(db.query.mock.calls[0][0]).toContain('student_reports');
  });

  test('sin parámetro tipo usa "tutores" como valor por defecto', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const req = { query: {} };
    const res = mockRes();
    await getDenuncias(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(db.query.mock.calls[0][0]).toContain('tutor_reports');
  });

  test('devuelve 500 si la BD falla', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.query.mockRejectedValueOnce(new Error('timeout'));

    const req = { query: { tipo: 'tutores' } };
    const res = mockRes();
    await getDenuncias(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-042 & HU-043 — resolverDenuncia
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-042 & HU-043 — resolverDenuncia', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 400 si el ID no es un entero positivo', async () => {
    const req = { params: { id: 'abc' }, body: { tipo: 'tutores', accion: 'descartar' }, query: {} };
    const res = mockRes();
    await resolverDenuncia(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'ID de denuncia inválido.' })
    );
  });

  test('devuelve 400 si falta el tipo de denuncia', async () => {
    const req = { params: { id: '1' }, body: { accion: 'descartar' }, query: {} };
    const res = mockRes();
    await resolverDenuncia(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('devuelve 400 si la acción no es válida', async () => {
    const req = { params: { id: '1' }, body: { tipo: 'tutores', accion: 'archivar' }, query: {} };
    const res = mockRes();
    await resolverDenuncia(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('dar_de_baja') })
    );
  });

  test('devuelve 404 si la denuncia no existe', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: '99' }, body: { tipo: 'tutores', accion: 'descartar' }, query: {} };
    const res = mockRes();
    await resolverDenuncia(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Denuncia no encontrada.' })
    );
  });

  test('devuelve 409 si la denuncia ya fue resuelta', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id_reporte: 1, id_acusado: 5, categoria: 'Otro', estado: 'Resuelto' }],
    });

    const req = { params: { id: '1' }, body: { tipo: 'tutores', accion: 'descartar' }, query: {} };
    const res = mockRes();
    await resolverDenuncia(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Esta denuncia ya fue resuelta.' })
    );
  });

  test('rechazar denuncia: marca estado=Descartado y devuelve 200', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id_reporte: 2, id_acusado: 6, categoria: 'Cobros indebidos', estado: 'Pendiente' }] })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 });

    const req = {
      params: { id: '2' },
      body: { tipo: 'tutores', accion: 'rechazar_denuncia', motivo: 'Sin evidencia' },
      query: {},
    };
    const res = mockRes();
    await resolverDenuncia(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Denuncia descartada exitosamente.' })
    );
    const updateCall = db.query.mock.calls[1];
    expect(updateCall[1][0]).toBe('Descartado');
    expect(updateCall[1][1]).toBe('Sin evidencia');
  });

  test('dar de baja por denuncia: llama deactivateTutor y marca Resuelto', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ id_reporte: 3, id_acusado: 10, categoria: 'Acoso o intimidación', estado: 'Pendiente' }] })
      .mockResolvedValueOnce({ rows: [{ id_tutor: 10, nombre: 'X', apellido: 'Y', correo: 'x@mail.com' }] })
      .mockResolvedValue({ rows: [], rowCount: 1 });

    const req = {
      params: { id: '3' },
      body: { tipo: 'tutores', accion: 'dar_de_baja' },
      query: {},
    };
    const res = mockRes();
    await resolverDenuncia(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Usuario dado de baja exitosamente.' })
    );
    const lastCall = db.query.mock.calls[db.query.mock.calls.length - 1];
    expect(lastCall[1][0]).toBe('Resuelto');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-044 — getTutorRatings
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-044 — getTutorRatings', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 200 con la lista de tutores y sus promedios de calificación', async () => {
    const ratings = [
      { id_tutor: 1, nombre_completo: 'Juan Pérez', especialidad: 'Matemáticas', total_sesiones: 15, total_evaluaciones: 10, promedio_estrellas: '4.5' },
      { id_tutor: 2, nombre_completo: 'María Cruz', especialidad: 'Física', total_sesiones: 8, total_evaluaciones: 5, promedio_estrellas: '3.0' },
    ];
    db.query.mockResolvedValueOnce({ rows: ratings });

    const res = mockRes();
    await getTutorRatings({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: ratings });
  });

  test('la query filtra únicamente tutores con estado_aprobacion = aprobado', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    await getTutorRatings({}, mockRes());
    expect(db.query.mock.calls[0][0]).toContain("estado_aprobacion = 'aprobado'");
  });

  test('la query usa AVG(estrellas) para calcular el promedio', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    await getTutorRatings({}, mockRes());
    expect(db.query.mock.calls[0][0]).toContain('AVG');
  });

  test('devuelve 500 si la BD falla', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.query.mockRejectedValueOnce(new Error('query error'));

    const res = mockRes();
    await getTutorRatings({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-045 — getStudentRatings
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-045 — getStudentRatings', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 200 con la lista de estudiantes y sus promedios de calificación', async () => {
    const ratings = [
      { id_estudiante: 1, nombre_completo: 'Ana López', carnet: '2021001', total_sesiones: 5, total_evaluaciones: 3, promedio_estrellas: '4.0' },
    ];
    db.query.mockResolvedValueOnce({ rows: ratings });

    const res = mockRes();
    await getStudentRatings({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: ratings });
  });

  test('la query filtra únicamente estudiantes aprobados', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    await getStudentRatings({}, mockRes());
    expect(db.query.mock.calls[0][0]).toContain("estado_aprobacion = 'aprobado'");
  });

  test('la query usa AVG(estrellas) para calcular el promedio', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    await getStudentRatings({}, mockRes());
    expect(db.query.mock.calls[0][0]).toContain('AVG');
  });

  test('devuelve 500 si la BD falla', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.query.mockRejectedValueOnce(new Error('error interno'));

    const res = mockRes();
    await getStudentRatings({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HU-046 — getReports
// ═══════════════════════════════════════════════════════════════════════════════
describe('HU-046 — getReports', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve 200 con todos los campos del reporte analítico', async () => {
    db.query.mockResolvedValue({ rows: [] });

    const res = mockRes();
    await getReports({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;
    expect(data).toHaveProperty('totales');
    expect(data).toHaveProperty('porEstado');
    expect(data).toHaveProperty('porMateria');
    expect(data).toHaveProperty('porTutor');
    expect(data).toHaveProperty('cancelacionesPorMateria');
    expect(data).toHaveProperty('horariosDemandados');
  });

  test('ejecuta exactamente 6 queries en paralelo (Promise.all)', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await getReports({}, mockRes());
    expect(db.query).toHaveBeenCalledTimes(6);
  });

  test('la query de cancelaciones usa LIKE Cancelada% para todos los tipos', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await getReports({}, mockRes());
    // 5ª query (índice 4) es cancelacionesPorMateria
    expect(db.query.mock.calls[4][0]).toContain("LIKE 'Cancelada%'");
  });

  test('devuelve 500 si cualquiera de las queries falla', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    db.query.mockRejectedValue(new Error('DB unavailable'));

    const res = mockRes();
    await getReports({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: 'Error interno al generar reportes.' })
    );
  });
});
