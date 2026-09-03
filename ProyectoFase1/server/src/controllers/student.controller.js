const sql = require('../config/db');

const getStudentSessionsByState = async (studentId, estados) => {
  const result = await sql`
    SELECT s.id_sesion, s.fecha_sesion AS fecha, s.hora_sesion AS hora, s.motivo, s.resumen, s.estado,
           m.nombre AS materia, CONCAT(t.nombre, ' ', t.apellido) AS tutor,
           t.correo AS correo_tutor
    FROM sesion s
    JOIN tutor t ON s.id_tutor = t.id_tutor
    JOIN materia m ON s.id_materia = m.id_materia
    WHERE s.id_estudiante = ${studentId}
      AND s.estado = ANY(${estados})
    ORDER BY s.fecha_sesion ASC, s.hora_sesion ASC
  `;

  return result.map((row) => ({
    id: row.id_sesion,
    fecha: row.fecha ? new Date(`${row.fecha}T12:00:00`).toISOString().slice(0, 10) : null,
    hora: row.hora ? row.hora.slice(0, 5) : null,
    motivo: row.motivo,
    resumen: row.resumen,
    estado: row.estado,
    materia: row.materia,
    tutor: row.tutor,
    correoTutor: row.correo_tutor,
  }));
};

const normalizeDayName = (value = '') => {
  const normalized = String(value).trim();
  const map = {
    Miercoles: 'Miércoles',
    Sabado: 'Sábado',
    Jueves: 'Jueves',
    Lunes: 'Lunes',
    Martes: 'Martes',
    Viernes: 'Viernes',
    Domingo: 'Domingo',
    'Miércoles': 'Miércoles',
    'Sábado': 'Sábado',
  };

  return map[normalized] || normalized;
};

const getWeekdayName = (dateString) => {
  const fecha = new Date(`${dateString}T12:00:00`);
  const diasMap = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
  };

  return diasMap[fecha.getDay()] || '';
};

