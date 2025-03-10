import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../constants/consts.js';
import User from '../models/User.js';

export async function authentication(req, res, next) {
    try {
        const req_header = req.headers.authorization;
        if (!req_header || !req_header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        const token = req_header.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user || user.token !== token) {
            return res.status(402).json({ message: 'Not authorized.' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Token Error:', error);
        return res.status(403).json({ message: 'Not authorized.' });
    }
}
