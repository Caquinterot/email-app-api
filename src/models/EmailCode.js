import { DataTypes } from 'sequelize';
import sequelize from '../db/connecdb.js';

const EmailCode = sequelize.define(
	'email_code',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		code: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		underscored: true,
		tableName: 'email_codes',
	},
);

export default EmailCode;
