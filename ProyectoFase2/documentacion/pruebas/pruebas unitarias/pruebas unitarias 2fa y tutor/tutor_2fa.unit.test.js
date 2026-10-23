/**
 * Pruebas Unitarias del Backend (Jest)
 * 
 * Descripción de la suite:
 * Pruebas sobre el funcionamiento de la verificación de dos pasos,
 * sobre planificar una sesión siendo tutor y cancelar sesión como tutor.
 * 
 * 5 Casos de Prueba Unitarios:
 * 1. Verificación de dos pasos (2FA) - Rechazo con 401 si el código TOTP es inválido o ha expirado
 * 2. Verificación de dos pasos (2FA) - Autenticación exitosa y generación de JWT con código TOTP válido
 * 3. Planificar horario de atención del tutor - Detección de conflicto (409) con sesiones activas fuera del rango
 * 4. Planificar sesión siendo tutor - Atención de sesión con registro estructurado del plan de estudio (200)
 * 5. Cancelar sesión como tutor - Cancelación de tutoría con notificación por correo al estudiante (200)
 */

// Mocks de base de datos, servicios externos y modelos
const mockSql = jest.fn();
mockSql.query = jest.fn();
mockSql.pool = {};
jest.mock('../../../server/src/config/db', () => mockSql);

jest.mock('../../../server/src/utils/twoFactor', () => ({
  generateSecret: jest.fn(() => 'FAKESECRET'),
  encryptSecret: jest.fn(() => 'iv:tag:enc'),
  decryptSecret: jest.fn(() => 'FAKESECRET'),
  generateQrDataUrl: jest.fn().mockResolvedValue('data:image/png;base64,fake'),
  verifyTotp: jest.fn(),
}));

jest.mock('../../../server/src/models/schedule', () => ({
  findhorarioByTutorId: jest.fn(),
  findConflictingSessions: jest.fn(),
  upsert: jest.fn(),
}));

jest.mock('../../../server/src/models/session', () => ({
  findSessionByIdAndTutorId: jest.fn(),
  markAttended: jest.fn(),
  markCancelledByTutor: jest.fn(),
  findHistoryByTutor: jest.fn(),
  findSessionDetailByIdAndTutorId: jest.fn(),
}));

jest.mock('../../../server/src/services/email', () => ({
  sendCancellationEmail: jest.fn().mockResolvedValue({ success: true }),
  sendApprovalEmail: jest.fn().mockResolvedValue(undefined),
  sendDeactivationEmail: jest.fn().mockResolvedValue(undefined),
}));

const { verify2fa } = require('../../../server/src/controllers/admin');
const {
  upsertSchedule,
  attendSession,
  cancelSession,
} = require('../../../server/src/controllers/tutor.controller');

