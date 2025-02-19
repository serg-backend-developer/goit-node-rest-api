import { sequelize } from "../config/db.js";
import { Contact } from "../models/contacts.js";


sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");
    Contact.sync();
    console.log("Contact modes was synchronized successfully");
  })
  .catch((error) => {
    console.log("Database connection failed", error);
    process.exit(1);
  });

async function listContacts() {
    const contactsList = await Contact.findAll();
    return [...contactsList];
}

async function getContactById(contactId) {
    const contact = Contact.findAll({where : {id : contactId}});
    return contact || null;
}

async function addContact({ name, email, phone }) {
    const newContact = await Contact.create({name, email, phone});
    await newContact.save();
    return newContact.toJSON();
}

async function removeContact(contactId) {
    const contact = await Contact.findAll({where: {id: contactId}});
    await Contact.destroy({where: {id: contactId}});
    return contact?.[0] || null;
}

async function updateContact(contactId, { ...data }) {
    await Contact.update(data, { where: { id: contactId } });
    const updatedContact = await Contact.findAll({ where: { id: contactId } });
    return updatedContact.length ? updatedContact[0] : null;
}

async function updateStatusContact(contactId, { favorite }) {
    await Contact.update({ favorite }, { where: { id: contactId } });
    const updatedStatusContact = await Contact.findAll({ where: { id: contactId } });
    return updatedStatusContact?.[0] || null;
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
};
