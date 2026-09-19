const db = require('../config/db')

const SELECT_BASE = `
    SELECT 
        s.id_sesion,
        s.id_tutor AS id_tutor,
        s.fecha_sesion AS fecha,
        s.hora_sesion AS hora,
        s.motivo,
        s.resumen,
        s.estado,
        e.id_estudiante,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre_estudiante,
        e.correo AS correo_estudiante,
        CONCAT(t.nombre, ' ', t.apellido) AS nombre_tutor,
        m.nombre AS materia
    FROM sesion s
    JOIN estudiante e ON s.id_estudiante = e.id_estudiante
    JOIN tutor t ON s.id_tutor = t.id_tutor
    JOIN materia m ON s.id_materia = m.id_materia
`;

function mapSessionRow(row) {
    return {
        id: row.id_sesion,
        fecha: row.fecha.toISOString().slice(0, 10), // Formatear a "YYYY-MM-DD"
        hora: row.hora.slice(0, 5), // Formatear a "HH:MM"
        estudiante: row.nombre_estudiante,
        correoEstudiante: row.correo_estudiante,
        id_tutor: row.id_tutor,
        tutor: row.nombre_tutor,
        materia: row.materia,
        motivo: row.motivo,
        resumen: row.resumen,
        estado: row.estado // 'Activa','Atendida','Cancelada_Estudiante','Cancelada_Tutor'
    }
}

// Obtiene todas las sesiones pendientes de un tutor por su ID
const getSesionesPendientesByTutorId = async (id_Tutor) => {
    const result = await db.query(
        `${SELECT_BASE}
        WHERE s.id_tutor = $1 AND s.estado = 'Activa'
        ORDER BY s.fecha_sesion ASC, s.hora_sesion ASC;
        `, 
        [id_Tutor]
    );
    return result.rows.map(mapSessionRow);
}

// Busca una sesión por su ID y el tutor
const findSessionByIdAndTutorId = async (sessionId, id_Tutor) => {
    const result = await db.query(`${SELECT_BASE} WHERE s.id_sesion = $1 AND s.id_tutor = $2`, [sessionId, id_Tutor]);
    if (result.rowCount === 0) return null;
    return mapSessionRow(result.rows[0]);

}

// activa esquivale a sesion pendiente
const ESTADOS_SESION = {
    Atendida: 'Atendido',
    Cancelada_Estudiante: 'Cancelado por estudiante',
    Cancelada_Tutor: 'Cancelado por tutor',
};

// Obtiene el historial de sesiones de un tutor por su ID
// Es offset sera de ayuda para ordenar las sesiones de manera descendente y paginarlas si es necesario
const findHistoryByTutor = async (id_Tutor, { page = 1, limit = 20 } = {}) => {
    const offset = (page - 1) * limit;
    const result = await db.query(
        `${SELECT_BASE}
        WHERE s.id_tutor = $1 AND s.estado <> 'Activa'
        ORDER BY s.fecha_sesion DESC, s.hora_sesion DESC
        LIMIT $2 OFFSET $3;`,
        [id_Tutor, limit, offset]
    );
    //return result.rows.map(mapSessionRow);
    const data = result.rows.map((row) => ({
        id: row.id_sesion,
        fecha: row.fecha.toISOString().slice(0, 10), // Formatear a "YYYY-MM-DD"
        hora: row.hora.slice(0, 5), // Formatear a "HH:MM"
        estudiante: row.nombre_estudiante,
        estado: row.estado, // 'Activa','Atendida','Cancelada_Estudiante','Cancelada_Tutor'
        estadoDescripcion: ESTADOS_SESION[row.estado] || row.estado, 
    }));

    return { data, total: result.rows.length }; // devuelve las sess
}

// Marca la sesión como atendida y actualiza el resumen
const markAttended = async (sessionId, id_Tutor, resumen) => {
    const result = await db.query(
        `UPDATE sesion
        SET resumen = $1, estado = 'Atendida', fecha_actualizacion = NOW()
        WHERE id_sesion = $2 AND id_tutor = $3
        RETURNING id_sesion, estado, resumen, fecha_actualizacion`,
        [resumen, sessionId, id_Tutor]
    );
    if (result.rowCount === 0) return null; 
    const row = result.rows[0];
    return {
        id: row.id_sesion,
        estado: row.estado,
        resumen: row.resumen,
        fechaActualizacion: row.fechaActualizacion,
    };
}

// Marca la sesión como cancelada por el tutor 
const markCancelledByTutor = async (sessionId, id_Tutor) => {
    const result = await db.query(
        `UPDATE sesion
        SET estado = 'Cancelada_Tutor', fecha_actualizacion = now()
        WHERE id_sesion = $1 AND id_tutor = $2
        RETURNING id_sesion, estado, fecha_actualizacion`,
        [sessionId, id_Tutor]
    );
    if (result.rowCount === 0) return null;
    const row = result.rows[0];
    return {
        id: row.id_sesion,
        estado: row.estado,
        fechaCancelacion: row.fecha_actualizacion,
    };
}

module.exports = {
    getSesionesPendientesByTutorId,
    findHistoryByTutor,
    findSessionByIdAndTutorId,
    markAttended,
    markCancelledByTutor
}