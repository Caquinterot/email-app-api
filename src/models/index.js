import sequelize from '../db/connecdb.js';
import User from './User.js';
import EmailCode from './EmailCode.js';

// Relaciones
User.hasOne(EmailCode, { foreignKey: 'user_id', onDelete: 'CASCADE' });
EmailCode.belongsTo(User, { foreignKey: 'user_id' });

export { sequelize, User, EmailCode };
