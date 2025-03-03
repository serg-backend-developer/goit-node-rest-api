import HttpError from './HttpError.js';
import {
    VALIDATIOIN_ERROR,
    CONSTRAINT_ERROR,
} from '../constants/errorMessages.js';

const ctrlWrapper = (controller) => {
    const func = async (req, res, next) => {
        try {
            await controller(req, res);
        } catch (error) {
            if (error.name === VALIDATIOIN_ERROR) {
                return next(HttpError(400, error.message));
            }
            if (error.name === CONSTRAINT_ERROR) {
                return next(HttpError(409, error.message));
            }
            next(error);
        }
    };
    return func;
};

export default ctrlWrapper;
