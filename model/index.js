const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const readContacts = async () => {
  const contacts = await fs.readFile(
    path.join(__dirname, "./contacts.json"),
    "utf8"
  );
  const parsedContacts = JSON.parse(contacts);
  return parsedContacts;
};

const listContacts = async () => {
  return readContacts();
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contact = contacts.find(
    (contact) => String(contact.id) === String(contactId)
  );
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(contactId)
  );
  if (index !== -1) {
    const res = contacts.splice(index, 1);
    await fs.writeFile(
      path.join(__dirname, "./contacts.json"),
      JSON.stringify(contacts, null, 2)
    );
    return res;
  }
  return null;
};

const addContact = async (body) => {
  const contacts = await readContacts();
  // if (body.name && body.email && body.phone) {
  const newContact = { id: uuidv4(), ...body };
  contacts.push(newContact);
  await fs.writeFile(
    path.join(__dirname, "./contacts.json"),
    JSON.stringify(contacts, null, 2)
  );
  return newContact;
  // }
  // return null;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(contactId)
  );
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(
      path.join(__dirname, "./contacts.json"),
      JSON.stringify(contacts, null, 2)
    );
    return contacts[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