const getTutorCatalog = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await sql`
            SELECT t.id_tutor, t.nombre, t.apellido, t.foto_url,
              t.direccion_tutoria, t.hora_inicio_atencion, t.hora_fin_atencion,
              ARRAY_AGG(m.nombre) AS materias,
              ARRAY_AGG(json_build_object('id', m.id_materia, 'nombre', m.nombre)) AS materias_detalle
      FROM tutor t
      JOIN tutor_materia tm ON t.id_tutor = tm.id_tutor
      JOIN materia m ON tm.id_materia = m.id_materia
      WHERE t.estado_aprobacion = 'aprobado'
        AND t.id_tutor NOT IN (
          SELECT s.id_tutor FROM sesion s
          WHERE s.id_estudiante = ${studentId} AND s.estado = 'Activa'
        )
      GROUP BY t.id_tutor
      ORDER BY t.nombre, t.apellido
    `;

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error al obtener catálogo de tutores:', error.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getTutorAvailability = async (req, res) => {
  try {
    const { idTutor } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'El parámetro date es obligatorio (YYYY-MM-DD)' });
    }

    const tutor = await sql`
      SELECT id_tutor, nombre, apellido, hora_inicio_atencion, hora_fin_atencion
      FROM tutor
      WHERE id_tutor = ${idTutor} AND estado_aprobacion = 'aprobado'
    `;

    if (tutor.length === 0) {
      return res.status(404).json({ success: false, message: 'Tutor no encontrado o no aprobado' });
    }

    const diasAtencion = await sql`
      SELECT dia_semana FROM tutor_dia_atencion WHERE id_tutor = ${idTutor}
    `;

    const dias = diasAtencion.map(d => normalizeDayName(d.dia_semana));
    const diaSemana = getWeekdayName(date);

    if (!dias.some((dia) => dia === diaSemana)) {
      return res.status(200).json({
        success: true,
        data: {
          tutor: { id: tutor[0].id_tutor, nombre: tutor[0].nombre, apellido: tutor[0].apellido },
          dias_atencion: dias,
          horario_general: { inicio: tutor[0].hora_inicio_atencion, fin: tutor[0].hora_fin_atencion },
          fecha_consultada: date,
          dia_semana: diaSemana,
          disponible: false,
          mensaje: `El tutor no atiende los ${diaSemana}`,
        },
      });
    }

    const sesiones = await sql`
      SELECT hora_sesion FROM sesion
      WHERE id_tutor = ${idTutor} AND fecha_sesion = ${date} AND estado = 'Activa'
    `;

    const horasOcupadas = new Set(sesiones.map(s => {
      const h = s.hora_sesion;
      return typeof h === 'string' ? h.substring(0, 5) : `${String(h.hour).padStart(2, '0')}:${String(h.minute).padStart(2, '0')}`;
    }));

    const [inicioH, inicioM] = tutor[0].hora_inicio_atencion.split(':').map(Number);
    const [finH] = tutor[0].hora_fin_atencion.split(':').map(Number);

    const franjas = [];
    for (let h = inicioH; h < finH; h++) {
      const hora = `${String(h).padStart(2, '0')}:${String(inicioM).padStart(2, '0')}`;
      franjas.push({ hora, estado: horasOcupadas.has(hora) ? 'ocupada' : 'libre' });
    }

    return res.status(200).json({
      success: true,
      data: {
        tutor: { id: tutor[0].id_tutor, nombre: tutor[0].nombre, apellido: tutor[0].apellido },
        dias_atencion: dias,
        horario_general: { inicio: tutor[0].hora_inicio_atencion, fin: tutor[0].hora_fin_atencion },
        fecha_consultada: date,
        dia_semana: diaSemana,
        disponible: true,
        franjas,
      },
    });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getActiveSessions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const data = await getStudentSessionsByState(studentId, ['Activa']);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error al obtener sesiones activas del estudiante:', error.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getSessionHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const data = await getStudentSessionsByState(studentId, ['Atendida', 'Cancelada_Estudiante', 'Cancelada_Tutor']);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error al obtener historial de sesiones del estudiante:', error.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const cancelSession = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const session = await sql`
      SELECT s.*, CONCAT(t.nombre, ' ', t.apellido) AS tutor, e.correo AS correo_estudiante
      FROM sesion s
      JOIN tutor t ON s.id_tutor = t.id_tutor
      JOIN estudiante e ON s.id_estudiante = e.id_estudiante
      WHERE s.id_sesion = ${id} AND s.id_estudiante = ${studentId} AND s.estado = 'Activa'
    `;

    if (session.length === 0) {
      return res.status(404).json({ success: false, message: 'Sesión no encontrada o no se puede cancelar.' });
    }

    const updated = await sql`
      UPDATE sesion
      SET estado = 'Cancelada_Estudiante', fecha_actualizacion = NOW()
      WHERE id_sesion = ${id}
      RETURNING id_sesion, estado, fecha_actualizacion
    `;

    return res.status(200).json({
      success: true,
      message: 'Sesión cancelada correctamente.',
      data: {
        id: updated[0].id_sesion,
        estado: updated[0].estado,
        fechaActualizacion: updated[0].fecha_actualizacion,
      },
    });
  } catch (error) {
    console.error('Error al cancelar la sesión del estudiante:', error.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const createSession = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { idTutor, idMateria, fecha, hora, motivo } = req.body;

    if (!idTutor || !idMateria || !fecha || !hora || !motivo) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios: idTutor, idMateria, fecha, hora, motivo' });
    }

    const tutor = await sql`
      SELECT id_tutor, nombre, apellido, hora_inicio_atencion, hora_fin_atencion
      FROM tutor WHERE id_tutor = ${idTutor} AND estado_aprobacion = 'aprobado'
    `;
    if (tutor.length === 0) {
      return res.status(404).json({ success: false, message: 'Tutor no encontrado o no aprobado' });
    }

    const materiaTutor = await sql`
      SELECT id_materia FROM tutor_materia WHERE id_tutor = ${idTutor} AND id_materia = ${idMateria}
    `;
    if (materiaTutor.length === 0) {
      return res.status(400).json({ success: false, message: 'La materia no pertenece a las especialidades del tutor' });
    }

    const diasAtencion = await sql`SELECT dia_semana FROM tutor_dia_atencion WHERE id_tutor = ${idTutor}`;
    const dias = diasAtencion.map(d => normalizeDayName(d.dia_semana));
    const diaSemana = getWeekdayName(fecha);

    if (!dias.some((dia) => dia === diaSemana)) {
      return res.status(400).json({ success: false, message: `El tutor no atiende los ${diaSemana}` });
    }

    const horaNum = parseInt(hora.split(':')[0], 10);
    const [inicioH] = tutor[0].hora_inicio_atencion.split(':').map(Number);
    const [finH] = tutor[0].hora_fin_atencion.split(':').map(Number);

    if (horaNum < inicioH || horaNum >= finH) {
      return res.status(400).json({ success: false, message: `La hora debe estar entre ${tutor[0].hora_inicio_atencion} y ${tutor[0].hora_fin_atencion}` });
    }

    const sesionMismoTutor = await sql`
      SELECT id_sesion FROM sesion
      WHERE id_estudiante = ${studentId} AND id_tutor = ${idTutor} AND estado = 'Activa'
    `;
    if (sesionMismoTutor.length > 0) {
      return res.status(409).json({ success: false, message: 'Ya tienes una sesión activa con este tutor' });
    }

    const sesionEstudiante = await sql`
      SELECT id_sesion FROM sesion
      WHERE id_estudiante = ${studentId} AND fecha_sesion = ${fecha} AND hora_sesion = ${hora} AND estado = 'Activa'
    `;
    if (sesionEstudiante.length > 0) {
      return res.status(409).json({ success: false, message: 'Ya tienes otra sesión agendada en esa fecha y hora' });
    }

    const sesionTutor = await sql`
      SELECT id_sesion FROM sesion
      WHERE id_tutor = ${idTutor} AND fecha_sesion = ${fecha} AND hora_sesion = ${hora} AND estado = 'Activa'
    `;
    if (sesionTutor.length > 0) {
      return res.status(409).json({ success: false, message: 'El tutor ya tiene una sesión agendada en esa fecha y hora' });
    }

    const nuevaSesion = await sql`
      INSERT INTO sesion (id_estudiante, id_tutor, id_materia, fecha_sesion, hora_sesion, motivo)
      VALUES (${studentId}, ${idTutor}, ${idMateria}, ${fecha}, ${hora}, ${motivo})
      RETURNING *
    `;

    return res.status(201).json({ success: true, message: 'Sesion creada correctamente', data: nuevaSesion[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Conflicto de horario: ya existe una sesión activa que se traslapa' });
    }
    console.error('Error al crear sesion:', error.message);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = {
  getTutorCatalog,
  getTutorAvailability,
  createSession,
  getActiveSessions,
  getSessionHistory,
  cancelSession,
};
