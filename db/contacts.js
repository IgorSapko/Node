// import { promises as fs } from "fs";
// import path from "path";
// //   "type": "module", to package.json
// const contactsPath = path.normalize(
//   "D:/GOIT/Node/Homeworks/Node-01-node-basics/data/contacts.json"
// );

// // TODO: задокументировать каждую функцию
// async function listContacts() {
//   let listOfContacts = await fs.readFile(
//     contactsPath,
//     "utf-8",
//     function (error, data) {
//       if (error) {
//         console.log(error);
//       }
//     }
//   );
//   return listOfContacts;
// }

const fs = require("fs");
const path = require("path");
const { getMaxListeners } = require("process");
const contactsPath = path.normalize(
  "D:/GOIT/Node/Homeworks/Node-01-node-basics/data/contacts.json"
);

// TODO: задокументировать каждую функцию
async function listContacts() {
  try {
    let listOfContacts = await fs.promises.readFile(contactsPath, "utf-8");
    return listOfContacts;
  } catch (error) {
    console.log(error);
  }
}

// function listContacts() {
//   return new Promise((resolve, rejected) => {
//     fs.readFile(contactsPath, "utf-8", (error, listOfContacts) => {
//       if (error) {
//         rejected(error);
//       } else {
//         // console.log(listOfContacts);
//         resolve(listOfContacts);
//       }
//     });
//   });
// }

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
