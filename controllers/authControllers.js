import authServices from '../services/authServices.js';

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
