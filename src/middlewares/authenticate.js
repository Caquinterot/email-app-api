import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export default async function authenticate(req, res, next) {
	try {
		const auth = req.headers.authorization || '';
		const [, token] = auth.split(' '); // Bearer <token>

		if (!token) {
			return res.status(401).json({ error: true, message: 'Token requerido' });
		}

		const payload = verifyToken(token);
		const user = await User.findByPk(payload.id);

		if (!user) {
			return res.status(401).json({ error: true, message: 'Token inválido' });
		}

		req.user = user;
		next();
	} catch (err) {
		err.status = 401;
		next(err);
	}
}
