const sql = require("../config/db");
const { normalizeDayName, getWeekdayName } = require("./student-helpers");

// HU-017: Visualización del Catálogo de Tutores Disponibles
const getTutorCatalog = async (req, res) => {
    try {
        const studentId = req.user.id;

        const result = await sql`
                 SELECT t.id_tutor, t.nombre, t.apellido, t.foto_url,
                     t.genero, t.fecha_nacimiento, t.anio_inicio_tutorias,
                     t.universidad_graduacion,
                   t.direccion_tutoria, t.hora_inicio_atencion, t.hora_fin_atencion,
                   ARRAY_AGG(DISTINCT tda.dia_semana) FILTER (WHERE tda.dia_semana IS NOT NULL) AS dias_atencion,
                   ARRAY_AGG(DISTINCT m.nombre) AS materias,
                   ARRAY_AGG(DISTINCT jsonb_build_object('id', m.id_materia, 'nombre', m.nombre)) AS materias_detalle
            FROM tutor t
            JOIN tutor_materia tm ON t.id_tutor = tm.id_tutor
            JOIN materia m ON tm.id_materia = m.id_materia
            LEFT JOIN tutor_dia_atencion tda ON t.id_tutor = tda.id_tutor
                        WHERE t.estado_aprobacion = 'aprobado'
            GROUP BY t.id_tutor
            ORDER BY t.nombre, t.apellido
        `;

        const data = result.map((r) => ({
            ...r,
            dias_atencion: Array.isArray(r.dias_atencion)
                ? r.dias_atencion.map(normalizeDayName)
                : [],
        }));

        const excluded = await sql`
            SELECT t.id_tutor, t.nombre, t.apellido, s.id_sesion, s.fecha_sesion, s.hora_sesion
            FROM sesion s
            JOIN tutor t ON s.id_tutor = t.id_tutor
            WHERE s.id_estudiante = ${studentId} AND s.estado = 'Activa'
        `;

        return res.status(200).json({
            success: true,
            data: data,
            tutores_con_sesion_pendiente: excluded,
            message:
                excluded.length > 0
                    ? `Tienes ${excluded.length} tutor(es) con sesion pendiente que no aparecen en el catalogo`
                    : undefined,
        });
    } catch (error) {
        console.error("Error al obtener catálogo de tutores:", error.message);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// HU-019: Consulta de Horarios y Disponibilidad de un Tutor por Fecha
const getTutorAvailability = async (req, res) => {
    try {
        const { idTutor } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ success: false, message: "El parámetro date es obligatorio (YYYY-MM-DD)" });
        }

        const tutor = await sql`
            SELECT id_tutor, nombre, apellido, hora_inicio_atencion, hora_fin_atencion
            FROM tutor
            WHERE id_tutor = ${idTutor} AND estado_aprobacion = 'aprobado'
        `;

        if (tutor.length === 0) {
            return res.status(404).json({ success: false, message: "Tutor no encontrado o no aprobado" });
        }

        const diasAtencion = await sql`
            SELECT dia_semana FROM tutor_dia_atencion WHERE id_tutor = ${idTutor}
        `;

        const dias = diasAtencion.map(d => normalizeDayName(d.dia_semana));
        const diaSemana = getWeekdayName(date);

        if (!dias.some(dia => dia === diaSemana)) {
            return res.status(200).json({
                success: true,
                data: {
                    tutor: { id: tutor[0].id_tutor, nombre: tutor[0].nombre, apellido: tutor[0].apellido },
                    dias_atencion: dias,
                    horario_general: { inicio: tutor[0].hora_inicio_atencion, fin: tutor[0].hora_fin_atencion },
                    fecha_consultada: date,
                    dia_semana: diaSemana,
                    disponible: false,
                    mensaje: `El tutor no atiende los ${diaSemana}`,
                },
            });
        }

        const sesiones = await sql`
            SELECT hora_sesion FROM sesion
            WHERE id_tutor = ${idTutor} AND fecha_sesion = ${date} AND estado = 'Activa'
        `;

        const horasOcupadas = new Set(
            sesiones.map(s => {
                const h = s.hora_sesion;
                return typeof h === "string"
                    ? h.substring(0, 5)
                    : `${String(h.hour).padStart(2, "0")}:${String(h.minute).padStart(2, "0")}`;
            })
        );

        if (!tutor[0].hora_inicio_atencion || !tutor[0].hora_fin_atencion) {
            return res.status(400).json({
                success: false,
                message: "El tutor no tiene horario de atención configurado",
            });
        }

        const [inicioH, inicioM] = tutor[0].hora_inicio_atencion.split(":").map(Number);
        const [finH, finM] = tutor[0].hora_fin_atencion.split(":").map(Number);

        const inicioTotal = inicioH * 60 + inicioM;
        const finTotal = finH * 60 + finM;

        const franjas = [];
        for (let m = inicioTotal; m < finTotal; m += 60) {
            const h = Math.floor(m / 60);
            const min = m % 60;
            const hora = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
            franjas.push({ hora, estado: horasOcupadas.has(hora) ? "ocupada" : "libre" });
        }

        return res.status(200).json({
            success: true,
            data: {
                tutor: { id: tutor[0].id_tutor, nombre: tutor[0].nombre, apellido: tutor[0].apellido },
                dias_atencion: dias,
                horario_general: { inicio: tutor[0].hora_inicio_atencion, fin: tutor[0].hora_fin_atencion },
                fecha_consultada: date,
                dia_semana: diaSemana,
                disponible: true,
                franjas,
            },
        });
    } catch (error) {
        console.error("Error al obtener disponibilidad:", error.message);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// HU-020: Programación y Validación de Sesión de Tutoría
const createSession = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { idTutor, idMateria, fecha, hora, motivo } = req.body;

        if (!idTutor || !idMateria || !fecha || !hora || !motivo) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios: idTutor, idMateria, fecha, hora, motivo",
            });
        }

        const tutor = await sql`
            SELECT id_tutor, nombre, apellido, hora_inicio_atencion, hora_fin_atencion
            FROM tutor WHERE id_tutor = ${idTutor} AND estado_aprobacion = 'aprobado'
        `;
        if (tutor.length === 0) {
            return res.status(404).json({ success: false, message: "Tutor no encontrado o no aprobado" });
        }

        const materiaTutor = await sql`
            SELECT id_materia FROM tutor_materia WHERE id_tutor = ${idTutor} AND id_materia = ${idMateria}
        `;
        if (materiaTutor.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "La materia no pertenece a las especialidades del tutor" });
        }

        const diasAtencion = await sql`SELECT dia_semana FROM tutor_dia_atencion WHERE id_tutor = ${idTutor}`;
        const dias = diasAtencion.map(d => normalizeDayName(d.dia_semana));
        const diaSemana = getWeekdayName(fecha);

        if (!dias.some(dia => dia === diaSemana)) {
            return res.status(400).json({ success: false, message: `El tutor no atiende los ${diaSemana}` });
        }

        if (!tutor[0].hora_inicio_atencion || !tutor[0].hora_fin_atencion) {
            return res.status(400).json({
                success: false,
                message: "El tutor no tiene horario de atención configurado",
            });
        }

        const [inicioH, inicioM] = tutor[0].hora_inicio_atencion.split(":").map(Number);
        const [finH, finM] = tutor[0].hora_fin_atencion.split(":").map(Number);
        const [horaH, horaM] = hora.split(":").map(Number);

        const inicioTotal = inicioH * 60 + inicioM;
        const finTotal = finH * 60 + finM;
        const horaTotal = horaH * 60 + horaM;

        if (horaTotal < inicioTotal || horaTotal >= finTotal) {
            return res.status(400).json({
                success: false,
                message: `La hora debe estar entre ${tutor[0].hora_inicio_atencion} y ${tutor[0].hora_fin_atencion}`,
            });
        }

        if (horaM !== inicioM) {
            return res.status(400).json({
                success: false,
                message: `Los minutos de la hora deben ser ${String(inicioM).padStart(2, "0")} para coincidir con las franjas disponibles`,
            });
        }

        const sesionMismoTutor = await sql`
            SELECT id_sesion FROM sesion
            WHERE id_estudiante = ${studentId} AND id_tutor = ${idTutor} AND estado = 'Activa'
        `;
        if (sesionMismoTutor.length > 0) {
            return res.status(409).json({ success: false, message: "Ya tienes una sesión activa con este tutor" });
        }

        const sesionEstudiante = await sql`
            SELECT id_sesion FROM sesion
            WHERE id_estudiante = ${studentId} AND fecha_sesion = ${fecha} AND hora_sesion = ${hora} AND estado = 'Activa'
        `;
        if (sesionEstudiante.length > 0) {
            return res
                .status(409)
                .json({ success: false, message: "Ya tienes otra sesión agendada en esa fecha y hora" });
        }

        const sesionTutor = await sql`
            SELECT id_sesion FROM sesion
            WHERE id_tutor = ${idTutor} AND fecha_sesion = ${fecha} AND hora_sesion = ${hora} AND estado = 'Activa'
        `;
        if (sesionTutor.length > 0) {
            return res
                .status(409)
                .json({ success: false, message: "El tutor ya tiene una sesión agendada en esa fecha y hora" });
        }

        const nuevaSesion = await sql`
            INSERT INTO sesion (id_estudiante, id_tutor, id_materia, fecha_sesion, hora_sesion, motivo)
            VALUES (${studentId}, ${idTutor}, ${idMateria}, ${fecha}, ${hora}, ${motivo})
            RETURNING *
        `;

        return res.status(201).json({ success: true, message: "Sesion creada correctamente", data: nuevaSesion[0] });
    } catch (error) {
        if (error.code === "23505") {
            return res
                .status(409)
                .json({ success: false, message: "Conflicto de horario: ya existe una sesión activa que se traslapa" });
        }
        console.error("Error al crear sesion:", error.message);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

// HU-018: Búsqueda Avanzada y Filtrado de Tutores
const searchTutors = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { materia, experienciaMin, sexo, edadMin, edadMax, universidad } = req.query;

        let query = sql`
                 SELECT t.id_tutor, t.nombre, t.apellido, t.foto_url,
                     t.genero, t.fecha_nacimiento, t.anio_inicio_tutorias,
                     t.universidad_graduacion, t.direccion_tutoria,
                   t.hora_inicio_atencion, t.hora_fin_atencion,
                   ARRAY_AGG(DISTINCT tda.dia_semana) FILTER (WHERE tda.dia_semana IS NOT NULL) AS dias_atencion,
                   ARRAY_AGG(DISTINCT m.nombre) AS materias,
                   ARRAY_AGG(DISTINCT jsonb_build_object('id', m.id_materia, 'nombre', m.nombre)) AS materias_detalle
            FROM tutor t
            JOIN tutor_materia tm ON t.id_tutor = tm.id_tutor
            JOIN materia m ON tm.id_materia = m.id_materia
            LEFT JOIN tutor_dia_atencion tda ON t.id_tutor = tda.id_tutor
                        WHERE t.estado_aprobacion = 'aprobado'
        `;

        if (materia) {
            query = sql`${query} AND m.nombre ILIKE ${"%" + materia + "%"}`;
        }
        if (sexo) {
            query = sql`${query} AND t.genero = ${sexo}`;
        }
        if (edadMin || edadMax) {
            const edadExpr = sql`EXTRACT(YEAR FROM AGE(t.fecha_nacimiento))`;
            if (edadMin && edadMax) {
                query = sql`${query} AND ${edadExpr} >= ${parseInt(edadMin, 10)} AND ${edadExpr} <= ${parseInt(edadMax, 10)}`;
            } else if (edadMin) {
                query = sql`${query} AND ${edadExpr} >= ${parseInt(edadMin, 10)}`;
            } else {
                query = sql`${query} AND ${edadExpr} <= ${parseInt(edadMax, 10)}`;
            }
        }
        if (universidad) {
            query = sql`${query} AND t.universidad_graduacion ILIKE ${"%" + universidad + "%"}`;
        }
        if (experienciaMin) {
            const experienciaExpr = sql`GREATEST(0, EXTRACT(YEAR FROM CURRENT_DATE) - t.anio_inicio_tutorias::int)`;
            query = sql`${query} AND ${experienciaExpr} >= ${parseInt(experienciaMin, 10)}`;
        }

        query = sql`${query} GROUP BY t.id_tutor ORDER BY t.nombre, t.apellido`;

        const result = await query;

        const excluded = await sql`
            SELECT t.id_tutor, t.nombre, t.apellido, s.id_sesion, s.fecha_sesion, s.hora_sesion
            FROM sesion s
            JOIN tutor t ON s.id_tutor = t.id_tutor
            WHERE s.id_estudiante = ${studentId} AND s.estado = 'Activa'
        `;

        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                tutores_con_sesion_pendiente: excluded,
                message:
                    excluded.length > 0
                        ? `Tienes ${excluded.length} tutor(es) con sesion pendiente que no aparecen en el catalogo`
                        : "No se encontraron tutores con los filtros aplicados",
            });
        }

        const data = result.map((r) => ({
            ...r,
            dias_atencion: Array.isArray(r.dias_atencion)
                ? r.dias_atencion.map(normalizeDayName)
                : [],
        }));

        return res.status(200).json({
            success: true,
            data: data,
            tutores_con_sesion_pendiente: excluded,
            message:
                excluded.length > 0
                    ? `Tienes ${excluded.length} tutor(es) con sesion pendiente que no aparecen en el catalogo`
                    : undefined,
        });
    } catch (error) {
        console.error("Error al buscar tutores:", error.message);
        return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = {
    getTutorCatalog,
    getTutorAvailability,
    createSession,
    searchTutors,
};
