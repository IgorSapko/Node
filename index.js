const importFunctions = require("./contacts");

const argv = require("yargs").argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      (async function () {
        console.log(await importFunctions.listContacts());
      })();
      break;

    case "get":
      importFunctions.getContactById(id);
      break;

    case "add":
      importFunctions.addContact(name, email, phone);
      break;

    case "remove":
      importFunctions.removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
