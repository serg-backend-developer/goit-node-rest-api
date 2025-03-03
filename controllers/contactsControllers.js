import contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res) => {
    const { id: owner } = req.user;
    const pagination = { limit: req.query.limit, page: req.query.page };
    if (req.query.favorite) {
        query.favorite = req.query.favorite;
    }
    const contacts = await contactsService.listContacts({ owner }, pagination);
    res.json(contacts);
};

export const createContact = async (req, res) => {
    const { id: owner } = req.user;
    const newContact = await contactsService.addContact({ ...req.body, owner });
    res.status(201).json(newContact);
};

export const getOneContact = async (req, res) => {
    const contact = await contactsService.getContact({
        id: req.params.id,
        owner: req.user.id,
    });
    if (contact) {
        res.json(contact);
    } else {
        throw HttpError(404, `Contact with id = ${req.params.id} not found.`);
    }
};

export const updateContact = async (req, res) => {
    const updatedContact = await contactsService.updateContact(
        {
            id: req.params.id,
            owner: req.user.id,
        },
        req.body
    );
    if (updatedContact) {
        res.json(updatedContact);
    } else {
        throw HttpError(404, `Contact with id = ${req.params.id} not found.`);
    }
};

export const deleteContact = async (req, res) => {
    const del_contact = await contactsService.removeContact({
        id: req.params.id,
        owner: req.user.id,
    });
    if (del_contact) {
        res.json(del_contact);
    } else {
        throw HttpError(404, `Contact with id = ${req.params.id} not found.`);
    }
};

export const updateStatusContact = async (req, res) => {
    const updatedStatusContact = await contactsService.updateStatusContact(
        {
            id: req.params.id,
            owner: req.user.id,
        },
        req.body
    );
    if (updatedStatusContact) {
        res.json(updatedStatusContact);
    } else {
        throw HttpError(404, `Contact with id = ${req.params.id} not found.`);
    }
};
