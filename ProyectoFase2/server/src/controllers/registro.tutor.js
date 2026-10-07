const bcrypt = require('bcryptjs');
const sql = require('../config/db');

const { subirImagen, subirArchivo } = require('../utils/cloudinaryUpload');
const { sendVerificationEmail } = require('../services/email');

const generateVerificationToken = () => {
  // Generar token alfanumérico de 6 dígitos (más amigable para el usuario)
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
      foto_url,
      cv_pdf_url,
      cv_pdf,
      numero_identificacion_tutor,
      direccion_tutoria,
      correo,
      password,
      anio_inicio_tutorias,
      universidad_graduacion,
      especialidad,
    } = req.body;

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

    // Validar campos obligatorios de archivos (HU-029)
    if (!foto_url) {
      return res.status(400).json({ message: 'La fotografía es obligatoria' });
    }
    const pdfRaw = cv_pdf_url || cv_pdf || '';
    if (!pdfRaw) {
      return res.status(400).json({ message: 'El CV en PDF es obligatorio' });
    }
    // Validar que sea PDF (data URI debe empezar con data:application/pdf;base64,)
    if (!/^data:application\/pdf;base64,/.test(pdfRaw)) {
      return res.status(400).json({ message: 'El archivo de CV debe ser un PDF válido' });
    }
    // Validar tamaño máximo 5MB (base64 es ~33% más grande que binario)
    const pdfSizeBytes = Math.round((pdfRaw.split(',')[1]?.length || 0) * 0.75);
    if (pdfSizeBytes > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'El CV PDF no debe exceder 5MB' });
    }

    // Subimos la foto a Cloudinary y guardamos solo la URL
    const fotoFinal = await subirImagen(foto_url, 'educonnect/tutores');

    // Subimos el CV PDF
    const cvPdfFinal = await subirArchivo(pdfRaw, 'educonnect/cvs');

    // Generar token de verificación
    const verificationToken = generateVerificationToken();

    // Insertar el nuevo tutor en la base de datos
    const { newTutor, newRequest } = await sql.begin(async (tx) => {
      const [tutor] = await tx`
      INSERT INTO tutor (nombre, apellido, carnet_id, fecha_nacimiento, genero, direccion, telefono, foto_url, numero_identificacion_tutor, direccion_tutoria, correo, password_hash, anio_inicio_tutorias, universidad_graduacion, cv_pdf_url, verification_token, is_email_verified, token_created_at)
      VALUES (${nombre}, ${apellido}, ${carnet_id}, ${fecha_nacimiento}, ${genero}, ${direccion}, ${telefono}, ${fotoFinal}, ${numero_identificacion_tutor}, ${direccion_tutoria}, ${correo}, ${hashedPassword}, ${anio_inicio_tutorias}, ${universidad_graduacion}, ${cvPdfFinal}, ${verificationToken}, FALSE, NOW())
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

    // Enviar email de verificación (no bloquear respuesta si falla)
    const fullName = `${newTutor.nombre} ${newTutor.apellido}`;
    sendVerificationEmail({
      to: correo,
      name: fullName,
      token: verificationToken,
    }).catch((err) =>
      console.error('Error al enviar correo de verificación:', err)
    );

    res.status(201).json({
      message: 'Tutor registrado exitosamente. Se ha enviado un código de verificación a su correo.',
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
