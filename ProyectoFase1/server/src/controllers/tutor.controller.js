const scheduleModel = require('../models/schedule')
const sessionModel = require('../models/session')
const { sendCancellationEmail } = require('../services/email')

// Validación de días y horas
const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:MM

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
            message: 'Horario obtenido exitosamente' , 
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
    const { dias, startTime, endTime } = req.query;

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

const getHistorySessions = async (req, res) => {
    const id_Tutor = req.user.id;
    try {
        const sesiones = await sessionModel.getHistorialByTutorId(id_Tutor);
        return res.status(200).json({
            message: 'Historial de sesiones obtenido exitosamente',
            status: 'success',
            data: sesiones,
        });
    } catch (error) {
        console.error('Error al obtener el historial de sesiones:', error);
        return res.status(500).json({ message: 'Error al obtener el historial de sesiones', status: 'error' });
    }
}

// Registro de Atención y Resumen de Tutoría (HU-013)
// PATCH /api/tutor/sessions/:id/attend
const attendSession = async (req, res) => {
    const { id } = req.params;
    const { resumen } = req.body;
    const tutorId = req.user.id;
    
    if (!id) { 
        return res.status(400).json({ message: 'ID de sesión inválido.' }); 
    }

    if (!resumen || resumen.trim().length === 0 || typeof resumen !== 'string') {
        return res.status(400).json({ message: 'El resumen es requerido y debe ser una cadena de texto.', status: 'error' });
    }

    try {
        const sesion = await sessionModel.findSessionByIdAndTutor(id, tutorId);
        if (!sesion) {
            return res.status(404).json({ message: 'Sesión no encontrada.', status: 'error' });
        }
        if (sesion.estado !== 'Activa') {
            return res.status(400).json({ message: 'La sesión no está activa y no puede ser atendida.', status: 'error' });
        }

        const updatedSession = await sessionModel.markAttended(id, resumen.trim());
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

// Cancelación de Sesión por Parte del Tutor con Notificación por Correo (HU-014)
// PATCH /api/tutor/sessions/:id/cancel
const cancelSession = async (req, res) => {
    const { id } = req.params;
    const tutorId = req.user.id;

    try {
        const sesioninfo = await sessionModel.findSessionByIdAndTutor(id, tutorId)
        if (!sesioninfo) {
            return res.status(404).json({ message: 'Sesión no encontrada.', status: 'error' });
        }
        if (sesioninfo.estado !== 'Activa') {
            return res.status(400).json({ message: 'La sesión no está activa y no puede ser cancelada.', status: 'error' });
        }

        const actualizadoSesion = await sessionModel.markCancelledByTutor(id);
        
        let emailSent = false;
        try {
            await sendCancellationEmail({
                to: sesioninfo.correoEstudiante,
                nombreTutor: sesioninfo.tutor,
                nombreEstudiante: sesioninfo.estudiante,
                fecha: sesioninfo.fecha,
                hora: sesioninfo.hora,
                materia: sesioninfo.materia,
                motivo: sesioninfo.motivo,
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


module.exports = {
    getSchedule,
    upsertSchedule,
    getPendingSessions,
    getHistorySessions,
    attendSession,
    cancelSession
}