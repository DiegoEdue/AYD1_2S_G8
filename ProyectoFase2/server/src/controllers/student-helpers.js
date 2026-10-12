const sql = require("../config/db");

const normalizeDayName = (value = "") => {
    const normalized = String(value).trim();
    const map = {
        Miercoles: "Miércoles",
        Sabado: "Sábado",
    };
    return map[normalized] || normalized;
};

const getWeekdayName = dateStr => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[new Date(`${dateStr}T12:00:00`).getDay()];
};

const normalizeDate = dateValue => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) {
        return new Date(dateValue.getTime() + 12 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }
    if (typeof dateValue === "object" && dateValue.toISOString) {
        return new Date(dateValue.getTime() + 12 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }
    if (typeof dateValue === "string") {
        const d = new Date(dateValue.includes("T") ? dateValue : `${dateValue}T12:00:00`);
        if (!isNaN(d.getTime())) {
            return d.toISOString().slice(0, 10);
        }
        return dateValue.slice(0, 10);
    }
    return String(dateValue).slice(0, 10);
};

const normalizeTime = timeValue => {
    if (!timeValue) return null;
    if (typeof timeValue === "string") {
        return timeValue.slice(0, 5);
    }
    if (typeof timeValue === "object" && timeValue.hour !== undefined) {
        return `${String(timeValue.hour).padStart(2, "0")}:${String(timeValue.minute || 0).padStart(2, "0")}`;
    }
    return String(timeValue).slice(0, 5);
};

const getStudentSessionsByState = async (studentId, estados) => {
    const result = await sql`
        SELECT s.id_sesion, s.fecha_sesion AS fecha, s.hora_sesion AS hora, s.motivo, s.estado,
               m.nombre AS materia,
               CONCAT(t.nombre, ' ', t.apellido) AS tutor,
               t.correo AS correo_tutor,
               tr.id_rating, tr.estrellas, tr.comentario, tr.fecha_calificacion,
               rp.id_reporte, rp.categoria AS categoria_reporte,
               rp.estado AS estado_reporte, rp.fecha_reporte
        FROM sesion s
        JOIN tutor t ON s.id_tutor = t.id_tutor
        JOIN materia m ON s.id_materia = m.id_materia
        LEFT JOIN tutor_ratings tr ON tr.id_sesion = s.id_sesion
        LEFT JOIN tutor_reports rp ON rp.id_sesion = s.id_sesion
        WHERE s.id_estudiante = ${studentId}
          AND s.estado = ANY(${estados})
        ORDER BY s.fecha_sesion ASC, s.hora_sesion ASC
    `;

    return result.map(row => ({
        id: row.id_sesion,
        fecha: normalizeDate(row.fecha),
        hora: normalizeTime(row.hora),
        motivo: row.motivo,
        estado: row.estado,
        materia: row.materia,
        tutor: row.tutor,
        correoTutor: row.correo_tutor,
        calificacion: row.id_rating === null || row.id_rating === undefined ? null : {
            id: row.id_rating,
            estrellas: row.estrellas,
            comentario: row.comentario,
            fechaCalificacion: row.fecha_calificacion,
        },
        reporte: row.id_reporte === null || row.id_reporte === undefined ? null : {
            id: row.id_reporte,
            categoria: row.categoria_reporte,
            estado: row.estado_reporte,
            fechaReporte: row.fecha_reporte,
        },
    }));
};

module.exports = {
    normalizeDayName,
    getWeekdayName,
    normalizeDate,
    normalizeTime,
    getStudentSessionsByState,
};
