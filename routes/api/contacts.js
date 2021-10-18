const express = require("express");
const router = express.Router();
const Contacts = require('../../controllers/contacts');
const {
  validateContact,
  validateContactId,
  validateUpdatingContact,
  validateStatusContact
} = require("./validation");

router.get("/", Contacts.getContacts);

router.get("/:contactId", validateContactId, Contacts.getContactById);

router.post("/", validateContact, Contacts.addContact);

router.delete("/:contactId", validateContactId, Contacts.deleteContact);

router.put("/:contactId",validateContactId, validateUpdatingContact, Contacts.updateContact);

router.patch("/:contactId/favorite", validateContactId, validateStatusContact, Contacts.updateStatusContact)

module.exports = router;
