import express from 'express';
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
    updateStatusContact,
} from '../controllers/contactsControllers.js';

import {
    createContactSchema,
    updateContactSchema,
    updateContactFavoriteSchema,
} from '../schemas/contactsSchemas.js';

import { authenticate } from '../helpers/jwt.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import validateBody from '../helpers/validateBody.js';

const contactsRouter = express.Router();

contactsRouter.get('/', authenticate, ctrlWrapper(getAllContacts));

contactsRouter.get('/:id', authenticate, ctrlWrapper(getOneContact));

contactsRouter.delete('/:id', authenticate, ctrlWrapper(deleteContact));

contactsRouter.post(
    '/',
    validateBody(createContactSchema),
    authenticate,
    ctrlWrapper(createContact)
);

contactsRouter.put(
    '/:id',
    validateBody(updateContactSchema),
    authenticate,
    ctrlWrapper(updateContact)
);

contactsRouter.patch(
    '/:id/favorite',
    validateBody(updateContactFavoriteSchema),
    authenticate,
    ctrlWrapper(updateStatusContact)
);

export default contactsRouter;
