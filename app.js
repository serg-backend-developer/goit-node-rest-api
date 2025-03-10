import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import authRouter from './routes/authRouter.js';
import contactsRouter from './routes/contactsRouter.js';
import { dirName } from './constants/consts.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(dirName, 'public')));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

app.listen(3000, () => {
    console.log('Server is running. Use our API on port: 3000');
});
