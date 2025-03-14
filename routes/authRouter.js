import express from 'express';
import multer from 'multer';
import path from 'path';

import { authentication } from '../helpers/authentication.js';
import { __dirname } from '../constants/consts.js';
import validateBody from '../helpers/validateBody.js';
import {
    register,
    login,
    getCurrent,
    logout,
    changeAvatar,
    validateUser,
    revalidateUserEmail,
} from '../controllers/authControllers.js';
import { registerSchema } from '../schemas/authSchema.js';

const authRouter = express.Router();

const uploadDir = path.join(__dirname, '../temp');
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}${ext}`);
    },
});

const upload = multer({ storage });

// routes
authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(registerSchema), login);
authRouter.post('/logout', authentication, logout);
authRouter.get('/current', authentication, getCurrent);
authRouter.patch(
    '/avatars',
    authentication,
    upload.single('picture'),
    changeAvatar
);
authRouter.post('/verify', revalidateUserEmail);
authRouter.get('/verify/:verificationToken', validateUser);

export default authRouter;
