import 'dotenv/config'

const config = {
    PORT: process.env.PORT || 3000,
    POSTGRES_URI: process.env.POSTGRES_URI || 'postgres://user:password@localhost:5432/contacts',
};

export default config;