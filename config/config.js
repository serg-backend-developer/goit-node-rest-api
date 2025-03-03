import 'dotenv/config';

const config = {
    PORT: process.env.PORT || 3000,
    POSTGRES_URI:
        process.env.POSTGRES_URI ||
        'postgres://user:password@localhost:5432/contacts',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30m',
};

export default config;
