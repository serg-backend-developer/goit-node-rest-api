import bcrypt from 'bcrypt';

import HttpError from '../helpers/HttpError.js';
import { generateToken } from '../helpers/jwt.js';
import { User } from '../models/User.js';

const register = async ({ email, password, subscription }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw HttpError(409, 'Such email already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        password: hashedPassword,
        subscription,
    });
    return user;
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw HttpError(401, 'Email or password is wrong.');
    }
    const payload = {
        id: user.id,
        email: user.email,
    };

    const token = await generateToken(payload);

    user.token = token;
    await user.save();
    return {
        token: token,
        user: { email: user.email, subscription: user.subscription },
    };
};

const logout = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw HttpError(401, 'Not authorized.');
    }
    user.token = null;
    await user.save();
};

const subscription = async (email, { subscription }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw HttpError(401, 'Not authorized.');
    }
    user.subscription = subscription;
    await user.save();
    return user;
};

const findUser = async (email) => {
    return await User.findOne({ where: { email } });
};

export default { register, login, logout, subscription, findUser };
