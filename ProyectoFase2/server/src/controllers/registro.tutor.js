const bcrypt = require('bcryptjs');
const sql = require('../config/db');

const { subirImagen, subirArchivo } = require('../utils/cloudinaryUpload');

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

    // Subimos la foto a Cloudinary y guardamos solo la URL
    const fotoFinal = foto_url
      ? await subirImagen(foto_url, 'educonnect/tutores')
      : null;

    // Subimos el CV PDF si fue proporcionado
    const pdfRaw = cv_pdf_url || cv_pdf || '';
    const cvPdfFinal = pdfRaw
      ? await subirArchivo(pdfRaw, 'educonnect/cvs')
      : '';

    // Insertar el nuevo tutor en la base de datos
    const { newTutor, newRequest } = await sql.begin(async (tx) => {
      const [tutor] = await tx`
      INSERT INTO tutor (nombre, apellido, carnet_id, fecha_nacimiento, genero, direccion, telefono, foto_url, numero_identificacion_tutor, direccion_tutoria, correo, password_hash, anio_inicio_tutorias, universidad_graduacion, cv_pdf_url)
      VALUES (${nombre}, ${apellido}, ${carnet_id}, ${fecha_nacimiento}, ${genero}, ${direccion}, ${telefono}, ${fotoFinal}, ${numero_identificacion_tutor}, ${direccion_tutoria}, ${correo}, ${hashedPassword}, ${anio_inicio_tutorias}, ${universidad_graduacion}, ${cvPdfFinal})
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

    res.status(201).json({
      message: 'Tutor registrado exitosamente',
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
