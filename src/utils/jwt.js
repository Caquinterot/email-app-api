import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function signToken(payload, opts = {}) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h', ...opts });
}

export function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET);
}
