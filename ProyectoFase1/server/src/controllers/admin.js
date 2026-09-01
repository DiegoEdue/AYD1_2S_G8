const db = require('../config/db');
const { sendApprovalNotification } = require('../utils/mailer');

const getPendingStudents = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id_estudiante, nombre, apellido, carnet, genero, direccion, telefono, 
              fecha_nacimiento, foto_url, correo, estado_aprobacion, fecha_registro 
       FROM estudiante 
       WHERE estado_aprobacion = 'pendiente' 
       ORDER BY fecha_registro ASC`
    );

    return res.status(200).json({
      status: 'success',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error en getPendingStudents:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al consultar estudiantes pendientes.',
    });
  }
};

const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    // Buscar estudiante
    const studentRes = await db.query(
      'SELECT id_estudiante, nombre, apellido, correo, estado_aprobacion FROM estudiante WHERE id_estudiante = $1',
      [id]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const student = studentRes.rows[0];

    // Actualizar estado en la tabla estudiante
    await db.query(
      `UPDATE estudiante 
       SET estado_aprobacion = 'aprobado' 
       WHERE id_estudiante = $1`,
      [id]
    );

    // Actualizar estado en la tabla solicitud (si existe)
    await db.query(
      `UPDATE solicitud 
       SET estado = 'aceptada', fecha_procesado = CURRENT_TIMESTAMP 
       WHERE id_estudiante = $1 AND tipo_usuario = 'estudiante'`,
      [id]
    );

    const fullName = `${student.nombre} ${student.apellido}`;

    sendApprovalNotification(student.correo, fullName, true);

    return res.status(200).json({
      status: 'success',
      message: 'Estudiante aprobado exitosamente.',
      data: {
        id_estudiante: student.id_estudiante,
        nombre: fullName,
        correo: student.correo,
        estado_aprobacion: 'aprobado',
      },
    });
  } catch (error) {
    console.error('Error en approveStudent:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al aprobar al estudiante.',
    });
  }
};

const rejectStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    // Buscar estudiante
    const studentRes = await db.query(
      'SELECT id_estudiante, nombre, apellido, correo, estado_aprobacion FROM estudiante WHERE id_estudiante = $1',
      [id]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const student = studentRes.rows[0];

    // Actualizar estado en la tabla estudiante
    await db.query(
      `UPDATE estudiante 
       SET estado_aprobacion = 'rechazado' 
       WHERE id_estudiante = $1`,
      [id]
    );

    // Actualizar estado en la tabla solicitud (si existe)
    await db.query(
      `UPDATE solicitud 
       SET estado = 'rechazada', fecha_procesado = CURRENT_TIMESTAMP, motivo_rechazo = $2 
       WHERE id_estudiante = $1 AND tipo_usuario = 'estudiante'`,
      [id, motivo || 'Solicitud rechazada por el administrador']
    );

    const fullName = `${student.nombre} ${student.apellido}`;

    // Enviar correo de notificación
    sendApprovalNotification(student.correo, fullName, false, motivo);

    return res.status(200).json({
      status: 'success',
      message: 'Estudiante rechazado exitosamente.',
      data: {
        id_estudiante: student.id_estudiante,
        nombre: fullName,
        correo: student.correo,
        estado_aprobacion: 'rechazado',
        motivo: motivo || 'No especificado',
      },
    });
  } catch (error) {
    console.error('Error en rejectStudent:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al rechazar al estudiante.',
    });
  }
};

module.exports = {
  getPendingStudents,
  approveStudent,
  rejectStudent,
};
