const express = require("express");
const router = express.Router();
const Contacts = require("../../model/");
const {
  validateContact,
  validateContactId,
  validateUpdatingContact,
} = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();

    res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", validateContactId, async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(String(req.params.contactId));
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "Error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    if (contact) {
      res.json({ status: "success", code: 201, data: { contact } });
    }
    return res.json({
      status: "Bad Request",
      code: 400,
      message: "missing required name field",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", validateContactId, async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "Error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:contactId",
  validateContactId,
  validateUpdatingContact,
  async (req, res, next) => {
    try {
      const updatedContact = await Contacts.updateContact(
        req.params.contactId,
        req.body
      );
      if (updatedContact) {
        return res.json({
          status: "success",
          code: 200,
          data: { updatedContact },
        });
      }
      return res
        .status(400)
        .json({ status: "Bad Request", code: 400, message: "missing fields" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
