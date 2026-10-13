const sql = require("../config/db");

// Deben coincidir con chk_tutor_report_categoria en db/script.sql.
const REPORT_CATEGORIES = [
    "Ética y profesionalismo",
    "Negligencia académica",
    "Abuso o conducta inapropiada",
    "Falsificación de información",
    "Acoso o intimidación",
    "Discriminación",
    "Incumplimiento de horarios",
    "Incumplimiento de responsabilidades",
    "Divulgación de información confidencial",
    "Cobros indebidos",
];

const validSessionId = id => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));

async function unavailableSession(req, res, sessionId, action) {
    const sessions = await sql`
        SELECT estado FROM sesion
        WHERE id_sesion = ${sessionId} AND id_estudiante = ${req.user.id}
    `;
    if (sessions.length === 0) {
        return res.status(404).json({ success: false, message: "Sesión no encontrada" });
    }
    if (sessions[0].estado !== "Atendida") {
        return res.status(409).json({ success: false, message: `Solo se pueden ${action} sesiones atendidas` });
    }
    return res.status(409).json({ success: false, message: `Esta sesión ya tiene una ${action === "calificar" ? "calificación" : "denuncia"}` });
}

const rateTutor = async (req, res) => {
    const { id } = req.params;
    if (!validSessionId(id)) {
        return res.status(400).json({ success: false, message: "ID de sesión inválido" });
    }

    const { estrellas, comentario = "" } = req.body || {};
    if (!Number.isInteger(estrellas) || estrellas < 0 || estrellas > 5) {
        return res.status(400).json({ success: false, message: "Las estrellas deben ser un entero entre 0 y 5" });
    }
    if (typeof comentario !== "string" || comentario.length > 500) {
        return res.status(400).json({ success: false, message: "El comentario debe ser texto de máximo 500 caracteres" });
    }

    try {
        const sessionId = Number(id);
        const created = await sql`
            WITH eligible AS (
                SELECT id_sesion, id_estudiante, id_tutor FROM sesion
                WHERE id_sesion = ${sessionId} AND id_estudiante = ${req.user.id}
                  AND estado = 'Atendida' FOR UPDATE
            )
            INSERT INTO tutor_ratings (id_sesion, id_estudiante, id_tutor, estrellas, comentario)
            SELECT id_sesion, id_estudiante, id_tutor, ${estrellas}, ${comentario.trim()}
            FROM eligible WHERE TRUE
            ON CONFLICT (id_sesion) DO NOTHING
            RETURNING id_rating, id_sesion, estrellas, comentario, fecha_calificacion
        `;

        if (created.length === 0) return unavailableSession(req, res, sessionId, "calificar");
        const rating = created[0];
        return res.status(201).json({
            success: true,
            message: "Tutor calificado correctamente",
            data: {
                id: rating.id_rating,
                idSesion: rating.id_sesion,
                estrellas: rating.estrellas,
                comentario: rating.comentario,
                fechaCalificacion: rating.fecha_calificacion,
            },
        });
    } catch (error) {
        console.error("Error al calificar tutor:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

const reportTutor = async (req, res) => {
    const { id } = req.params;
    if (!validSessionId(id)) {
        return res.status(400).json({ success: false, message: "ID de sesión inválido" });
    }

    const { categoria, descripcion } = req.body || {};
    if (!REPORT_CATEGORIES.includes(categoria)) {
        return res.status(400).json({ success: false, message: "Categoría de reporte inválida" });
    }
    if (typeof descripcion !== "string" || descripcion.trim().length < 10 || descripcion.trim().length > 2000) {
        return res.status(400).json({ success: false, message: "La descripción debe tener entre 10 y 2000 caracteres" });
    }

    try {
        const sessionId = Number(id);
        const created = await sql`
            WITH eligible AS (
                SELECT id_sesion, id_estudiante, id_tutor FROM sesion
                WHERE id_sesion = ${sessionId} AND id_estudiante = ${req.user.id}
                  AND estado = 'Atendida' FOR UPDATE
            )
            INSERT INTO tutor_reports (id_sesion, id_estudiante, id_tutor, categoria, descripcion)
            SELECT id_sesion, id_estudiante, id_tutor, ${categoria}, ${descripcion.trim()}
            FROM eligible WHERE TRUE
            ON CONFLICT (id_sesion) DO NOTHING
            RETURNING id_reporte, id_sesion, categoria, descripcion, estado, fecha_reporte
        `;

        if (created.length === 0) return unavailableSession(req, res, sessionId, "reportar");
        const report = created[0];
        return res.status(201).json({
            success: true,
            message: "Reporte enviado para revisión",
            data: {
                id: report.id_reporte,
                idSesion: report.id_sesion,
                categoria: report.categoria,
                descripcion: report.descripcion,
                estado: report.estado,
                fechaReporte: report.fecha_reporte,
            },
        });
    } catch (error) {
        console.error("Error al reportar tutor:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

const getReportCategories = (req, res) => res.status(200).json({ success: true, data: REPORT_CATEGORIES });

module.exports = { rateTutor, reportTutor, getReportCategories };
