import Contact from '../models/Contact.js';

export async function listContacts(userId) {
    try {
        return await Contact.findAll({
            where: { owner: userId },
        });
    } catch (error) {
        return [];
    }
}

export async function getContactById(contactId, userId) {
    try {
        return Contact.findOne({ where: { owner: userId, id: contactId } });
    } catch (error) {
        return null;
    }
}

export async function addContact(name, email, phone, userId) {
    try {
        const contact = await Contact.findOne({
            where: { id: contactId, owner: userId },
        });
        if (!contact) return null;
        await contact.destroy();
        return contact;
    } catch (error) {
        return null;
    }
}

export async function updateCurrentContact(id, userId, body) {
    try {
        const updatedContact = await Contact.findOne({
            where: { owner: userId, id: contactId },
        });
        if (!updatedContact) {
            return null;
        }
        await updatedContact.update(body);
        return updatedContact;
    } catch (error) {
        return null;
    }
}

export async function updateStatusContact(id, userId, body) {
    try {
        const updatedContact = await Contact.findOne({ where: { id, owner: userId } });
        if (!updatedContact) {
            return null;
        }
        await updatedContact.update(body);
        return updatedContact;
    } catch (error) {
        return null;
    }
}

export async function removeContact(contactId, userId) {
    try {
        const deletedContact = await Contact.findOne({
            where: { id: contactId, owner: userId },
        });
        if (!deletedContact) return null;
        await deletedContact.destroy();
        return deletedContact;
    } catch (error) {
        return null;
    }
}
