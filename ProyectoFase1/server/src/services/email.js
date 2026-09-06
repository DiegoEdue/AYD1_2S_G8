const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY); // Inicializa el cliente de Resend con la clave de API la api las pasare

const sendCancellationEmail = async ({ to, tutorName, studentName, date, time, subject, reason }) => {
    const html = `
        <h2>Estimado estudiante ${studentName},</h2>
        <p>Lamentamos informarle que su sesión de tutoría ha sido cancelada por el tutor.</p>
        <ul>
            <li><b>Tutor:</b> ${tutorName}</li>
            <li><b>Materia:</b> ${subject}</li>
            <li><b>Fecha:</b> ${date}</li>
            <li><b>Hora:</b> ${time}</li>
            <li><b>Motivo reportado:</b> ${reason}</li>
        </ul>
        <p>Le ofrecemos una sincera disculpa por los inconvenientes causados.</p>
        <p>— Equipo EduConnect</p>
    `;

    return await resend.emails.send({
        from: `"EduConnect" <onboarding@resend.dev>`,
        to: to, 
        subject: `Notificación de Cancelación de Tutoría - ${subject}`,
        html,
    });
};


const sendApprovalEmail = async ({ to, name, approved, reason = '' }) => {
    const subject = approved
        ? 'Tu cuenta en EduConnect ha sido Aprobada'
        : 'Actualización sobre tu registro en EduConnect';

    const html = approved
        ? `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4CAF50;">¡Felicidades, ${name}!</h2>
            <p>Nos alegra informarte que tu solicitud de registro en <strong>EduConnect</strong> ha sido <strong>APROBADA</strong> por el equipo administrativo.</p>
            <p>Ya puedes acceder a la plataforma iniciando sesión con tu correo electrónico y contraseña.</p>
            <hr />
            <p style="font-size: 12px; color: #777;">— Equipo EduConnect</p>
        </div>
        `
        : `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #f44336;">Estimado/a ${name},</h2>
            <p>Lamentamos informarte que tu solicitud de registro en <strong>EduConnect</strong> ha sido <strong>RECHAZADA</strong> por el equipo administrativo.</p>
            ${reason ? `<p><b>Motivo reportado:</b> ${reason}</p>` : ''}
            <p>Si consideras que ha sido un error, por favor contacta con el soporte del sistema.</p>
            <hr />
            <p style="font-size: 12px; color: #777;">— Equipo EduConnect</p>
        </div>
        `;

    return await resend.emails.send({
        from: `"EduConnect" <onboarding@resend.dev>`,
        to,
        subject,
        html,
    });
};

module.exports = { sendCancellationEmail, sendApprovalEmail };
