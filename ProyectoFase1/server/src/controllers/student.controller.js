const sql = require('../config/db');

const getTutorCatalog = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await sql`
      SELECT t.id_tutor, t.nombre, t.apellido, t.foto_url,
             t.direccion_tutoria, t.hora_inicio_atencion, t.hora_fin_atencion,
             ARRAY_AGG(m.nombre) AS materias
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

    const dias = diasAtencion.map(d => d.dia_semana);

    const diasMap = { 0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miercoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sabado' };
    const fecha = new Date(date + 'T12:00:00');
    const diaSemana = diasMap[fecha.getDay()];

    if (!dias.includes(diaSemana)) {
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
    const dias = diasAtencion.map(d => d.dia_semana);
    const diasMap = { 0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miercoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sabado' };
    const fechaObj = new Date(fecha + 'T12:00:00');
    const diaSemana = diasMap[fechaObj.getDay()];

    if (!dias.includes(diaSemana)) {
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

module.exports = { getTutorCatalog, getTutorAvailability, createSession };
