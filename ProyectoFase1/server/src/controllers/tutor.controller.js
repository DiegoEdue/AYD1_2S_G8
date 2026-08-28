const scheduleModel = require('../models/schedule')
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']; 
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:MM

// Configuración de Horarios de Atención del Tutor
// GET /api/tutor/schedule
const getSchedule = async (req, res) => {
    const id_Tutor = req.user.id; // id se obtiene por la verificación del token
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

module.exports = {
    getSchedule,
    upsertSchedule
}