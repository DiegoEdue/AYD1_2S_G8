const scheduleModel = require('../models/schedule')
const sessionModel = require('../models/session')
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']; 
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:MM

// Configuración de Horarios de Atención del Tutor
// GET /api/tutor/schedule
const getSchedule = async (req, res) => {
    const id_Tutor = req.user?.id || 1; // id se obtiene por la verificación del token
    try {
        const horario = await scheduleModel.gethorarioByTutorId(id_Tutor);

        if (!horario) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

        return res.status(200).json({ 
            message: 'Horario obtenido exitosamente' , 
            data: horario 
        });
    } catch (error) {
        console.error('Error al obtener el horario:', error);
        res.status(500).json({ message: 'Error al obtener el horario' });
    }
}

// PUT /api/tutor/schedule
// podria ser post, pero cuando querramos actualizar el horario de atencion del tutor, es mas adecuado usar put, este actuara como un upsert, si no existe el horario lo crea, si existe lo actualiza
const upsertSchedule = async (req, res) => {
    const id_Tutor = req.user.id;
    const { dias, startTime, endTime } = req.query;

    if (!dias || !startTime || !endTime) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos.' });
    }

    if (!Array.isArray(dias) || dias.length === 0 || !dias.every((d) => days.includes(d))){
        return res.status(400).json({ message: 'Días de atención inválidos.' });
    }

    // para evitar colocar el regex 2 veces, ponemos la constante
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({ message: 'Formato de hora invalido' });
    }

    if (startTime >= endTime) {
        return res.status(400).json({ message: 'La hora de inicio debe ser menor que la hora de fin.' });
    }
    
    try {
        const horario = await scheduleModel.upsert(id_Tutor, { dias, startTime, endTime })
        return res.status(200).json({
            message: 'Horario creado/actualizado exitosamente',
            data: horario
        })
    } catch (error) {
        console.error('Error al insertar el horario:', error);
        res.status(500).json({ message: 'Error al insertar el horario' });
    }
}

// Visualización de Sesiones Pendientes del Tutor
// GET /api/tutor/sessions/pending
const getPendingSessions = async (req, res) => {
    const id_Tutor = req.user?.id || 1; // id se obtiene por la verificación del token

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
            data: response
        });
    } catch (error) {
        console.error('Error al obtener las sesiones pendientes:', error);
        res.status(500).json({ message: 'Error al obtener las sesiones pendientes' });
    }
}

// Registro de Atención y Resumen de Tutoría
// PATCH /api/tutor/sessions/:id/attend
const attendSession = async (req, res) => {
    const { id } = req.params;
    const { resumen } = req.body;
    
    if (!id) { 
        return res.status(400).json({ message: 'ID de sesión inválido.' }); 
    }

    if (!resumen || resumen.trim().length === 0 || typeof resumen !== 'string') {
        return res.status(400).json({ message: 'El resumen es requerido y debe ser una cadena de texto.' });
    }

    try {
        const session = await sessionModel.findSessionById(id);
        if (!session) {
            return res.status(404).json({ message: 'Sesión no encontrada.' });
        }
        if (session.estado !== 'Activa') {
            return res.status(400).json({ message: 'La sesión no está activa y no puede ser atendida.' });
        }

        const updatedSession = await sessionModel.attendSession(id, resumen.trim());
        return res.status(200).json({
            message: 'Sesión atendida exitosamente',
            data: updatedSession
        });
    } catch (error) {
        console.error('Error al registrar la atención de la sesión:', error);
        res.status(500).json({ message: 'Error al registrar la atención de la sesión' });
    }
}


module.exports = {
    getSchedule,
    upsertSchedule,
    getPendingSessions,
    attendSession
}