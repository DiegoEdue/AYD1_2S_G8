const { comparePassword, hashPassword } = require('../utils/bcrypt')
const scheduleModel = require('../models/schedule')
const sessionModel = require('../models/session')
const tutorModel = require('../models/tutor')
const ratingModel = require('../models/rating')
const reportModel = require('../models/report')
const { sendCancellationEmail } = require('../services/email')
const { subirImagen } = require('../utils/cloudinaryUpload')

// Validación de días y horas

const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:MM
// Datos que no esta permitido actualizar
const NON_EDITABLE_FIELDS = [
    'id',
    'correo',
    'carnetId',
    'numeroIdentificacionTutor',
    'estadoAprobacion',
    'fechaRegistro',
    'aprobadoPor',
    'horaInicioAtencion',
    'horaFinAtencion'
];

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Configuración de Horarios de Atención del Tutor (HU-010)
// GET /api/tutor/schedule
const getSchedule = async (req, res) => {
    const id_Tutor = req.user.id; // id se obtiene por la verificación del token
    try {
        const horario = await scheduleModel.findhorarioByTutorId(id_Tutor);

        if (!horario) {
            return res.status(404).json({ message: 'Horario no encontrado', status: "error" });
        }

        return res.status(200).json({
            message: 'Horario obtenido exitosamente',
            status: 'success',
            data: horario
        });
    } catch (error) {
        console.error('Error al obtener el horario:', error);
        res.status(500).json({ message: 'Error al obtener el horario', status: "error" });
    }
}

// PUT /api/tutor/schedule
// podria ser post, pero cuando querramos actualizar el horario de atencion del tutor, es mas adecuado usar put, este actuara como un upsert, si no existe el horario lo crea, si existe lo actualiza
const upsertSchedule = async (req, res) => {
    const id_Tutor = req.user.id;
    const { dias, startTime, endTime } = { ...req.body, ...req.query };

    if (!dias || !startTime || !endTime) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos.', status: "error" });
    }

    let parsedDias = dias;
    if (typeof dias === 'string') {
        try {
            parsedDias = JSON.parse(dias);
        } catch {
            parsedDias = dias.split(',');
        }
    }

    if (!Array.isArray(parsedDias) || parsedDias.length === 0 || !parsedDias.every((d) => days.includes(d))) {
        return res.status(400).json({ message: 'Días de atención inválidos.', status: "error" });
    }

    // para evitar colocar el regex 2 veces, ponemos la constante
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({ message: 'Formato de hora invalido', status: "error" });
    }

    if (startTime >= endTime) {
        return res.status(400).json({ message: 'La hora de inicio debe ser menor que la hora de fin.', status: "error" });
    }

    try {
        // HU-011: Validar que no existan sesiones activas/programadas fuera del nuevo horario
        const conflictos = await scheduleModel.findConflictingSessions(id_Tutor, { dias: parsedDias, startTime, endTime });
        if (conflictos.length > 0) {
            return res.status(409).json({
                message: 'No se puede actualizar el horario: tienes sesiones activas o programadas fuera del nuevo rango horario. Cancela o reprograma dichas sesiones primero.',
                status: 'error',
                data: conflictos
            });
        }

        const horario = await scheduleModel.upsert(id_Tutor, { dias: parsedDias, startTime, endTime })
        return res.status(200).json({
            message: 'Horario creado/actualizado exitosamente',
            data: horario,
            status: 'success'
        })
    } catch (error) {
        console.error('Error al insertar el horario:', error);
        res.status(500).json({ message: 'Error al insertar el horario', status: "error" });
    }
}

// Visualización de Sesiones Pendientes del Tutor (HU-012)
// GET /api/tutor/sessions/pending
const getPendingSessions = async (req, res) => {
    const id_Tutor = req.user.id; // id se obtiene por la verificación del token

    try {
        const sesionesPendientes = await sessionModel.getSesionesPendientesByTutorId(id_Tutor);
        const response = sesionesPendientes.map((s) => ({
            id: s.id,
            fecha: s.fecha,
            hora: s.hora,
            estudiante: s.estudiante,
            materia: s.materia,
            motivo: s.motivo
        }));

        return res.status(200).json({
            message: 'Sesiones pendientes obtenidas exitosamente',
            status: 'success',
            data: response
        });
    } catch (error) {
        console.error('Error al obtener las sesiones pendientes:', error);
        res.status(500).json({ message: 'Error al obtener las sesiones pendientes', status: "error" });
    }
}
// Historial de Sesiones del Tutor (HU-015)
// GET /api/tutor/sessions/history?page=1&pageSize=20
const getHistorySessions = async (req, res) => {
    const tutorId = req.user.id;
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.pageSize, 10);
    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) limit = 20;
    try {
        const { data: sesiones, total } = await sessionModel.findHistoryByTutor(tutorId, { page, limit });
        return res.status(200).json({
            message: 'Historial de sesiones obtenido exitosamente',
            status: 'success',
            data: sesiones,
            total: total
        });
    } catch (error) {
        console.error('Error al obtener el historial de sesiones:', error);
        return res.status(500).json({ message: 'Error al obtener el historial de sesiones', status: 'error' });
    }
}

