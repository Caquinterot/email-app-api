import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:5000'],
		credentials: true,
	}),
);
app.use(express.json());

app.get('/home', (_req, res) => {
	res.json({ ok: true, service: 'emails-backend', env: process.env.NODE_ENV });
});

app.use('/api', routes);

// Manejo centralizado de errores (último middleware)

app.use(errorHandler);

export default app;
