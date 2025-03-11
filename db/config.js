import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync({ force: true });
    console.log('Database was synced successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
}

export default sequelize;