// Registro de Atención y Resumen de Tutoría (HU-013)
// PATCH /api/tutor/sessions/:id/attend
// Modificación con Registro de Plan de Estudio Estructurado (HU-035)
const VALID_RESOURCE_TYPES = ['Texto', 'Video', 'PDF', 'Enlace', 'Imagen'];
const attendSession = async (req, res) => {
    const { id } = req.params;
    const { dificultades, recursos } = req.body;
    const id_Tutor = req.user.id;

    if (!id) {
        return res.status(400).json({ message: 'ID de sesión inválido.' });
    }

    if (!dificultades || dificultades.trim().length === 0 || typeof dificultades !== 'string') {
        return res.status(400).json({ message: 'La dificultad es requerido y debe ser una cadena de texto.', status: 'error' });
    }

    if (!Array.isArray(recursos) || recursos.length === 0) {
        return res.status(400).json({ message: 'Los recursos son requeridos.', status: 'error' });
    }

    for (const [index, resource] of recursos.entries()) {
        if (!resource || typeof resource.nombre !== 'string' || resource.nombre.trim().length === 0) {
            return res.status(400).json({ message: `El recurso ${index + 1} se requiere un nombre válido.`, status: 'error' });
        }
        if (!VALID_RESOURCE_TYPES.includes(resource.tipo)) {
            return res.status(400).json({ 
                message: `El recurso ${index + 1} tiene un tipo inválido. Este debe de ser uno de: ${VALID_RESOURCE_TYPES.join(', ')}`, 
                status: 'error' 
            });
        }
        if (!resource.descripcion || typeof resource.descripcion !== 'string' || resource.descripcion.trim().length === 0) {
            return res.status(400).json({ message: `El recurso ${index + 1} se requiere una descripción válida.`, status: 'error' });
        }
    }

    try {
        const sesion = await sessionModel.findSessionByIdAndTutorId(id, id_Tutor);
        if (!sesion) {
            return res.status(404).json({ message: 'Sesión no encontrada.', status: 'error' });
        }
        if (sesion.estado !== 'Activa') {
            return res.status(400).json({ message: 'La sesión no está activa y no puede ser atendida.', status: 'error' });
        }

        const updatedSession = await sessionModel.markAttended(id, id_Tutor, {
            difficulties: dificultades.trim(),
            resources: recursos,
        });
        return res.status(200).json({
            message: 'Sesión atendida exitosamente',
            status: 'success',
            data: updatedSession
        });
    } catch (error) {
        console.error('Error al registrar la atención de la sesión:', error);
        res.status(500).json({ message: 'Error al registrar la atención de la sesión', status: 'error' });
    }
}

// Obtener detalles de una sesión del tutor por su ID para HU-035
// GET /api/tutor/sessions/:id/detail
const getSessionDetails = async (req, res) => {
    const { id } = req.params;
    const id_Tutor = req.user.id;

    try {
        const sessionDetails = await sessionModel.findSessionDetailByIdAndTutorId(id, id_Tutor);
        if (!sessionDetails) {
            return res.status(404).json({ message: 'Sesión no encontrada.', status: 'error' });
        }
        res.status(200).json({
            message: 'Detalles de la sesión obtenidos con exito',
            status: 'success',
            data: sessionDetails
        });
    } catch (error) {
        console.error('Error al obtener los detalles de la sesión:', error);
        res.status(500).json({ message: 'Error al obtener los detalles de la sesión', status: 'error' });
    }
}

