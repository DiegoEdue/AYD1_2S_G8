const { pool } = require('../config/db');

const getTutorCatalog = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `SELECT t.id_tutor, t.nombre, t.apellido, t.foto_url,
              t.direccion_tutoria, t.hora_inicio_atencion, t.hora_fin_atencion,
              ARRAY_AGG(m.nombre) AS materias
       FROM tutor t
       JOIN tutor_materia tm ON t.id_tutor = tm.id_tutor
       JOIN materia m ON tm.id_materia = m.id_materia
       WHERE t.estado_aprobacion = 'aprobado'
         AND t.id_tutor NOT IN (
           SELECT s.id_tutor FROM sesion s
           WHERE s.id_estudiante = $1 AND s.estado = 'Activa'
         )
       GROUP BY t.id_tutor
       ORDER BY t.nombre, t.apellido`,
      [studentId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener catálogo de tutores:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

module.exports = { getTutorCatalog };
