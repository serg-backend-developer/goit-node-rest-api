import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    subscription: {
        type: DataTypes.ENUM,
        values: ['starter', 'pro', 'business'],
        defaultValue: 'starter',
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
});
