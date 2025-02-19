import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import contactsRouter from './routes/contactsRouter.js';
import config from '../config/config.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

app.listen(config.PORT, () => {
    console.log(
        `Server is running. Use our API on port: ${config.PORT}http://localhost:${config.PORT}`
    );
});
