import 'dotenv/config';
import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = Number(process.env.PORT || 5000);

async function start() {
	try {
		await sequelize.authenticate();
		console.log('✅ Conexión a Postgres OK');

		// En desarrollo: crea/actualiza tablas automáticamente
		await sequelize.sync({ alter: true });
		console.log('✅ Sincronización de modelos OK');

		app.listen(PORT, () => {
			console.log(`🚀 Server escuchando en http://localhost:${PORT}`);
		});
	} catch (err) {
		console.log('❌ Error al iniciar:', err);
		process.exit(1);
	}
}
start();
