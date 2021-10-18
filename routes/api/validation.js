const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const schemaContact = Joi.object({
  name: Joi.string().min(1).max(16).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .min(6)
    .max(14)
    .pattern(/^[0-9]+$/)
    .required(),
  favorite: Joi.boolean().required()
});

const schemaContactId = Joi.object({
  contactId: Joi.objectId().required()
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(1).max(16),
  email: Joi.string().email(),
  phone: Joi.string()
    .min(6)
    .max(14)
    .pattern(/^[0-9]+$/),
  favorite: Joi.boolean()
})
  .min(1)
  .max(4);

const schemaStatusConatc = Joi.object({
  favorite: Joi.boolean().required()
})

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (error) {
    res.json({ status: "error", message: error.message });
    next();
  }
};

module.exports.validateContact = async (req, res, next) => {
  return await validate(schemaContact, req.body, res, next);
};

module.exports.validateContactId = async (req, res, next) => {
  return await validate(schemaContactId, req.params, res, next);
};

module.exports.validateUpdatingContact = async (req, res, next) => {
  return await validate(schemaUpdateContact, req.body, res, next);
};

module.exports.validateStatusContact = async (req, res, next) => {
  return await validate(schemaStatusConatc, req.body, res, next)
}
