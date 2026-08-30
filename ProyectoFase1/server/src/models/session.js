const pool = require('../config/db')

const QUERY_BASE = `
    SELECT 
        s.id_sesion,
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
    JOIN tutor t ON s.id_sesion = t.id_tutor
    JOIN materia m ON s.id_materia = m.id_materia
`;

function mapSessionRow(row) {
    return {
        id: row.id_sesion,
        fecha: row.fecha.toISOString().slice(0, 10), // Formatear a "YYYY-MM-DD"
        hora: row.hora.slice(0, 5), // Formatear a "HH:MM"
        estudiante: row.nombre_estudiante,
        correoEstudiante: row.correo_estudiante,
        tutor: row.nombre_tutor,
        materia: row.materia,
        motivo: row.motivo,
        resumen: row.resumen,
        estado: row.estado // 'Activa','Atendida','Cancelada_Estudiante','Cancelada_Tutor'
    }
}

// Obtiene todas las sesiones pendientes de un tutor por su ID
const getSesionesPendientesByTutorId = async (id_Tutor) => {

    try {
        const result = await pool.query(
            `${QUERY_BASE}
            WHERE s.id_tutor = $1 AND s.estado = 'Activa'
            ORDER BY s.fecha_sesion ASC, s.hora_sesion ASC;
            `, 
            [id_Tutor]
        );
        return result.rows.map(mapSessionRow);
    } catch (error) {
        console.error('Error al obtener las sesiones pendientes:', error);
        throw error;
    }
}

// Busca una sesión por su ID
const findSessionById = async (sessionId) => {
    try {
        const result = await pool.query(`${QUERY_BASE} WHERE s.id_sesion = $1`, [sessionId]);
        if (result.rowCount === 0) return null;
        return mapSessionRow(result.rows[0]);
    } catch (error) {
        console.error('Error al buscar la sesión por ID:', error);
        throw error;
    }
}

// Marca la sesión como atendida y actualiza el resumen
const markAttended = async (sessionId, resumen) => {
    try {
        const result = await pool.query(
            `UPDATE sesion
            SET resumen = $1, estado = 'Atendida', fecha_actualizacion = NOW()
            WHERE id_sesion = $2
            RETURNING id_sesion, estado, resumen, fecha_actualizacion`,
            [resumen, sessionId]
        );
        const row = result.rows[0];
        return {
            id: row.id_sesion,
            estado: row.estado,
            resumen: row.resumen,
            fechaActualizacion: row.fechaActualizacion,
        }
    } catch (error) {
        console.error('Error al registrar la atención de la sesión:', error);
        throw error;
    }
}

// Marca la sesión como cancelada por el tutor 
const markCancelledByTutor = async (sessionId) => {
    try {
        const result = await pool.query(
            `UPDATE sesion
            SET estado = 'Cancelada_Tutor', fecha_actualizacion = NOW()
            WHERE id_sesion = $1
            RETURNING id_sesion, estado, fecha_actualizacion`,
            [sessionId]
        );
        const row = result.rows[0];
        return {
            id: row.id_sesion,
            estado: row.estado,
            fechaCancelacion: row.fecha_actualizacion,
        };
    } catch (error) {
        console.error('Error al cancelar la sesión por parte del tutor:', error);
        throw error;
    }
}

module.exports = {
    getSesionesPendientesByTutorId,
    findSessionById,
    markAttended,
    markCancelledByTutor
}