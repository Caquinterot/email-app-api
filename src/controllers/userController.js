import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt.js';
import { User, EmailCode } from '../models/index.js';
import {
	sendVerificationEmail,
	sendResetPasswordEmail,
} from '../utils/emailService.js';

// Helpers
function publicUser(u) {
	const {
		id,
		firstName,
		lastName,
		email,
		country,
		Image,
		isverified,
		createdAt,
		updatedAt,
	} = u;
	return {
		id,
		firstName,
		lastName,
		email,
		country,
		Image,
		isverified,
		createdAt,
		updatedAt,
	};
}

// POST /api/users  (registro)
export const register = async (req, res) => {
	const { firstName, lastName, email, password, country, Image } = req.body;

	const exists = await User.findOne({ where: { email } });
	if (exists) {
		return res
			.status(400)
			.json({ error: true, message: 'Email ya registrado' });
	}

	const hash = await bcrypt.hash(password, 10);

	const user = await User.create({
		firstName,
		lastName,
		email,
		password: hash,
		country: country || null,
		Image: Image || null,
	});

	const code = crypto.randomBytes(32).toString('hex');
	await EmailCode.create({ code, user_id: user.id });

	// Intenta enviar email; si falla, no bloqueamos el registro
	try {
		await sendVerificationEmail(email, code);
	} catch (e) {
		console.error('Error enviando email de verificación:', e.message || e);
	}

	// Para Postman y desarrollo: devolvemos el code para que puedas verificar sin correo
	const payload = { user: publicUser(user) };
	if (process.env.NODE_ENV === 'development') payload.devCode = code;

	res.status(201).json(payload);
};

// GET /api/users/verify/:code
export const verify = async (req, res) => {
	const { code } = req.params;

	const found = await EmailCode.findOne({ where: { code } });
	if (!found) {
		return res
			.status(401)
			.json({ error: true, message: 'Código inválido o expirado' });
	}

	const user = await User.findByPk(found.user_id);
	if (!user) {
		return res
			.status(401)
			.json({ error: true, message: 'Usuario no encontrado' });
	}

	await user.update({ isverified: true });
	await EmailCode.destroy({ where: { code } });

	res.json({ ok: true, message: 'Usuario verificado' });
};

// POST /api/users/login
export const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ where: { email } });
	if (!user)
		return res
			.status(401)
			.json({ error: true, message: 'Credenciales inválidas' });

	const ok = await bcrypt.compare(password, user.password);
	if (!ok)
		return res
			.status(401)
			.json({ error: true, message: 'Credenciales inválidas' });

	if (!user.isverified) {
		return res
			.status(401)
			.json({ error: true, message: 'Cuenta no verificada' });
	}

	const token = signToken({ id: user.id });
	res.json({ user: publicUser(user), token });
};

// GET /api/users/me  (protegida)
export const me = async (req, res) => {
	res.json(publicUser(req.user));
};

// GET /api/users (protegida)
export const listUsers = async (_req, res) => {
	const users = await User.findAll();
	res.json(users.map(publicUser));
};

// GET /api/users/:id (protegida)
export const getUser = async (req, res) => {
	const user = await User.findByPk(req.params.id);
	if (!user)
		return res.status(404).json({ error: true, message: 'No encontrado' });
	res.json(publicUser(user));
};

// DELETE /api/users/:id (protegida)
export const removeUser = async (req, res) => {
	const id = Number(req.params.id);
	const user = await User.findByPk(id);
	if (!user)
		return res.status(404).json({ error: true, message: 'No encontrado' });
	await user.destroy();
	res.json({ ok: true });
};

// PUT /api/users/:id (protegida)  (sin actualizar password aquí)
export const updateUser = async (req, res) => {
	const id = Number(req.params.id);
	const user = await User.findByPk(id);
	if (!user)
		return res.status(404).json({ error: true, message: 'No encontrado' });

	const { firstName, lastName, country, Image } = req.body;
	await user.update({ firstName, lastName, country, Image });
	res.json(publicUser(user));
};

// --------- Reto opcional: Reset password ---------

// POST /api/users/reset_password
export const requestResetPassword = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ where: { email } });
	if (!user)
		return res
			.status(401)
			.json({ error: true, message: 'Email no encontrado' });

	const code = crypto.randomBytes(32).toString('hex');
	await EmailCode.create({ code, user_id: user.id });

	try {
		await sendResetPasswordEmail(email, code);
	} catch (e) {
		console.error('Error enviando email de reset:', e.message || e);
	}

	const payload = { ok: true };
	if (process.env.NODE_ENV === 'development') payload.devCode = code;

	res.json(payload);
};

// POST /api/users/reset_password/:code
export const resetPassword = async (req, res) => {
	const { code } = req.params;
	const { password } = req.body;

	const found = await EmailCode.findOne({ where: { code } });
	if (!found)
		return res.status(401).json({ error: true, message: 'Código inválido' });

	const user = await User.findByPk(found.user_id);
	if (!user)
		return res
			.status(404)
			.json({ error: true, message: 'Usuario no encontrado' });

	const hash = await bcrypt.hash(password, 10);
	await user.update({ password: hash });

	await EmailCode.destroy({ where: { code } });

	res.json({ ok: true, message: 'Contraseña actualizada' });
};

// ---- Endpoint DEV para saber el código por email (opcional) ----
// GET /api/users/dev/code?email=...
export const devGetCodeByEmail = async (req, res) => {
	if (process.env.NODE_ENV !== 'development') {
		return res
			.status(403)
			.json({ error: true, message: 'Solo disponible en development' });
	}
	const { email } = req.query;
	const user = await User.findOne({ where: { email } });
	if (!user)
		return res
			.status(404)
			.json({ error: true, message: 'Usuario no encontrado' });

	const lastCode = await EmailCode.findOne({
		where: { user_id: user.id },
		order: [['created_at', 'DESC']],
	});

	if (!lastCode)
		return res
			.status(404)
			.json({ error: true, message: 'Sin códigos pendientes' });

	res.json({ email, code: lastCode.code });
};
