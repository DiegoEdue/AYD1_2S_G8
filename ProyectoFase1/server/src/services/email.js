const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail')) ? 'gmail' : undefined,
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


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

    return await transporter.sendMail({
        from: `"EduConnect" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
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

    return await transporter.sendMail({
        from: `"EduConnect" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = { sendCancellationEmail, sendApprovalEmail, sendDeactivationEmail };

