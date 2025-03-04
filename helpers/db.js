import { sequelize } from '../config/db.js';

import { Contact } from '../models/Contact.js';
import { User } from '../models/User.js';

export const syncDB = async () =>
    sequelize
        .authenticate()
        .then(() => {
            console.log('Database connection successful.');
            User.sync({ alter: true });
            Contact.sync({ alter: true });
            console.log('Models were synchronized successfully.');
        })
        .catch((error) => {
            console.log('Database connection failed.', error);
            process.exit(1);
        });

export const checkDBConnection = async () =>
    sequelize
        .authenticate()
        .then(() => {
            console.log('Database connection successful.');
        })
        .catch((error) => {
            console.log('Database connection failed.', error);
            process.exit(1);
        });
