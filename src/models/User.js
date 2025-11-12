import { DataTypes } from 'sequelize';
import sequelize from '../db/connecdb.js';

const User = sequelize.define(
	'user',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'first_name',
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'last_name',
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		isverified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			field: 'is_verified',
		},
	},
	{
		timestamps: true,
		underscored: true,
	},
);

export default User;
