const { registerStudent } = require("../src/controllers/registro.estudiante.js");
const sql = require("../src/config/db.js");
const bcrypt = require("bcryptjs");
const { subirImagen, subirArchivo } = require("../src/utils/cloudinaryUpload.js");
const { sendVerificationEmail } = require("../src/services/email.js");

// Helper para crear mock de sql que soporte tagged template literals
const createSqlMock = () => {
  const mockFn = jest.fn();
  mockFn.begin = jest.fn();
  // Hacerlo invocable como tagged template literal: sql`SELECT...`
  const handler = (...args) => mockFn(...args);
  handler.begin = mockFn.begin;
  // Exponer el mock interno para poder configurar respuestas
  handler._mock = mockFn;
  return handler;
};

// Mocks de dependencias externas
jest.mock("../src/config/db.js", () => createSqlMock());
jest.mock("bcryptjs");
jest.mock("../src/utils/cloudinaryUpload.js");
jest.mock("../src/services/email.js");

describe("Pruebas Unitarias para el registro de estudiantes (HU-001, HU-028)", () => {
  let req, res;

  const validStudentData = {
    nombre: "Jasson",
    apellido: "Lopez",
    carnet: "202102688",
    genero: "Masculino",
    direccion: "Guatemala City",
    telefono: "50581180",
    fecha_nacimiento: "2000-01-01",
    foto_url: "data:image/png;base64,fakeimage",
    carnet_pdf_url: "data:application/pdf;base64,fakepdf",
    correo: "jasson@test.com",
    password: "Jasson123456",
  };

  const mockStudentInsert = {
    id_estudiante: 1,
    nombre: "Jasson",
    apellido: "Lopez",
    carnet: "202102688",
    correo: "jasson@test.com",
  };
  const mockSolicitudInsert = { id_solicitud: 10, estado: "pendiente" };

  beforeEach(() => {
    jest.clearAllMocks();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Configuración por defecto para uploads exitosos
    subirImagen.mockResolvedValue("https://cloudinary.com/estudiantes/foto.jpg");
    subirArchivo.mockResolvedValue("https://cloudinary.com/carnets/carnet.pdf");
    sendVerificationEmail.mockResolvedValue({ success: true });
  });

  // Helper para simular sql.begin con transacción exitosa
  const mockBeginSuccess = () => {
    sql.begin.mockImplementation(async (callback) => {
      const tx = createSqlMock();
      tx._mock.mockResolvedValueOnce([mockStudentInsert]);
      tx._mock.mockResolvedValueOnce([mockSolicitudInsert]);
      return await callback(tx);
    });
  };

  // Helper para simular que no hay duplicados (email + carnet)
  const mockNoDuplicates = () => {
    sql._mock.mockResolvedValueOnce([]); // email check
    sql._mock.mockResolvedValueOnce([]); // carnet check
  };

  test("Prueba 1: Retornar status 400 si faltan los campos obligatorios en el body", async () => {
    req = { body: { nombre: "Jasson" } };

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos son obligatorios",
    });
  });

  test("Prueba 2: Debe retornar status 400 si la contraseña no cumple con los requisitos (mín 8 chars, letra, número)", async () => {
    req = { body: { ...validStudentData, password: "123" } };

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número",
    });
  });

  test("Prueba 3: Debe retornar status 400 si el correo electrónico tiene formato inválido", async () => {
    req = { body: { ...validStudentData, correo: "correo-invalido" } };

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Correo electrónico inválido",
    });
  });

  test("Prueba 4: Debe retornar 400 si falta la fotografía (obligatoria HU-028)", async () => {
    const { foto_url, ...dataSinFoto } = validStudentData;
    req = { body: dataSinFoto };

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "La fotografía es obligatoria",
    });
  });

  test("Prueba 5: Debe retornar 400 si falta el carnet escaneado en PDF (obligatorio HU-028)", async () => {
    const { carnet_pdf_url, carnet_pdf, ...dataSinCarnet } = validStudentData;
    req = { body: dataSinCarnet };

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El carnet escaneado en PDF es obligatorio",
    });
  });

  test("Prueba 6: Debe retornar 400 si el correo ya existe en la base de datos", async () => {
    req = { body: validStudentData };
    sql._mock.mockResolvedValueOnce([{ exists: 1 }]); // email ya existe

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El correo electrónico ya está registrado",
    });
  });

  test("Prueba 7: Debe retornar 400 si el carnet ya existe en la base de datos", async () => {
    req = { body: validStudentData };
    sql._mock.mockResolvedValueOnce([]); // email no existe
    sql._mock.mockResolvedValueOnce([{ exists: 1 }]); // carnet ya existe

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El carnet ya está registrado",
    });
  });

  test("Prueba 8: Debe registrar el estudiante y retornar status 201 (flujo completo exitoso)", async () => {
    req = { body: validStudentData };
    mockNoDuplicates();
    mockBeginSuccess();

    await registerStudent(req, res);

    // Verificar subida de archivos
    expect(subirImagen).toHaveBeenCalledWith(validStudentData.foto_url, "educonnect/estudiantes");
    expect(subirArchivo).toHaveBeenCalledWith(validStudentData.carnet_pdf_url, "educonnect/carnets");

    // Verificar hash de contraseña
    expect(bcrypt.hash).toHaveBeenCalledWith(validStudentData.password, 10);

    // Verificar respuesta
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Estudiante registrado exitosamente. Se ha enviado un código de verificación a su correo.",
      student: mockStudentInsert,
      solicitud: mockSolicitudInsert,
    });

    // Verificar envío de email
    expect(sendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: validStudentData.correo,
        name: "Jasson Lopez",
        token: expect.any(String),
      })
    );
  });

  test("Prueba 9: Debe aceptar carnet_pdf en lugar de carnet_pdf_url (compatibilidad)", async () => {
    const { carnet_pdf_url, ...dataConCarnetPdf } = validStudentData;
    dataConCarnetPdf.carnet_pdf = "data:application/pdf;base64,fakepdf";
    req = { body: dataConCarnetPdf };
    mockNoDuplicates();
    mockBeginSuccess();

    await registerStudent(req, res);

    expect(subirArchivo).toHaveBeenCalledWith(dataConCarnetPdf.carnet_pdf, "educonnect/carnets");
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("Prueba 10: Debe manejar error de constraint UNIQUE (race condition) - código 23505", async () => {
    req = { body: validStudentData };
    mockNoDuplicates();
    mockBeginSuccess();

    // Simular error de BD en el INSERT (constraint unique)
    const error = new Error("duplicate key value violates unique constraint");
    error.code = "23505";
    sql.begin.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El correo o el carnet ya están registrados",
    });

    consoleSpy.mockRestore();
  });

  test("Prueba 11: Debe retornar status 500 cuando ocurre error inesperado en la base de datos", async () => {
    req = { body: validStudentData };
    sql._mock.mockRejectedValueOnce(new Error("Error en la conexión de la base de datos"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al registrar el estudiante",
    });

    consoleSpy.mockRestore();
  });

  test("Prueba 12: Debe generar token de verificación de 6 dígitos y guardarlo en BD", async () => {
    req = { body: validStudentData };
    mockNoDuplicates();

    sql.begin.mockImplementation(async (callback) => {
      const tx = createSqlMock();
      tx._mock.mockImplementation((strings, ...values) => {
        // Capturar el INSERT para verificar verification_token
        const query = strings.join("?");
        if (query.includes("INSERT INTO estudiante")) {
          expect(values).toContainEqual(expect.stringMatching(/^\d{6}$/)); // token de 6 dígitos
        }
        return Promise.resolve([mockStudentInsert]);
      });
      tx._mock.mockResolvedValueOnce([mockSolicitudInsert]);
      return await callback(tx);
    });

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("Prueba 13: Debe enviar email de verificación aunque falle (no bloquea respuesta)", async () => {
    req = { body: validStudentData };
    mockNoDuplicates();
    mockBeginSuccess();

    // Simular fallo en envío de email
    sendVerificationEmail.mockRejectedValueOnce(new Error("SMTP error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await registerStudent(req, res);

    // Debe responder 201 aunque falle el email
    expect(res.status).toHaveBeenCalledWith(201);
    expect(consoleSpy).toHaveBeenCalledWith("Error al enviar correo de verificación:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});