// Cancelación de Sesión por Parte del Tutor con Notificación por Correo (HU-014)
// PATCH /api/tutor/sessions/:id/cancel
const cancelSession = async (req, res) => {
    const { id } = req.params;
    const id_Tutor = req.user.id;

    try {
        const sesioninfo = await sessionModel.findSessionByIdAndTutorId(id, id_Tutor);
        if (!sesioninfo) {
            return res.status(404).json({ message: 'Sesión no encontrada.', status: 'error' });
        }
        if (sesioninfo.estado !== 'Activa') {
            return res.status(400).json({ message: 'La sesión no está activa y no puede ser cancelada.', status: 'error' });
        }

        const actualizadoSesion = await sessionModel.markCancelledByTutor(id, id_Tutor);

        let emailSent = false;
        try {
            await sendCancellationEmail({
                to: sesioninfo.correoEstudiante,
                tutorName: sesioninfo.tutor,
                studentName: sesioninfo.estudiante,
                date: sesioninfo.fecha,
                time: sesioninfo.hora,
                subject: sesioninfo.materia,
                reason: sesioninfo.motivo,
            });
            emailSent = true;
        } catch (emailError) {
            console.error('Error al enviar el correo de notificación:', emailError);
        }

        return res.status(200).json({
            message: 'Sesión cancelada exitosamente',
            status: 'success',
            data: actualizadoSesion,
            emailSent
        });

    } catch (error) {
        console.error('Error al cancelar la sesión por parte del tutor:', error);
        res.status(500).json({ message: 'Error al cancelar la sesión', status: 'error' });
    }
}

// Consulta y Actualización de Perfil del Tutor (HU-016)
// GET /api/tutor/profile

// PATCH /api/tutor/profile
const updateProfile = async (req, res) => {
    const tutorId = req.user.id;
    const body = req.body || {};
    try {
        // Verificar si se están intentando actualizar campos no permitidos
        const blocked = NON_EDITABLE_FIELDS.filter((f) => Object.prototype.hasOwnProperty.call(body, f));
        if (blocked.length > 0) {
            return res.status(400).json({
                message: `No se pueden actualizar los siguientes campos: ${blocked.join(', ')}`,
                status: 'error'
            });
        }

        const updatedData = {};
        for (const jskey of Object.keys(tutorModel.EDITABLE_FIELDS)) {
            if (Object.prototype.hasOwnProperty.call(body, jskey)) {
                updatedData[jskey] = body[jskey];
            }
        }

        if (typeof body.password === 'string' && body.password.length > 0) {
            if (!passwordRegex.test(body.password)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La contraseña debe tener al menos 8 caracteres e incluir mayúscula, minúscula y número.',
                });
            }

            const currentPasswordHash = await tutorModel.findPasswordHashById(tutorId);
            if (currentPasswordHash) {
                const isSamePassword = await comparePassword(body.password, currentPasswordHash);
                if (isSamePassword) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'La nueva contraseña no puede ser la misma que la actual.',
                    });
                }
            }
            updatedData.passwordHash = await hashPassword(body.password);
        }

        if (typeof updatedData.fotoUrl === 'string' && updatedData.fotoUrl.startsWith('data:image/')) {
            updatedData.fotoUrl = await subirImagen(updatedData.fotoUrl, 'educonnect/tutores');
        }

        if (Object.prototype.hasOwnProperty.call(body, 'especialidad')) {
            const materias = (Array.isArray(body.especialidad) ? body.especialidad : String(body.especialidad).split(','))
                .map((materia) => String(materia).trim())
                .filter(Boolean)
                .filter((materia, index, lista) => lista.findIndex((item) => item.toLowerCase() === materia.toLowerCase()) === index);

            await tutorModel.updateSubjects(tutorId, materias);
        }

        if (Object.keys(updatedData).length === 0 && !Object.prototype.hasOwnProperty.call(body, 'especialidad')) {
            return res.status(400).json({
                message: 'No se proporcionaron campos válidos para actualizar.',
                status: 'error'
            });
        }

        if (updatedData.anioInicioTutorias !== undefined) {
            const currentYear = new Date().getFullYear();
            const anio = Number(updatedData.anioInicioTutorias);
            if (!Number.isInteger(anio) || anio < 1950 || anio > currentYear) {
                return res.status(400).json({
                    status: 'error',
                    message: `El año de inicio de tutorías debe ser un número entero entre 1950 y ${currentYear}.`,
                });
            }
        }

        // Actualizar el perfil del tutor en la base de datos
        const updatedTutor = await tutorModel.updateProfile(tutorId, updatedData);
        if (!updatedTutor) {
            console.error('Error al actualizar el perfil del tutor');
            return res.status(404).json({
                status: 'error',
                message: 'Error al actualizar el perfil del tutor. Tutor no encontrado.',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Perfil actualizado exitosamente.',
            data: updatedTutor,
            rol: 'tutor',
        });
    } catch (error) {
        console.error('Error al validar la contraseña:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al validar la contraseña.',
        });
    }
}


