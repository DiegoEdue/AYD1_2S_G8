const pool = require('../config/db')

// este query se coloca porque hay 2 funciones que hacen lo mismo, y para evitar duplicar el query, se coloca aqui
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

module.exports = {
    getSesionesPendientesByTutorId
}