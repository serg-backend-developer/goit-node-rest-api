import express from 'express';

import { authentication } from '../helpers/authentication.js';
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
    updateFavorite,
} from '../controllers/contactsControllers.js';
import {
    createContactSchema,
    updateContactSchema,
    updateContactFavoriteSchema,
} from '../schemas/contactsSchemas.js';

import validateBody from '../helpers/validateBody.js';

const contactsRouter = express.Router();

contactsRouter.get('/', authentication, getAllContacts);
contactsRouter.get('/:id', authentication, getOneContact);
contactsRouter.delete('/:id', authentication, deleteContact);
contactsRouter.post(
    '/',
    authentication,
    validateBody(createContactSchema),
    createContact
);
contactsRouter.put(
    '/:id',
    authentication,
    validateBody(updateContactSchema),
    updateContact
);
contactsRouter.patch(
    '/:id/favorite',
    authentication,
    validateBody(updateContactFavoriteSchema),
    updateFavorite
);

export default contactsRouter;
