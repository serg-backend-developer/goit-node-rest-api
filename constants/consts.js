import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

export const avatarStore = 'avatars';
export const dirName = path.resolve();
export const SECRET_KEY = process.env.JWT_SECRET;
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
