import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
	createContactSchema,
	updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
	const contacts = await contactsService.listContacts();
	if (contacts.status === 200) {
		res.send(contacts);
		return;
	}
	const error = HttpError(contacts.status);
	res.send(error);
};

export const createContact = async (req, res) => {
	const { name, email, phone } = req.body;
	const { error } = createContactSchema.validate({ name, email, phone });

	if (error) {
		res.send(JSON.stringify({ message: error.message }));
		return;
	} else {
		await contactsService.addContact(name, email, phone);
		res.send(JSON.stringify({ name, email, phone, status: 201 }));
		return;
	}
};

export const getOneContact = async (req, res) => {
	const id = req.params.id;
	const contact = await contactsService.getContactById(id);
	if (contact.status === 404) {
		const error = HttpError(contact.status);
		res.send(error);
	} else {
		res.send(contact);
	}
};

export const updateContact = async (req, res) => {
	const data = req.body;
	const { error } = updateContactSchema.validate(data);
	if (!data) {
		res.send(
			JSON.stringify({ message: "Body must have at least one field" })
		);
		return;
	}
	if (error) {
		res.send(JSON.stringify({ message: error.message, status: 400 }));
		return;
	}
	const id = req.params.id;
	const contact = await contactsService.updateContact(data, id);
	if (contact.status === 200) {
		res.send(
			JSON.stringify({ data: contact.foundData, status: contact.status })
		);
	}
	if (contact.status === 404) {
		res.send(JSON.stringify(contact.message));
	}
};

export const deleteContact = async (req, res) => {
	const id = req.params.id;
	const contact = await contactsService.removeContact(id);
	const error = HttpError(contact.status);

	if (contact.status === 404) {
		res.send(error);
	}
	if (contact.status === 200) {
		res.send(JSON.stringify({ contact }));
	}
};
