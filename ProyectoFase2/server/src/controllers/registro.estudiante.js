const sql = require('../config/db');

const bcrypt = require('bcryptjs');

const { subirImagen, subirArchivo } = require('../utils/cloudinaryUpload');
const { sendVerificationEmail } = require('../services/email');

const generateVerificationToken = () => {
  // Generar token alfanumérico de 6 dígitos (más amigable para el usuario)
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const registerStudent = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      carnet,
      genero,
      direccion,
      telefono,
      fecha_nacimiento,
      foto_url,
      carnet_pdf_url,
      carnet_pdf,
      correo,
      password,
    } = req.body;

    if (
      !nombre ||
      !apellido ||
      !carnet ||
      !genero ||
      !direccion ||
      !telefono ||
      !fecha_nacimiento ||
      !correo ||
      !password
    ) {
      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios' });
    }

    // Validar campos obligatorios de archivos (HU-028)
    if (!foto_url) {
      return res.status(400).json({ message: 'La fotografía es obligatoria' });
    }
    const pdfRaw = carnet_pdf_url || carnet_pdf || '';
    if (!pdfRaw) {
      return res.status(400).json({ message: 'El carnet escaneado en PDF es obligatorio' });
    }

    // Validar el formato del correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({ message: 'Correo electrónico inválido' });
    }

    // Validar la contraseña (mínimo 8 caracteres, al menos una letra y un número)
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // validamos que el correo no exista en la base de datos
    const existingStudent = await sql`
      SELECT 1 FROM estudiante WHERE correo = ${correo};
    `;

    if (existingStudent.length > 0) {
      return res
        .status(400)
        .json({ message: 'El correo electrónico ya está registrado' });
    }

    //verificamos que el carnet no exista en la base de datos
    const existingCarnet = await sql`
      SELECT 1 FROM estudiante WHERE carnet = ${carnet};
    `;

    if (existingCarnet.length > 0) {
      return res.status(400).json({ message: 'El carnet ya está registrado' });
    }

    // Subimos la foto a Cloudinary y guardamos solo la URL
    const fotoFinal = await subirImagen(foto_url, 'educonnect/estudiantes');

    // Subimos el carnet PDF
    const carnetPdfFinal = await subirArchivo(pdfRaw, 'educonnect/carnets');

    // Generar token de verificación
    const verificationToken = generateVerificationToken();

    // Insertamos el estudiante y su solicitud en una transacción:
    const { newStudent, newSolicitud } = await sql.begin(async (tx) => {
      const [student] = await tx`
        INSERT INTO estudiante (nombre, apellido, carnet, genero, direccion, telefono, fecha_nacimiento, foto_url, carnet_pdf_url, correo, password_hash, verification_token, is_email_verified, token_created_at)
        VALUES (${nombre}, ${apellido}, ${carnet}, ${genero}, ${direccion}, ${telefono}, ${fecha_nacimiento}, ${fotoFinal}, ${carnetPdfFinal}, ${correo}, ${hashedPassword}, ${verificationToken}, FALSE, NOW())
        RETURNING id_estudiante, nombre, apellido, carnet, correo;
      `;

      const [solicitud] = await tx`
        INSERT INTO solicitud (id_estudiante, estado, tipo_usuario)
        VALUES (${student.id_estudiante}, 'pendiente', 'estudiante')
        RETURNING *;
      `;

      return { newStudent: student, newSolicitud: solicitud };
    });

    // Enviar email de verificación (no bloquear respuesta si falla)
    const fullName = `${newStudent.nombre} ${newStudent.apellido}`;
    sendVerificationEmail({
      to: correo,
      name: fullName,
      token: verificationToken,
    }).catch((err) =>
      console.error('Error al enviar correo de verificación:', err)
    );

    // Retornamos la respuesta con el nuevo estudiante registrado (sin password_hash)
    res.status(201).json({
      message: 'Estudiante registrado exitosamente. Se ha enviado un código de verificación a su correo.',
      student: newStudent,
      solicitud: newSolicitud,
    });
  } catch (error) {
    // Violación de UNIQUE (correo o carnet duplicado por una condición de carrera)
    if (error.code === '23505') {
      return res
        .status(400)
        .json({ message: 'El correo o el carnet ya están registrados' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el estudiante' });
  }
};

module.exports = { registerStudent };
