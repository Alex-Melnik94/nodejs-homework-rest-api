const Contacts = require('../repository/contacts');
const {CustomError} = require('../helpers/custom-error')

const getContacts = async (req, res) => {
    const userId = req.user._id
    const data = await Contacts.listContacts(userId, req.query);
    res.json({ status: "success", code: 200, data: { ...data } });
}

const getContactById = async (req, res, next) => {
    const userId = req.user._id
    const contact = await Contacts.getContactById(req.params.contactId, userId);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }

  throw new CustomError(404, 'Not Found')
   
 
}

const addContact = async (req, res, next) => {

    const userId = req.user._id
    const contact = await Contacts.addContact({...req.body, owner: userId});
    if (contact) {
    return  res.json({ status: "success", code: 201, data: { contact } });
    }
 
    throw new CustomError(404, 'Not Found')
}

const deleteContact = async (req, res, next) => {

    const userId = req.user._id
    const contact = await Contacts.removeContact(req.params.contactId, userId);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    throw new CustomError(404, 'Not Found')
  
}

const updateContact = async (req, res, next) => {

      const userId = req.user._id
      const updatedContact = await Contacts.updateContact(
        req.params.contactId,
        req.body,
        userId
      );
      if (updatedContact) {
        return res.json({
          status: "success",
          code: 200,
          data: { updatedContact },
        });
      }
      throw new CustomError(404, 'Not Found')
   
  }

const updateStatusContact = async (req, res, next) => {
      const userId = req.user._id
      const updatedContact = await Contacts.updateContact(
        req.params.contactId,
        req.body,
        userId
      );
      if (updatedContact) {
        return res.json({
          status: "success",
          code: 200,
          data: { updatedContact },
        });
      }
  throw new CustomError(400, 'missing field favorite')
}

module.exports = {
    getContacts,
    getContactById,
    addContact,
    deleteContact,
    updateContact,
    updateStatusContact,
  }