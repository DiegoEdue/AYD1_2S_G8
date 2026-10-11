const db = require('../config/db');

const createStudentReport = async (id_sesion, id_tutor, id_estudiante, { categoria, motivo }) => {
    try {
        const result = await db.query(
            `INSERT INTO student_reports (id_sesion, id_estudiante, id_tutor, categoria, descripcion) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_reporte, id_sesion, id_estudiante, id_tutor, categoria, descripcion, estado, fecha_reporte`,
            [id_sesion, id_estudiante, id_tutor, categoria, motivo]
        );
        if (result.rowCount === 0) return null;
        const row = result.rows[0];
        return {
            id: row.id_reporte,
            id_sesion: row.id_sesion,
            id_estudiante: row.id_estudiante,
            id_tutor: row.id_tutor,
            categoria: row.categoria,
            descripcion: row.descripcion,
            estado: row.estado,
            fecha_reporte: row.fecha_reporte
        };
    } catch (error) {
        console.error('Error Tutor al crear el reporte del estudiante:', error);
        if (error.code === '23505') return { duplicate: true };
        throw error;
    }
}

module.exports = {
    createStudentReport
}