const { getMaxListeners, connected, exit } = require("process");
const Contact = require("../models/contacts");
const Joi = require("joi");

const {
  Types: { ObjectId },
} = require("mongoose");

async function listContacts(req, res) {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let sub = req.query.sub;

    if (page && limit) {
      let listOfContacts = await Contact.paginate({}, { page, limit });
      res.status(200).send(listOfContacts.docs);
      return;
    }
    if (sub) {
      console.log('sub')
      let listOfContacts = await Contact.find({ subscription: sub });
     await res.status(200).send(listOfContacts);
      return;
    }
    listOfContacts = await Contact.find();
    res.status(200).send(listOfContacts);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function getContactById(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    foundContact = await Contact.findById(contactId);
    foundContact
      ? res.status(200).send(foundContact)
      : res.status(404).send({ message: "Contact not found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
}

async function removeContact(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    deletedContact = await Contact.findByIdAndDelete(contactId);
    deletedContact
      ? res.status(200).send({ message: "Contact deleted" })
      : res.status(404).send({ message: "Contact not found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
}

async function addContact(req, res) {
  try {
    newContact = await Contact.create(req.body);
    res.status(201).send(newContact);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
}

async function updateContact(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: req.body },
      {
        new: true,
      }
    );
    updatedContact
      ? res.status(200).send(updatedContact)
      : res.status(404).send({ message: "Contact not found" });
  } catch (error) {
    console.log(error);
  }
}

function validateId(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send("Contact id is not valid");
  }

  next();
}

function validateUpdateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    phone: Joi.string(),
  });
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }
  next();
}

function validateAddContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    res.status(400).send(validationResult.error);
  }

  next();
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  validateId,
  validateUpdateContact,
  validateAddContact,
};
