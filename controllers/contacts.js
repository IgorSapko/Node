const fs = require("fs");
const path = require("path");
const { getMaxListeners } = require("process");

const contactsPath = path.join(__dirname, "../models/contacts.json");

async function listContacts(req, res) {
  try {
    let listOfContacts = await fs.promises.readFile(contactsPath, "utf-8");
    if (res) {
      res.status(200).send(listOfContacts);
    }
    return listOfContacts;
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(req, res) {
  try {
    const id = parseInt(req.url.match(/\d+/));
    const listOfContacts = await listContacts();
    const foundContact = JSON.parse(listOfContacts).find(
      (contact) => contact.id === id
    );
    if (!foundContact) {
      res.status(404).send({ message: "Not found" });
      return;
    }
    res.status(200).send(foundContact);
    return foundContact;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(req, res) {
  try {
    const id = parseInt(req.url.match(/\d+/));
    const listOfContacts = await listContacts();
    let deletedContact = null;
    newContactsList = JSON.parse(listOfContacts).filter((contact) => {
      if (contact.id === id) {
        deletedContact = contact;
      }
      return contact.id !== id;
    });

    deletedContact
      ? (fs.writeFile(
          contactsPath,
          JSON.stringify(newContactsList),
          (error) => {
            if (error) {
              console.log(error);
            }
          }
        ),
        res.status(200).send({ message: "contact deleted" }))
      : res.status(404).send({ message: "Not found" });
    return deletedContact;
  } catch (error) {
    console.log(error);
  }
}

async function addContact(req, res) {
  try {
    const { name, email, phone } = req.body;
    const listOfContacts = await listContacts();
    newContactsList = JSON.parse(listOfContacts);
    if (name && email && phone) {
      const newContact = { id: name + email + phone, name, email, phone };
      newContactsList.push(newContact);
      fs.writeFile(
        contactsPath,
        JSON.stringify(newContactsList),
        res.status(201).send(newContact),
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
    } else {
      res.status(400).send({ message: "missing required name field" });
    }
    return newContact;
  } catch (error) {
    console.log(error);
  }
}

async function updateContact(req, res) {
  try {
    const id = parseInt(req.url.match(/\d+/));
    const { name, email, phone } = req.body;
    const listOfContacts = await listContacts();
    let updatedContact = null;
    updatedContactsList = JSON.parse(listOfContacts).filter((contact) => {
      if (contact.id === id) {
        updatedContact = contact;
        if (name) {
          updatedContact.name = name;
        }
        if (email) {
          updatedContact.email = email;
        }
        if (phone) {
          updatedContact.phone = phone;
        }
        return updatedContact;
      }
      return contact;
    });
    if (updatedContact && (name || email || phone)) {
      fs.writeFile(
        contactsPath,
        JSON.stringify(updatedContactsList),
        res.status(200).send(updatedContact),
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
    } else if (!updatedContact) {
      res.status(400).send({ message: "id is not exist" });
    } else {
      res.status(400).send({ message: "missing fields" });
    }
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
};
