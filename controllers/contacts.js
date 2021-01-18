const { getMaxListeners, connected, exit } = require("process");
const Contact = require("../models/contacts");

const {
  Types: { ObjectId },
} = require("mongoose");

async function listContacts(req, res) {
  try {
    const listOfContacts = await Contact.find();
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
    ObjectId.isValid(contactId)
      ? ((foundContact = await Contact.findById(contactId)),
        foundContact
          ? res.status(200).send(foundContact)
          : res.status(404).send({ message: "Contact not found" }))
      : res.status(400).send({ message: "ID is not valid" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function removeContact(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    ObjectId.isValid(contactId)
      ? ((deletedContact = await Contact.findByIdAndDelete(contactId)),
        deletedContact
          ? res.status(200).send({ message: "Contact deleted" })
          : res.status(404).send({ message: "Contact not found" }))
      : res.status(400).send({ message: "ID is not valid" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function addContact(req, res) {
  try {
    // errorReturn(err)
    const { name, email, password, phone } = req.body;
    name && email && password && phone
      ? ((newContact = await Contact.create(req.body)),
        res.status(201).send(newContact))
      : res.status(400).send({ message: "missing required name field" });
    //
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function updateContact(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    const { name, email, password, phone } = req.body;
    ObjectId.isValid(contactId)
      ? ((updatedContact = await Contact.findByIdAndUpdate(
          contactId,
          { $set: req.body },
          {
            new: true,
          }
        )),
        updatedContact && (name || email || phone || password)
          ? res.status(200).send(updatedContact)
          : !updatedContact
          ? res.status(404).send({ message: "Contact not found" })
          : res.status(400).send({ message: "missing fields" }))
      : res.status(400).send({ message: "ID is not valid" });
  } catch (error) {
    console.log(error);
  }
}

function errorReturn(err) {
  return err;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