// Calificar Desempeño del Estudiante, HU-036
// PUT /api/tutor/sessions/:id/rating
const rateStudent = async (req, res) => {
    const { id } = req.params;
    const { estrellas, comentario } = req.body;
    const id_Tutor = req.user.id;

    if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
        return res.status(400).json({
            status: 'error',
            message: 'La calificación debe ser un número entero entre 1 y 5.',
        });
    }

    if (!comentario || typeof comentario !== 'string' || comentario.trim().length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'El comentario es obligatorio.',
        });
    }

    if (comentario.trim().length > 500) {
        return res.status(400).json({
            status: 'error',
            message: 'El comentario no puede exceder los 500 caracteres.',
        });
    }

    try {
        const sesioninfo = await sessionModel.findSessionByIdAndTutorId(id, id_Tutor);
        if (!sesioninfo) {
            return res.status(404).json({ status: 'error', message: 'Sesión no encontrada.' });
        }
        if (sesioninfo.estado !== 'Atendida') {
            return res.status(400).json({ status: 'error', message: 'La sesión solo puede ser calificada cuando está atendida.' });
        }

        const ratingData = await ratingModel.upsertRating(
            sesioninfo.id,
            sesioninfo.id_estudiante,
            sesioninfo.id_tutor,
            {
            estrellas,
            comentario: comentario.trim(),
        });

        if (!ratingData) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al guardar la calificación.',
            });
        }

        return res.status(ratingData.created ? 201 : 200).json({
            status: 'success',
            message: 'Calificación guardada exitosamente.',
            data: ratingData,
        });
    } catch (error) {
        console.error('Error al calificar la sesión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al calificar la sesión.',
        });
    }
}

// Reportar Estudiante Problemático, HU-037
// POST /api/tutor/sessions/:id/report
const CATEGORIAS_REPORTE_VALIDAS = ['Conducta_Inapropiada', 'Falsificacion_Documentos','Agresion_Verbal_Fisica', 'Robo_Dano_Instalaciones', 'Plagio_Copia', 'Inasistencia_Injustificada', 'Incumplimiento_Acuerdos', 'Acoso_Bullying', 'Portacion_Objetos_Peligrosos'];
const reportStudent = async (req, res) => {
    const { id } = req.params;
    const { categoria, motivo } = req.body;
    const id_Tutor = req.user.id;

    if (!CATEGORIAS_REPORTE_VALIDAS.includes(categoria)) {
        return res.status(400).json({
            status: 'error',
            message: `Categoría de reporte inválida. Debe de ser una de: ${CATEGORIAS_REPORTE_VALIDAS.join(', ')}`,
        });
        // if (!categoria || typeof categoria !== 'string' || categoria.trim().length === 0) {
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'La categoría del reporte es obligatoria.',
        //     });
        // }
    }

    if (!motivo || typeof motivo !== 'string' || motivo.trim().length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'El motivo del reporte es obligatorio.',
        });
    }

    try {
        const sesioninfo = await sessionModel.findSessionByIdAndTutorId(id, id_Tutor);
        if (!sesioninfo) {
            return res.status(404).json({ status: 'error', message: 'Sesión no encontrada.' });
        }
        if (sesioninfo.estado !== 'Atendida') {
            return res.status(400).json({ status: 'error', message: 'La sesión solo puede ser calificada cuando está atendida.' });
        }

        const reportData = await reportModel.createStudentReport(
            sesioninfo.id,
            sesioninfo.id_tutor,
            sesioninfo.id_estudiante,
            {
                categoria,
                motivo: motivo.trim(),
            }
        );

        if (!reportData) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear el reporte del estudiante.',
            });
        }

        if (reportData.duplicate) {
            return res.status(409).json({
                status: 'error',
                message: 'Ya existe un reporte para esta sesión y estudiante.',
            });
        }

        return res.status(201).json({
            status: 'success',
            message: 'Reporte creado exitosamente.',
            data: reportData,
        });
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al crear el reporte.',
        });
    }
}

module.exports = {
    getSchedule,
    getSessionDetails,
    upsertSchedule,
    getPendingSessions,
    getHistorySessions,
    attendSession,
    cancelSession,
    updateProfile,
    rateStudent,
    reportStudent,
}