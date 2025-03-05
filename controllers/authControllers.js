import fs from 'fs/promises';
import path from 'path';

import { avatarStore } from '../constants/consts.js';
import HttpError from '../helpers/HttpError.js';
import authServices from '../services/authServices.js';

const uploadDir = path.join(process.cwd(), 'temp');
const storeImage = path.join(process.cwd(), 'public', avatarStore);

export const register = async (req, res, next) => {
    const result = await authServices.register(req.body);
    res.status(201).json({
        user: {
            email: result.email,
            subscription: result.subscription,
        },
    });
};

export const login = async (req, res, next) => {
    const result = await authServices.login(req.body);
    res.json(result);
};

export const logout = async (req, res) => {
    const { email } = req.user;
    await authServices.logout(email);
    res.status(204).send();
};

export const getCurrent = async (req, res) => {
    res.json({
        email: req.user.email,
        subscription: req.user.subscription,
    });
};

export const subscription = async (req, res) => {
    const { email } = req.user;
    const result = await authServices.subscription(email, req.body);
    res.json({
        email: result.email,
        subscription: result.subscription,
    });
};

export const changeAvatar = async (req, res) => {
    const { email } = req.user;
    if (!mimetype.includes('image')) {
        await fs.unlink(req.file.path);
        return next(HttpError(400, 'File format is incorrect.'));
    }
    const tempPath = path.join(uploadDir, originalname);
    const emailString = req.user.email
        .replace(/[^a-zA-Z0-9]/g, '')
        .substr(0, 10);
    const extension = path.extname(originalname);
    const fileName = `${emailString}-${Math.round(
        Math.random() * 1e9
    )}${extension}`;
    const finalPath = path.join(storeImage, fileName);
    try {
        await fs.rename(tempPath, finalPath);
    } catch (error) {
        await fs.unlink(tempPath);
        return next(error);
    }
    req.file.avatarURI = `${avatarStore}/${fileName}`;
    const result = await authServices.changeAvatar(email, req.file);
    res.json({
        avatarURL: result.avatarURL,
    });
};
