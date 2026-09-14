const sql = require('../config/db');

const bcrypt = require('bcryptjs');

const { subirImagen } = require('../utils/cloudinaryUpload');

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
    const fotoFinal = foto_url
      ? await subirImagen(foto_url, 'educonnect/estudiantes')
      : null;

    // Insertamos el estudiante y su solicitud en una transacción:
    // si uno falla, se revierte todo y no quedan registros huérfanos.
    const { newStudent, newSolicitud } = await sql.begin(async (tx) => {
      const [student] = await tx`
        INSERT INTO estudiante (nombre, apellido, carnet, genero, direccion, telefono, fecha_nacimiento, foto_url, correo, password_hash)
        VALUES (${nombre}, ${apellido}, ${carnet}, ${genero}, ${direccion}, ${telefono}, ${fecha_nacimiento}, ${fotoFinal}, ${correo}, ${hashedPassword})
        RETURNING id_estudiante, nombre, apellido, carnet, correo;
      `;

      const [solicitud] = await tx`
        INSERT INTO solicitud (id_estudiante, estado, tipo_usuario)
        VALUES (${student.id_estudiante}, 'pendiente', 'estudiante')
        RETURNING *;
      `;

      return { newStudent: student, newSolicitud: solicitud };
    });

    // Retornamos la respuesta con el nuevo estudiante registrado (sin password_hash)
    res.status(201).json({
      message: 'Estudiante registrado exitosamente',
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
