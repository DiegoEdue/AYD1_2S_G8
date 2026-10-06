const sql = require("../config/db");
const { normalizeDate } = require("./student-helpers");
const { renderStudyPlanPdf } = require("../utils/studyPlanPdf");

// HU-031: Planes de estudio de las tutorías atendidas del estudiante autenticado.
const getStudyPlans = async (req, res) => {
    try {
        const studentId = req.user.id;
        const rows = await sql`
            SELECT p.id_plan, s.id_sesion, s.fecha_sesion,
                   CONCAT(t.nombre, ' ', t.apellido) AS nombre_tutor,
                   t.numero_identificacion_tutor,
                   COALESCE((
                       SELECT ARRAY_AGG(m.nombre ORDER BY m.nombre)
                       FROM tutor_materia tm
                       JOIN materia m ON m.id_materia = tm.id_materia
                       WHERE tm.id_tutor = t.id_tutor
                   ), ARRAY[]::text[]) AS especialidades,
                   COALESCE((
                       SELECT JSONB_AGG(
                           JSONB_BUILD_OBJECT('id', d.id_dificultad, 'descripcion', d.descripcion)
                           ORDER BY d.id_dificultad
                       )
                       FROM identified_difficulties d
                       WHERE d.id_plan = p.id_plan
                   ), '[]'::jsonb) AS dificultades,
                   COALESCE((
                       SELECT JSONB_AGG(
                           JSONB_BUILD_OBJECT(
                               'id', r.id_recurso, 'nombre', r.nombre,
                               'tipo', r.tipo, 'descripcionUso', r.descripcion_uso
                           ) ORDER BY r.id_recurso
                       )
                       FROM recommended_resources r
                       WHERE r.id_plan = p.id_plan
                   ), '[]'::jsonb) AS recursos
            FROM study_plans p
            JOIN sesion s ON s.id_sesion = p.id_sesion
            JOIN tutor t ON t.id_tutor = s.id_tutor
            WHERE s.id_estudiante = ${studentId} AND s.estado = 'Atendida'
            ORDER BY s.fecha_sesion DESC, s.hora_sesion DESC, p.id_plan DESC
        `;

        return res.status(200).json({
            success: true,
            data: rows.map(row => ({
                idPlan: row.id_plan,
                idSesion: row.id_sesion,
                fechaUltimaSesion: normalizeDate(row.fecha_sesion),
                tutor: {
                    nombreCompleto: row.nombre_tutor,
                    especialidades: row.especialidades,
                    numeroIdentificacion: row.numero_identificacion_tutor,
                },
                dificultadesIdentificadas: row.dificultades,
                recursosRecomendados: row.recursos,
            })),
        });
    } catch (error) {
        console.error("Error al obtener planes de estudio:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// HU-032: Descarga de constancia PDF solo para planes del estudiante autenticado.
const downloadStudyPlanPdf = async (req, res) => {
    const { id } = req.params;
    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({ success: false, message: "ID de plan inválido" });
    }

    try {
        const rows = await sql`
            SELECT p.id_plan, s.fecha_sesion,
                   CONCAT(e.nombre, ' ', e.apellido) AS nombre_estudiante,
                   CONCAT(t.nombre, ' ', t.apellido) AS nombre_tutor,
                   t.numero_identificacion_tutor, t.telefono AS telefono_tutor,
                   COALESCE((
                       SELECT ARRAY_AGG(m.nombre ORDER BY m.nombre)
                       FROM tutor_materia tm
                       JOIN materia m ON m.id_materia = tm.id_materia
                       WHERE tm.id_tutor = t.id_tutor
                   ), ARRAY[]::text[]) AS especialidades,
                   COALESCE((
                       SELECT ARRAY_AGG(d.descripcion ORDER BY d.id_dificultad)
                       FROM identified_difficulties d WHERE d.id_plan = p.id_plan
                   ), ARRAY[]::text[]) AS dificultades,
                   COALESCE((
                       SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
                           'nombre', r.nombre, 'tipo', r.tipo,
                           'descripcionUso', r.descripcion_uso
                       ) ORDER BY r.id_recurso)
                       FROM recommended_resources r WHERE r.id_plan = p.id_plan
                   ), '[]'::jsonb) AS recursos
            FROM study_plans p
            JOIN sesion s ON s.id_sesion = p.id_sesion
            JOIN estudiante e ON e.id_estudiante = s.id_estudiante
            JOIN tutor t ON t.id_tutor = s.id_tutor
            WHERE p.id_plan = ${Number(id)} AND s.id_estudiante = ${req.user.id}
              AND s.estado = 'Atendida'
        `;

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Plan de estudio no encontrado" });
        }

        const row = rows[0];
        const pdf = await renderStudyPlanPdf({
            id_plan: row.id_plan,
            fechaSesion: normalizeDate(row.fecha_sesion),
            nombreEstudiante: row.nombre_estudiante,
            nombreTutor: row.nombre_tutor,
            especialidades: row.especialidades,
            numeroIdentificacion: row.numero_identificacion_tutor,
            telefonoContacto: process.env.EDUCONNECT_CONTACT_PHONE || row.telefono_tutor,
            dificultades: row.dificultades,
            recursos: row.recursos,
        });

        return res.status(200)
            .set("Content-Type", "application/pdf")
            .set("Content-Disposition", `attachment; filename="educonnect-plan-${row.id_plan}.pdf"`)
            .send(pdf);
    } catch (error) {
        console.error("Error al generar constancia PDF:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = { getStudyPlans, downloadStudyPlanPdf };
