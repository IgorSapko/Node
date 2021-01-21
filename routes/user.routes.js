const { Router } = require("express");
const router = Router();

const importFunctions = require("../controllers/contacts");

router.get("/", importFunctions.listContacts);

router.get(`/:contactId`, importFunctions.getContactById);

router.post("/", importFunctions.addContact);

router.delete(`/:contactId`, importFunctions.removeContact);

router.patch(`/:contactId`, importFunctions.updateContact);

module.exports = router;
