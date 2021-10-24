const express = require("express");
const router = express.Router();
const Contacts = require("../../controllers/contacts");
const {
  validateContact,
  validateContactId,
  validateUpdatingContact,
  validateStatusContact,
} = require("./validation");

const guard = require("../../helpers/guard");
const wrapError = require("../../helpers/error-handler");

router.get("/", guard, wrapError(Contacts.getContacts));

router.get(
  "/:contactId",
  guard,
  validateContactId,
  wrapError(Contacts.getContactById)
);

router.post("/", guard, validateContact, wrapError(Contacts.addContact));

router.delete(
  "/:contactId",
  guard,
  validateContactId,
  wrapError(Contacts.deleteContact)
);

router.put(
  "/:contactId",
  guard,
  validateContactId,
  validateUpdatingContact,
  wrapError(Contacts.updateContact)
);

router.patch(
  "/:contactId/favorite",
  guard,
  validateContactId,
  validateStatusContact,
  wrapError(Contacts.updateStatusContact)
);

module.exports = router;
