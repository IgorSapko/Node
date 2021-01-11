const fs = require("fs");
const path = require("path");
const { getMaxListeners } = require("process");

const contactsPath = path.join(__dirname, "/db/contacts.json");

async function listContacts() {
  try {
    let listOfContacts = await fs.promises.readFile(contactsPath, "utf-8");
    return listOfContacts;
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const listOfContacts = await listContacts();
    foundContact = JSON.parse(listOfContacts).find(
      (contact) => contact.id === contactId
    );
    console.log("foundContact", foundContact);
    return foundContact;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const listOfContacts = await listContacts();
    newContactsList = JSON.parse(listOfContacts).filter(
      (contact) => contact.id !== contactId
    );
    console.log("newContactsList", newContactsList);
    fs.writeFile(contactsPath, JSON.stringify(newContactsList), (error) => {
      if (error) {
        console.log(error);
      }
    });
    return newContactsList;
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const listOfContacts = await listContacts();
    newContactsList = JSON.parse(listOfContacts);
    newContactsList.push({ id: name + email + phone, name, email, phone });
    console.log("newContactsList", newContactsList);
    fs.writeFile(contactsPath, JSON.stringify(newContactsList), (error) => {
      if (error) {
        console.log(error);
      }
    });
    return newContactsList;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
