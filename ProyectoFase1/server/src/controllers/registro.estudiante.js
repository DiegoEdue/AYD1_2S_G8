const sql = require('../config/db');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { subirImagen, subirPDF } = require('../utils/cloudinaryUpload');
const { sendVerificationEmail } = require('../services/email');

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
      correo,
      password,
    } = req.body;

    // Validar archivos requeridos
    const fotoFile = req.files?.foto?.[0];
    const carnetPdfFile = req.files?.carnet_pdf?.[0];

    if (!fotoFile) {
      return res.status(400).json({ message: 'La fotografía es obligatoria' });
    }
    if (!carnetPdfFile) {
      return res.status(400).json({ message: 'El carnet escaneado en PDF es obligatorio' });
    }

    // Validar tipo de archivo de la foto
    if (!fotoFile.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'La fotografía debe ser una imagen' });
    }

    // Validar tipo de archivo del carnet (PDF)
    if (carnetPdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'El carnet debe ser un archivo PDF' });
    }

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

    // Subimos la foto a Cloudinary (base64 data URI)
    const fotoBase64 = `data:${fotoFile.mimetype};base64,${fotoFile.buffer.toString('base64')}`;
    const fotoFinal = await subirImagen(fotoBase64, 'educonnect/estudiantes');

    // Subimos el carnet PDF a Cloudinary
    const carnetPdfBase64 = `data:${carnetPdfFile.mimetype};base64,${carnetPdfFile.buffer.toString('base64')}`;
    const carnetPdfUrl = await subirPDF(carnetPdfBase64, 'educonnect/estudiantes');

    // Generar token de verificación único
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insertamos el estudiante y su solicitud en una transacción:
    // si uno falla, se revierte todo y no quedan registros huérfanos.
    const { newStudent, newSolicitud } = await sql.begin(async (tx) => {
      const [student] = await tx`
        INSERT INTO estudiante (nombre, apellido, carnet, genero, direccion, telefono, fecha_nacimiento, foto_url, carnet_pdf_url, correo, password_hash, verification_token, is_email_verified, token_created_at)
        VALUES (${nombre}, ${apellido}, ${carnet}, ${genero}, ${direccion}, ${telefono}, ${fecha_nacimiento}, ${fotoFinal}, ${carnetPdfUrl}, ${correo}, ${hashedPassword}, ${verificationToken}, FALSE, NOW())
        RETURNING id_estudiante, nombre, apellido, carnet, correo;
      `;

      const [solicitud] = await tx`
        INSERT INTO solicitud (id_estudiante, estado, tipo_usuario)
        VALUES (${student.id_estudiante}, 'pendiente', 'estudiante')
        RETURNING *;
      `;

      return { newStudent: student, newSolicitud: solicitud };
    });

    // Enviar correo de verificación
    const fullName = `${nombre} ${apellido}`;
    await sendVerificationEmail({
      to: correo,
      name: fullName,
      token: verificationToken,
    }).catch((err) =>
      console.error('Error al enviar correo de verificación:', err),
    );

    // Retornamos la respuesta con el nuevo estudiante registrado (sin password_hash)
    res.status(201).json({
      message: 'Estudiante registrado exitosamente. Se ha enviado un token de verificación a su correo electrónico.',
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
