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

module.exports = { getTutorCatalog, getTutorAvailability };
