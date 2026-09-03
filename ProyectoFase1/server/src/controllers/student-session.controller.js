const sql = require("../config/db");
const { getStudentSessionsByState } = require("./student-helpers");

// HU-021: Listado de Sesiones Activas del Estudiante
const getActiveSessions = async (req, res) => {
    try {
        const studentId = req.user.id;
        const data = await getStudentSessionsByState(studentId, ["Activa"]);

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error al listar sesiones activas:", error.message);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// HU-023: Historial de Tutorías del Estudiante
const getSessionHistory = async (req, res) => {
    try {
        const studentId = req.user.id;
        const data = await getStudentSessionsByState(studentId, [
            "Atendida",
            "Cancelada_Estudiante",
            "Cancelada_Tutor",
        ]);

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error al obtener historial de sesiones:", error.message);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// HU-022: Cancelación de Sesión por Parte del Estudiante
const cancelSession = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { id } = req.params;

        if (!id || isNaN(parseInt(id, 10))) {
            return res.status(400).json({ success: false, message: "ID de sesión inválido" });
        }

        const sesionId = parseInt(id, 10);

        const sessionExists = await sql`
            SELECT id_sesion FROM sesion WHERE id_sesion = ${sesionId}
        `;

        if (sessionExists.length === 0) {
            return res.status(404).json({ success: false, message: "Sesión no encontrada" });
        }

        const session = await sql`
            SELECT id_sesion FROM sesion
            WHERE id_sesion = ${sesionId} AND id_estudiante = ${studentId} AND estado = 'Activa'
        `;

        if (session.length === 0) {
            return res.status(409).json({
                success: false,
                message: "La sesión no se puede cancelar (ya fue cancelada o atendida)",
            });
        }

        const updated = await sql`
            UPDATE sesion
            SET estado = 'Cancelada_Estudiante', fecha_actualizacion = NOW()
            WHERE id_sesion = ${sesionId}
            RETURNING id_sesion, estado, fecha_actualizacion
        `;

        return res.status(200).json({
            success: true,
            message: "Sesión cancelada correctamente",
            data: {
                id: updated[0].id_sesion,
                estado: updated[0].estado,
                fechaActualizacion: updated[0].fecha_actualizacion,
            },
        });
    } catch (error) {
        console.error("Error al cancelar sesión:", error.message);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = {
    getActiveSessions,
    getSessionHistory,
    cancelSession,
};
