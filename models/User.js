import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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
    avatarURL: DataTypes.STRING,
});

export default User;
