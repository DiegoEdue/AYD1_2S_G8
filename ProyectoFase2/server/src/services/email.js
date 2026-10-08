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


/**
 * Envía un correo de aprobación o rechazo de cuenta.
 *
 * @param {object} opts
 * @param {string}  opts.to                - Dirección de correo del destinatario.
 * @param {string}  opts.name              - Nombre completo del usuario.
 * @param {boolean} opts.approved          - true = aprobado, false = rechazado.
 * @param {string}  [opts.reason]          - Motivo del rechazo (solo si approved=false).
 * @param {string}  [opts.verificationToken] - Token de verificación (solo si approved=true).
 * @param {'estudiante'|'tutor'} [opts.role='estudiante'] - Rol del usuario para personalizar el mensaje.
 */
const sendApprovalEmail = async ({
    to,
    name,
    approved,
    reason = '',
    verificationToken = null,
    role = 'estudiante',
}) => {
    // ── Asunto ────────────────────────────────────────────────────────────────
    const roleLabel = role === 'tutor' ? 'Tutor' : 'Estudiante';
    const subject = approved
        ? `¡Tu cuenta de ${roleLabel} en EduConnect ha sido Aprobada!`
        : `Actualización sobre tu solicitud de ${roleLabel} en EduConnect`;

    // ── Bloque de token (solo aprobación con token) ───────────────────────────
    const tokenBlock = verificationToken
        ? `
        <div style="background:#e8f5e9;border-radius:8px;padding:20px;margin:25px 0;border-left:4px solid #4CAF50;">
            <p style="margin:0 0 10px;font-size:14px;color:#2E7D32;">
                <strong>Para tu primer inicio de sesión usa este código de verificación:</strong>
            </p>
            <div style="font-family:'Courier New',monospace;font-size:28px;font-weight:bold;
                        color:#1B5E20;letter-spacing:4px;background:white;padding:15px;
                        border-radius:4px;border:2px dashed #4CAF50;text-align:center;">
                ${verificationToken}
            </div>
            <p style="margin:15px 0 0;font-size:13px;color:#666;">
                Guarda este código. Si no lo tienes disponible, puedes solicitar uno nuevo desde la pantalla de inicio de sesión.
            </p>
        </div>`
        : '';

    // ── Mensaje específico por rol (aprobación) ───────────────────────────────
    const roleApprovalNote = role === 'tutor'
        ? `<p style="font-size:15px;line-height:1.6;background:#f1f8e9;padding:12px 16px;
                     border-radius:6px;border-left:4px solid #8BC34A;">
               Como <strong>Tutor</strong>, ya puedes configurar tu horario de atención,
               publicar tus materias de tutoría y comenzar a recibir solicitudes de sesión.
           </p>`
        : `<p style="font-size:15px;line-height:1.6;background:#f1f8e9;padding:12px 16px;
                     border-radius:6px;border-left:4px solid #8BC34A;">
               Como <strong>Estudiante</strong>, ya puedes buscar tutores disponibles,
               reservar sesiones y gestionar tu plan de estudio en EduConnect.
           </p>`;

    // ── HTML completo ─────────────────────────────────────────────────────────
    const html = approved
        ? `
        <div style="font-family:Arial,sans-serif;padding:20px;color:#333;max-width:600px;margin:0 auto;">
            <div style="background:#1B5E20;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
                <h1 style="margin:0;font-size:28px;">EduConnect</h1>
                <p style="margin:10px 0 0;opacity:0.9;">Plataforma de Tutorías Académicas</p>
            </div>
            <div style="background:#fff;padding:30px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;">
                <h2 style="color:#1B5E20;margin-top:0;">¡Felicidades, ${name}!</h2>
                <p style="font-size:16px;line-height:1.6;">
                    Nos alegra informarte que tu solicitud de registro como
                    <strong>${roleLabel}</strong> en <strong>EduConnect</strong>
                    ha sido <strong style="color:#2E7D32;">APROBADA</strong>
                    por el equipo administrativo.
                </p>
                ${tokenBlock}
                ${roleApprovalNote}
                <p style="font-size:16px;line-height:1.6;">
                    Ya puedes acceder a la plataforma iniciando sesión con tu correo
                    electrónico, contraseña y el código de verificación.
                </p>
                <hr style="border:none;border-top:1px solid #e0e0e0;margin:25px 0;">
                <p style="font-size:12px;color:#999;margin:0;text-align:center;">— Equipo EduConnect</p>
            </div>
        </div>`
        : `
        <div style="font-family:Arial,sans-serif;padding:20px;color:#333;max-width:600px;margin:0 auto;">
            <div style="background:#C62828;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
                <h1 style="margin:0;font-size:28px;">EduConnect</h1>
                <p style="margin:10px 0 0;opacity:0.9;">Plataforma de Tutorías Académicas</p>
            </div>
            <div style="background:#fff;padding:30px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;">
                <h2 style="color:#C62828;margin-top:0;">Estimado/a ${name},</h2>
                <p style="font-size:16px;line-height:1.6;">
                    Lamentamos informarte que tu solicitud de registro como
                    <strong>${roleLabel}</strong> en <strong>EduConnect</strong>
                    ha sido <strong style="color:#C62828;">RECHAZADA</strong>
                    por el equipo administrativo.
                </p>
                ${reason
                    ? `<div style="background:#fbe9e7;padding:15px;border-radius:4px;border-left:4px solid #f44336;margin:20px 0;">
                           <p style="margin:0;"><strong>Motivo:</strong> ${reason}</p>
                       </div>`
                    : ''}
                <p style="font-size:15px;line-height:1.6;">
                    Si consideras que ha sido un error o deseas obtener más información,
                    por favor contacta con el equipo de soporte de EduConnect.
                </p>
                <hr style="border:none;border-top:1px solid #e0e0e0;margin:25px 0;">
                <p style="font-size:12px;color:#999;margin:0;text-align:center;">— Equipo EduConnect</p>
            </div>
        </div>`;

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
    const subject = 'Verifica tu correo electrónico - EduConnect';
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: #1B5E20; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">EduConnect</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Plataforma de Tutorías Académicas</p>
            </div>
            <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
                <h2 style="color: #1B5E20; margin-top: 0;">¡Bienvenido, ${name}!</h2>
                <p style="font-size: 16px; line-height: 1.6;">Gracias por registrarte en EduConnect. Para completar tu registro y garantizar la seguridad de tu cuenta, por favor verifica tu dirección de correo electrónico.</p>
                
                <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Tu código de verificación:</p>
                    <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #1B5E20; letter-spacing: 4px; background: white; padding: 15px; border-radius: 4px; border: 2px dashed #1B5E20;">
                        ${token}
                    </div>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 25px;">
                    <strong>Importante:</strong> Este código expira en <strong>24 horas</strong>. 
                    Si no fuiste tú quien solicitó este registro, por favor ignora este correo.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
                <p style="font-size: 12px; color: #999; margin: 0; text-align: center;">— Equipo EduConnect</p>
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
        console.error('Error al enviar el correo de verificación:', error);
        return { success: false, error };
    }
};

module.exports = { 
    sendCancellationEmail, 
    sendApprovalEmail, 
    sendDeactivationEmail,
    sendVerificationEmail 
};
