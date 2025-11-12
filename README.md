📦 Proyecto: API de Autenticación y Verificación de Correo

🧠 Descripción

API REST desarrollada en Node.js con Express y Sequelize, que permite:

Registrar usuarios.

Enviar correos de verificación usando Nodemailer.

Verificar cuentas mediante código.

Autenticar usuarios con JWT.

Proteger rutas mediante tokens.

(Opcional) Recuperar contraseñas.

⚙️ Tecnologías principales

Node.js y Express

PostgreSQL con Sequelize ORM

dotenv para variables de entorno

bcrypt para encriptar contraseñas

jsonwebtoken (JWT) para autenticación

Nodemailer para envío de correos

Postman para pruebas de endpoints

express-async-errors para manejo global de errores


📁 Estructura del proyecto

email-app-api/
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── db/
│   │   └── connecdb.js
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── EmailCode.js
│   │   └── index.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── index.js
│   ├── utils/
│   │   ├── emailService.js
│   │   └── jwt.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md

🔐 Variables de entorno (.env)

NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=email_app_db
DB_USER=postgres
DB_PASS=tu_contraseña_de_base_de_datos

JWT_SECRET=tu_clave_secreta_segura

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

🚀 Instalación y ejecución

# Clonar el repositorio
git clone https://github.com/tuusuario/email-app-api.git
cd email-app-api

# Instalar dependencias
npm install

# Crear base de datos en PostgreSQL
createdb email-app-db

# Ejecutar en desarrollo
npm run dev

# O modo producción
npm start

🛠️ Comandos útiles de PostgreSQL

# Entrar a PostgreSQL
psql -U postgres

# Ver bases de datos
\l

# Conectarse a una base de datos
\c email-app-db

# Ver tablas
\dt

# Ver contenido de la tabla de códigos
SELECT * FROM email_codes;

# Ver usuarios
SELECT * FROM users;

👨‍💻 Autor

Cesar Quintero
📧 quintero_093@hotmail.com

💼 Backend Developer – Node.js | PostgreSQL | AWS

