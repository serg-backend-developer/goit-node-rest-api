import { promises as fs } from 'fs';
import { join } from 'path';
import { uid } from 'uid';

const contactsPath = join(process.cwd(), 'db', 'contacts.json');

async function readDataFromFile() {
    try {
        const dataFromFile = await fs.readFile(contactsPath);
        return JSON.parse(dataFromFile);
    } catch (error) {
        console.error('Error reading file ', contactsPath);
        return [];
    }
}

async function saveDataToFile(data) {
    try {
        await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error storing data to file.', contactsPath);
    }
}

async function listContacts() {
    const contactsList = await readDataFromFile();
    return [...contactsList];
}

async function getContactById(contactId) {
    const contactsList = await listContacts();
    const contact = contactsList.find(({ id }) => id === contactId);
    return contact || null;
}

async function addContact({ name, email, phone }) {
    const contactsList = await listContacts();
    const newContact = { id: uid(), name, email, phone };
    contactsList.push(newContact);
    await saveDataToFile(contactsList);
    return newContact;
}

async function removeContact(contactId) {
    const contactsList = await listContacts();
    const idx = contactsList.findIndex(({ id }) => id === contactId);
    if (idx === -1) {
        return null;
    }
    const [contact] = contactsList.splice(idx, 1);
    await saveDataToFile(contactsList);
    return contact;
}

async function updateContact(contactId, { ...data }) {
    const contactsList = await listContacts();
    const idx = contactsList.findIndex(({ id }) => id === contactId);
    if (idx === -1) {
        return null;
    }
    const updatedContact = { ...contactsList[idx] };
    for (const key in data) {
        if (data[key] !== undefined) {
            updatedContact[key] = data[key];
        }
    }
    contactsList[idx] = { ...contactsList[idx], ...updatedContact };
    await saveDataToFile(contactsList);
    return updatedContact;
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
