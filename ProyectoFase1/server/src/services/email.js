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

const sendVerificationEmail = async ({ to, name, token }) => {
    const subject = 'Verifica tu cuenta en EduConnect - Token de Verificación';

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2E7D32; margin: 0;">EduConnect</h1>
                <p style="color: #666; font-size: 14px;">Plataforma de Tutorías Académicas</p>
            </div>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0;">¡Bienvenido/a, ${name}!</h2>
                <p style="font-size: 16px; line-height: 1.5;">Gracias por registrarte en <strong>EduConnect</strong>. Para completar tu registro y garantizar la seguridad de tu cuenta, necesitas verificar tu dirección de correo electrónico.</p>
                
                <div style="background-color: #fff; border: 2px solid #2E7D32; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Tu token de verificación es:</p>
                    <code style="font-size: 24px; font-weight: bold; color: #2E7D32; letter-spacing: 2px; font-family: 'Courier New', monospace;">${token}</code>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-bottom: 0;"><strong>Importante:</strong> Este token expira en <strong>24 horas</strong>. Úsalo en tu primer inicio de sesión en la plataforma.</p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                <p style="font-size: 12px; color: #999; margin: 0;">— Equipo EduConnect</p>
                <p style="font-size: 11px; color: #bbb; margin: 10px 0 0 0;">Si no solicitaste este registro, por favor ignora este correo.</p>
            </div>
        </div>
    `;

    try {
        const data = await transporter.sendMail({
            from: MAIL_FROM,
            to,
            subject,
            html,
        });
        console.log('Correo de verificación enviado:', data.messageId);
        return { success: true, data };
    } catch (error) {
        console.error('Error al enviar el correo de verificación (nodemailer):', error);
        return { success: false, error };
    }
};

module.exports = { sendCancellationEmail, sendApprovalEmail, sendDeactivationEmail, sendVerificationEmail };
