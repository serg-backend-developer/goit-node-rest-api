import express from 'express';

import ctrlWrapper from '../helpers/ctrlWrapper.js';
import validateBody from '../helpers/validateBody.js';
import {
    register,
    login,
    getCurrent,
    logout,
    subscription,
} from '../controllers/authControllers.js';
import {
    loginSchema,
    registerSchema,
    subscriptionSchema,
} from '../schemas/authSchema.js';
import { authenticate } from '../helpers/jwt.js';

const authRouter = express.Router();

authRouter.post(
    '/register',
    validateBody(registerSchema),
    ctrlWrapper(register)
);
authRouter.post('/login', validateBody(loginSchema), ctrlWrapper(login));
authRouter.post('/logout', authenticate, ctrlWrapper(logout));
authRouter.get('/current', authenticate, ctrlWrapper(getCurrent));
authRouter.patch(
    '/subscription',
    authenticate,
    validateBody(subscriptionSchema),
    ctrlWrapper(subscription)
);

export default authRouter;