const { verifyTotp } = require('../../../server/src/utils/twoFactor');
const scheduleModel = require('../../../server/src/models/schedule');
const sessionModel = require('../../../server/src/models/session');
const { sendCancellationEmail } = require('../../../server/src/services/email');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Pruebas sobre el funcionamiento de la verificación de dos pasos, sobre planificar una sesión siendo tutor y cancelar sesión como tutor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // Caso 1: 2FA - Código inválido
  // -------------------------------------------------------------------------
  test('1. Debe rechazar la verificación 2FA con código 401 si el código TOTP es inválido o ha expirado', async () => {
    const req = {
      body: {
        adminId: 1,
        token: '000000',
      },
    };
    const res = mockRes();

    // Mock de consulta del administrador en base de datos
    mockSql.mockResolvedValueOnce([
      {
        id_administrador: 1,
        nombre_usuario: 'admin',
        two_factor_secret: 'iv:tag:enc',
        two_factor_enable: true,
      },
    ]);

    // Simula fallo en validación TOTP
    verifyTotp.mockReturnValueOnce(false);

    await verify2fa(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Código de verificación inválido o expirado.',
      })
    );
  });

  // -------------------------------------------------------------------------
  // Caso 2: 2FA - Verificación exitosa
  // -------------------------------------------------------------------------
  test('2. Debe autenticar con éxito mediante 2FA y devolver token JWT si el código TOTP es válido', async () => {
    const req = {
      body: {
        adminId: 1,
        token: '123456',
      },
    };
    const res = mockRes();

    // Mock de consulta del administrador en base de datos
    mockSql.mockResolvedValueOnce([
      {
        id_administrador: 1,
        nombre_usuario: 'admin',
        two_factor_secret: 'iv:tag:enc',
        two_factor_enable: true,
      },
    ]);

    // Simula éxito en validación TOTP
    verifyTotp.mockReturnValueOnce(true);

    await verify2fa(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        message: 'Autenticación exitosa',
        token: expect.any(String),
        user: expect.objectContaining({
          id_administrador: 1,
          nombre_usuario: 'admin',
          rol: 'admin',
          two_factor_enable: true,
        }),
      })
    );
  });

  // -------------------------------------------------------------------------
  // Caso 3: Planificar horario de atención del tutor - Conflicto
  // -------------------------------------------------------------------------
  test('3. Debe retornar 409 Conflict al planificar/actualizar horario si existen sesiones en conflicto fuera del nuevo rango', async () => {
    const req = {
      user: { id: 10 },
      body: {
        dias: ['Lunes', 'Miercoles'],
        startTime: '08:00',
        endTime: '12:00',
      },
      query: {},
    };
    const res = mockRes();

    const sesionesConflicto = [
      {
        id: 99,
        materia: 'Física Básica',
        fecha: '2026-10-30',
        hora: '14:00',
      },
    ];

    // Simula detección de sesiones programadas fuera del horario propuesto
    scheduleModel.findConflictingSessions.mockResolvedValueOnce(sesionesConflicto);

    await upsertSchedule(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: expect.stringContaining('tienes sesiones activas o programadas fuera del nuevo rango horario'),
        data: sesionesConflicto,
      })
    );
    expect(scheduleModel.upsert).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Caso 4: Planificar sesión siendo tutor - Registro estructurado del plan
  // -------------------------------------------------------------------------
  test('4. Debe planificar y registrar el plan de estudio estructurado con dificultades y recursos al atender la sesión', async () => {
    const req = {
      user: { id: 10 },
      params: { id: '55' },
      body: {
        dificultades: 'Dificultad con integración por sustitución trigonométrica.',
        recursos: [
          {
            nombre: 'Guía práctica de cálculo',
            tipo: 'Texto',
            descripcion: 'Resolver ejercicios impares de la sección 4.2',
          },
          {
            nombre: 'Video explicativo',
            tipo: 'Video',
            descripcion: 'Ver video del minuto 03:00 al 15:30',
          },
        ],
      },
    };
    const res = mockRes();

    // Simula sesión activa perteneciente al tutor
    sessionModel.findSessionByIdAndTutorId.mockResolvedValueOnce({
      id: 55,
      id_tutor: 10,
      estado: 'Activa',
      materia: 'Cálculo 1',
    });

    const resultadoEsperado = {
      id: 55,
      estado: 'Atendida',
      plan: {
        dificultades: req.body.dificultades,
        recursos: req.body.recursos,
      },
    };

    sessionModel.markAttended.mockResolvedValueOnce(resultadoEsperado);

    await attendSession(req, res);

    expect(sessionModel.findSessionByIdAndTutorId).toHaveBeenCalledWith('55', 10);
    expect(sessionModel.markAttended).toHaveBeenCalledWith('55', 10, {
      difficulties: req.body.dificultades,
      resources: req.body.recursos,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Sesión atendida exitosamente',
      data: resultadoEsperado,
    });
  });

  // -------------------------------------------------------------------------
  // Caso 5: Cancelar sesión como tutor
  // -------------------------------------------------------------------------
  test('5. Debe cancelar la sesión activa como tutor, actualizar estado y enviar notificación por correo al estudiante', async () => {
    const req = {
      user: { id: 10 },
      params: { id: '77' },
    };
    const res = mockRes();

    // Simula sesión activa con datos de estudiante y contacto
    const sesionActiva = {
      id: 77,
      id_tutor: 10,
      estado: 'Activa',
      materia: 'Química General',
      tutor: 'Ing. Carlos Mendoza',
      estudiante: 'María López',
      correoEstudiante: 'maria.lopez@ingenieria.usac.edu.gt',
      fecha: '2026-11-02',
      hora: '10:00',
    };

    sessionModel.findSessionByIdAndTutorId.mockResolvedValueOnce(sesionActiva);
    sessionModel.markCancelledByTutor.mockResolvedValueOnce({
      id: 77,
      estado: 'Cancelada_Tutor',
    });
    sendCancellationEmail.mockResolvedValueOnce({ success: true });

    await cancelSession(req, res);

    expect(sessionModel.findSessionByIdAndTutorId).toHaveBeenCalledWith('77', 10);
    expect(sessionModel.markCancelledByTutor).toHaveBeenCalledWith('77', 10);
    expect(sendCancellationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'maria.lopez@ingenieria.usac.edu.gt',
        tutorName: 'Ing. Carlos Mendoza',
        studentName: 'María López',
        date: '2026-11-02',
        time: '10:00',
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        message: 'Sesión cancelada exitosamente',
        emailSent: true,
      })
    );
  });
});
