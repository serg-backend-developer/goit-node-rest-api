import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

import { SECRET_KEY } from '../constants/consts.js';
import { sendEmailTo } from './nodemailerService.js';
import { verificationToken, verificationLink } from '../constants/consts.js';
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
        const newUser = await User.create({
            email,
            password: hashedPassword,
            verificationToken,
        });
        await sendEmailTo(
            newUser.email,
            'Verification email',
            `Click on link for verification: ${verificationLink}`
        );
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
        if (!user.verify) {
            return { error: { status: 403, message: 'Email not verified' } };
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

export async function validateCurrUser(req, res) {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ where: { verificationToken } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.update(
            { verify: true, verificationToken: null },
            { where: { id: user.id } }
        );
        return res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function resendVerificationRequest(email, res) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.verify) {
        return res
            .status(400)
            .json({ message: 'Verification has already been passed' });
    }
    const verificationUserLink = `http://localhost:3000/api/auth/verify/${user.verificationToken}`;
    await await sendEmailTo(
        user.email,
        'Verification email',
        `Click on link for verification: ${verificationUserLink}`
    );
}
