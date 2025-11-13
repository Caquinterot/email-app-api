import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	//host: process.env.EMAIL_HOST,
	//port: Number(process.env.EMAIL_PORT || 587),
	//secure: false, // TLS STARTTLS en 587
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS, // Usa APP PASSWORD de Gmail
	},
	tls: {
		//Evita "self-signed certificate in certificate chain" en dev
		rejectUnauthorized: true,
	},
});

export async function sendVerificationEmail(to, code) {
	// Para pruebas en Postman, el enlace apunta al backend directamente:
	const verifyUrl = `http://localhost:${
		process.env.PORT || 5000
	}/api/users/verify/${code}`;

	const mail = {
		from: process.env.EMAIL_USER,
		to,
		subject: 'Verifica tu cuenta',
		html: `
      <p>Gracias por registrarte.</p>
      <p>Haz clic para verificar tu cuenta:</p>
      <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
      <p>O usa este código: <b>${code}</b></p>
    `,
	};

	await transporter.sendMail(mail);
}

export async function sendResetPasswordEmail(to, code) {
	const resetUrl = `http://localhost:${
		process.env.PORT || 5000
	}/api/users/reset_password/${code}`;

	const mail = {
		from: `"Email App" <${process.env.EMAIL_USER}>`,
		to,
		subject: 'Recuperar contraseña',
		html: `
      <p>Solicitaste recuperar tu contraseña.</p>
      <p>Abre este enlace para continuar:</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p>O usa este código: <b>${code}</b></p>
    `,
	};

	await transporter.sendMail(mail);
}
