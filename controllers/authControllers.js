import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';

import {
    registerUser,
    loginUser,
    logoutUser,
    uploadAvatar,
} from '../services/authServices.js';

import { __dirname } from '../constants/consts.js';

const avatarsDir = path.join(__dirname, '../public/avatars');

export async function getCurrent(req, res) {
    const currUser = req.user;
    if (!currUser) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    return res.status(200).json({
        email: currUser.email,
        subscription: currUser.subscription,
    });
}

export async function register(req, res) {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email, { s: '200', d: 'retro', r: 'pg' });
    const registUser = await registerUser(email, password, avatarURL);
    if (registUser.error) {
        return res
            .status(registUser.error.status)
            .json({ message: registUser.error.message });
    }

    res.status(201).json(registUser);
}

export async function login(req, res) {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    if (result.error) {
        return res
            .status(result.error.status)
            .json({ message: result.error.message });
    }
    res.status(200).json(result);
}

export async function logout(req, res) {
    const user = req.user;
    const result = await logoutUser(user);
    if (result.error) {
        return res
            .status(result.error.status)
            .json({ message: result.error.message });
    }
    return res.status(result.status).send();
}

export const changeAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const { path: tempPath, originalname } = req.file;
        const extName = path.extname(originalname);
        const newFilename = `${req.user.id}${extName}`;
        const newFilePath = path.join(avatarsDir, newFilename);
        await fs.rename(tempPath, newFilePath);
        const avatarURL = `/avatars/${newFilename}`;
        await uploadAvatar(req, avatarURL);
        res.status(200).json({ avatarURL });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload avatar.' });
    }
};
