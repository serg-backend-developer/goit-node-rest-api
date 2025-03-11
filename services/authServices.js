import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

import { SECRET_KEY } from '../constants/consts.js';
import User from '../models/User.js';

// lecture block
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const uploadDir = path.join(__dirname, '../temp');
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}${ext}`);
    },
});

// methods //
export async function registerUser(email, password) {
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            return { error: { status: 409, message: 'Email in use.' } };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });
        return {
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
        };
    } catch (error) {
        console.error(error);
        return { error: { status: 500, message: 'Internal Server Error.' } };
    }
}

export async function loginUser(email, password) {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return {
                error: { status: 401, message: 'Email or password is wrong.' },
            };
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return {
                error: { status: 401, message: 'Email or password is wrong.' },
            };
        }
        const token = jwt.sign({ id: user.id }, SECRET_KEY, {
            expiresIn: '24h',
        });
        await user.update({ token });
        return {
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        };
    } catch (error) {
        console.error(error);
        return { error: { status: 500, message: 'Internal Server Error.' } };
    }
}

export async function logoutUser(user) {
    try {
        if (!user) {
            return { error: { status: 401, message: 'Not authorized.' } };
        }
        await user.update({ token: null });
        return { status: 204 };
    } catch (error) {
        console.error('Logout Error:', error);
        return { error: { status: 500, message: 'Internal Server Error.' } };
    }
}

export async function uploadAvatar(req, avatarURL) {
    if (!req.file) {
        throw new Error('No file uploaded.');
    }
    try {
        await User.update({ avatarURL }, { where: { id: req.user.id } });
        return { user: { avatarURL } };
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error.');
    }
}
