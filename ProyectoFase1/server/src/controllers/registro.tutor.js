const bcrypt = require('bcryptjs');
const sql = require('../config/db');
const crypto = require('crypto');

const { subirImagen, subirPDF } = require('../utils/cloudinaryUpload');
const { sendVerificationEmail } = require('../services/email');

const registroTutor = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      carnet_id,
      fecha_nacimiento,
      genero,
      direccion,
      telefono,
      numero_identificacion_tutor,
      direccion_tutoria,
      correo,
      password,
      anio_inicio_tutorias,
      universidad_graduacion,
      especialidad,
    } = req.body;

    // Validar archivos requeridos
    const fotoFile = req.files?.foto?.[0];
    const cvPdfFile = req.files?.cv_pdf?.[0];

    if (!fotoFile) {
      return res.status(400).json({ message: 'La fotografía es obligatoria' });
    }
    if (!cvPdfFile) {
      return res.status(400).json({ message: 'El Currículum Vitae en PDF es obligatorio' });
    }

    // Validar tipo de archivo de la foto
    if (!fotoFile.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'La fotografía debe ser una imagen' });
    }

    // Validar tipo de archivo del CV (PDF)
    if (cvPdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'El CV debe ser un archivo PDF' });
    }

    // Validar que todos los campos requeridos estén presentes
    if (
      !nombre ||
      !apellido ||
      !carnet_id ||
      !fecha_nacimiento ||
      !genero ||
      !direccion ||
      !telefono ||
      !numero_identificacion_tutor ||
      !direccion_tutoria ||
      !correo ||
      !password ||
      !anio_inicio_tutorias ||
      !universidad_graduacion ||
      !especialidad
    ) {
      return res
        .status(400)
        .json({ message: 'Todos los campos son requeridos' });
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

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //validamos que el carnet del tutor no esté registrado en la base de datos
    const existingCarnet = await sql`
      SELECT 1 FROM tutor WHERE carnet_id = ${carnet_id}`;
    if (existingCarnet.length > 0) {
      return res.status(400).json({ message: 'El carnet ya está registrado' });
    }

    //Verificamos el numero de identificación del tutor en la base de datos
    const existingTutorId = await sql`
      SELECT 1 FROM tutor WHERE numero_identificacion_tutor = ${numero_identificacion_tutor}`;
    if (existingTutorId.length > 0) {
      return res.status(400).json({
        message: 'El número de identificación del tutor ya está registrado',
      });
    }

    //Validamos que el correo no esté registrado en la base de datos
    const existingTutor = await sql`
      SELECT 1 FROM tutor WHERE correo = ${correo}`;
    if (existingTutor.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Subimos la foto a Cloudinary (base64 data URI)
    const fotoBase64 = `data:${fotoFile.mimetype};base64,${fotoFile.buffer.toString('base64')}`;
    const fotoFinal = await subirImagen(fotoBase64, 'educonnect/tutores');

    // Subimos el CV PDF a Cloudinary
    const cvPdfBase64 = `data:${cvPdfFile.mimetype};base64,${cvPdfFile.buffer.toString('base64')}`;
    const cvPdfUrl = await subirPDF(cvPdfBase64, 'educonnect/tutores');

    // Generar token de verificación único
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insertar el nuevo tutor en la base de datos
    const { newTutor, newRequest } = await sql.begin(async (tx) => {
      const [tutor] = await tx`
      INSERT INTO tutor (nombre, apellido, carnet_id, fecha_nacimiento, genero, direccion, telefono, foto_url, cv_pdf_url, numero_identificacion_tutor, direccion_tutoria, correo, password_hash, anio_inicio_tutorias, universidad_graduacion, verification_token, is_email_verified, token_created_at)
      VALUES (${nombre}, ${apellido}, ${carnet_id}, ${fecha_nacimiento}, ${genero}, ${direccion}, ${telefono}, ${fotoFinal}, ${cvPdfUrl}, ${numero_identificacion_tutor}, ${direccion_tutoria}, ${correo}, ${hashedPassword}, ${anio_inicio_tutorias}, ${universidad_graduacion}, ${verificationToken}, FALSE, NOW())
      RETURNING id_tutor, nombre, apellido, carnet_id, correo;
      `;

      const [solicitud] = await tx`
      INSERT INTO solicitud (id_tutor, estado, tipo_usuario)
      VALUES (${tutor.id_tutor}, 'pendiente', 'tutor')
      RETURNING *;
      `;

      const materias = String(especialidad || '')
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      for (const materia of materias) {
        await tx`
          INSERT INTO materia (nombre) VALUES (${materia})
          ON CONFLICT (nombre) DO NOTHING;
        `;
        const [materiaRow] = await tx`
          SELECT id_materia FROM materia WHERE nombre = ${materia};
        `;
        if (materiaRow) {
          await tx`
            INSERT INTO tutor_materia (id_tutor, id_materia)
            VALUES (${tutor.id_tutor}, ${materiaRow.id_materia})
            ON CONFLICT DO NOTHING;
          `;
        }
      }

      return { newTutor: tutor, newRequest: solicitud };
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

    res.status(201).json({
      message: 'Tutor registrado exitosamente. Se ha enviado un token de verificación a su correo electrónico.',
      tutor: newTutor,
      solicitud: newRequest,
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El tutor ya está registrado' });
    }

    console.error('Error al registrar tutor:', error);
    res.status(500).json({ message: 'Error al registrar tutor' });
  }
};

module.exports = { registroTutor };
