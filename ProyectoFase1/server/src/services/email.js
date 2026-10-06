//const { Resend } = require('resend')
//const resend = new Resend(process.env.RESEND_API_KEY); // Inicializa el cliente de Resend con la clave de API la api las pasare
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail')) || !process.env.SMTP_HOST ? 'gmail' : undefined,
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER || process.env.MAILTRAP_USER,
        pass: process.env.SMTP_PASS || process.env.MAILTRAP_PASS,
    },
});

const MAIL_FROM = process.env.MAIL_FROM || `"EduConnect" <${process.env.SMTP_USER || 'cachitoj8@gmail.com'}>`;

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

    try {
        const data = await transporter.sendMail({
            from: MAIL_FROM,
            to,
            subject: `Notificación de Cancelación de Tutoría - ${subject}`,
            html,
        });
        console.log('Correo de cancelación enviado:', data.messageId);
        return { success: true, data };
    } catch (error) {
        console.error('Error al enviar el correo de cancelación (nodemailer):', error);
        return { success: false, error };
    }
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

    try {
        const data = await transporter.sendMail({
            from: MAIL_FROM,
            to,
            subject,
            html,
        });
        console.log('Correo de aprobación/rechazo enviado:', data.messageId);
        return { success: true, data };
    } catch (err) {
        console.error('Error al enviar el correo de aprobación/rechazo (nodemailer):', err);
        return { success: false, error: err };
    }
};

const sendDeactivationEmail = async ({ to, name, role = 'usuario', reason = '' }) => {
    const subject = 'Notificación sobre el estado de tu cuenta en EduConnect';

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #d9534f;">Estimado/a ${name},</h2>
            <p>Te informamos que tu cuenta de <strong>${role}</strong> en la plataforma <strong>EduConnect</strong> ha sido <strong>DADA DE BAJA</strong> por el equipo administrativo.</p>
            ${reason ? `<p><b>Motivo especificado:</b> ${reason}</p>` : ''}
            <p>A partir de este momento, el acceso a tu cuenta se encuentra suspendido. Si consideras que ha sido un error o deseas solicitar aclaraciones, ponte en contacto con la administración.</p>
            <hr />
            <p style="font-size: 12px; color: #777;">— Equipo EduConnect</p>
        </div>
    `;

    try {
        const data = await transporter.sendMail({
            from: MAIL_FROM,
            to,
            subject,
            html,
        });
        console.log('Correo de desactivación enviado:', data.messageId);
        return { success: true, data };
    } catch (err) {
        console.error('Error al enviar el correo de desactivación (nodemailer):', err);
        return { success: false, error: err };
    }
};

module.exports = { sendCancellationEmail, sendApprovalEmail, sendDeactivationEmail };
