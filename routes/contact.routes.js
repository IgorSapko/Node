const { Router } = require("express");
const router = Router();

const importFunctions = require("../controllers/contacts");

router.get("/", importFunctions.listContacts);

router.get(
  `/:contactId`,
  importFunctions.validateId,
  importFunctions.getContactById
);

router.post(
  "/",
  importFunctions.validateAddContact,
  importFunctions.addContact
);

router.delete(
  `/:contactId`,
  importFunctions.validateId,
  importFunctions.removeContact
);

router.patch(
  `/:contactId`,
  importFunctions.validateId,
  importFunctions.validateUpdateContact,
  importFunctions.updateContact
);

module.exports = router;
