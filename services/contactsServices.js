import { Contact } from '../models/Contact.js';

async function listContacts(query, pagination) {
    const { limit, page } = pagination;
    const offset = (page - 1) * limit || 0;
    const contactsList = await Contact.findAll({ where: query, offset, limit });
    return [...contactsList];
}

async function getContact(query) {
    const { id, owner } = query;
    const contact = Contact.findOne({ where: { id, owner } });
    return contact || null;
}

async function addContact(query) {
    const { name, email, phone, favorite, owner } = query;
    const newContact = await Contact.create({
        name,
        email,
        phone,
        favorite,
        owner,
    });
    await newContact.save();
    return newContact.toJSON();
}

async function removeContact(query) {
    const contact = await getContact(query);
    if (!contact) {
        return null;
    }
    const removedContact = contact.toJSON();
    await contact.destroy();
    return removedContact;
}

async function updateContact(query, { ...data }) {
    const updatedContact = await getContact(query);
    if (!updatedContact) {
        return null;
    }
    await updatedContact.update(data);
    return updatedContact.toJSON();
}

async function updateStatusContact(query, { favorite }) {
    const updatedStatusContact = await getContact(query);
    if (!updatedStatusContact) {
        return null;
    }
    await updatedStatusContact.update({ favorite });
    return updatedStatusContact.toJSON();
}

export default {
    listContacts,
    getContact,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
};
