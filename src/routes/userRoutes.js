import { Router } from 'express';
import authenticate from '../middlewares/authenticate.js';
import {
	register,
	verify,
	login,
	me,
	listUsers,
	getUser,
	removeUser,
	updateUser,
	requestResetPassword,
	resetPassword,
	devGetCodeByEmail,
} from '../controllers/userController.js';

const router = Router();

// Públicos
router.post('/', register); // POST /api/users
router.get('/verify/:code', verify); // GET  /api/users/verify/:code
router.post('/login', login); // POST /api/users/login

// Password reset (opcional)
router.post('/reset_password', requestResetPassword);
router.post('/reset_password/:code', resetPassword);

// Dev helper para ver el código de verificación
router.get('/dev/code', devGetCodeByEmail);

// Protegidos
router.get('/me', authenticate, me);
router.get('/', authenticate, listUsers);
router.get('/:id', authenticate, getUser);
router.delete('/:id', authenticate, removeUser);
router.put('/:id', authenticate, updateUser);

export default router;
