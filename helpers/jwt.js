import authServices from '../services/authServices.js';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import HttpError from './HttpError.js';

export const generateToken = async (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
};

export const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, 'Not authorized'));
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        return next(HttpError(401, 'Bearer not found'));
    }

    try {
        const { email } = jwt.verify(token, config.JWT_SECRET);
        const user = await authServices.findUser(email);
        if (!user || user.token !== token) {
            return next(HttpError(401, 'Not authorized'));
        }
        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, error.message));
    }
};
