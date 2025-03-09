import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';

import { avatarStore } from '../constants/consts.js';

const uploadDir = path.join(process.cwd(), 'temp');
const storeImage = path.join(process.cwd(), 'public', avatarStore);

const isAccessible = async (path) => {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
};

const createFolderIsNotExist = async (folder) => {
    if (!(await isAccessible(folder))) {
        await fs.mkdir(folder);
    }
};

createFolderIsNotExist(uploadDir);
createFolderIsNotExist(storeImage);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 1048576,
    },
});

export const upload = multer({
    storage: storage,
});
