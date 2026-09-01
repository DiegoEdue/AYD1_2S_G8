const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'educonnectcompany@gmail.com',
        pass: process.env.SMTP_PASS || 'tiwxlhlioromehdg',
    },
});

/**
 * 
 * @param {Object} params
 * @param {string} params.to - Correo del estudiante
 * @param {string} params.nombreTutor 
 * @param {string} params.nombreEstudiante 
 * @param {string} params.fecha - formato "YYYY-MM-DD"
 * @param {string} params.hora - formato "HH:MM"
 * @param {string} params.materia - Materia de la sesión
 * @param {string} params.motivo - Motivo de la cancelación
 */

const sendCancellationEmail = async ({ to, nombreTutor, nombreEstudiante, fecha, hora, materia, motivo }) => {
    const html = `
        <h2>Estimado estudiante ${nombreEstudiante},</h2>
        <p>Lamentamos informarle que su sesión de tutoría ha sido cancelada por el tutor.</p>
        <ul>
            <li><b>Tutor:</b> ${nombreTutor}</li>
            <li><b>Materia:</b> ${materia}</li>
            <li><b>Fecha:</b> ${fecha}</li>
            <li><b>Hora:</b> ${hora}</li>
            <li><b>Motivo reportado:</b> ${motivo}</li>
        </ul>
        <p>Le ofrecemos una sincera disculpa por los inconvenientes causados.</p>
        <p>— Equipo EduConnect</p>
    `;

    return await transporter.sendMail({
        from: `"EduConnect" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Notificación de Cancelación de Tutoría - EduConnect',
        html,
    });
};

module.exports = { sendCancellationEmail };