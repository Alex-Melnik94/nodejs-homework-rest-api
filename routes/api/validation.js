const Joi = require("joi");

const schemaContact = Joi.object({
  name: Joi.string().min(1).max(16).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .min(6)
    .max(14)
    .pattern(/^[0-9]+$/)
    .required(),
});

const pattern = "\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}";

const schemaContactId = Joi.object({
  contactId: Joi.string().pattern(new RegExp(pattern)).required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(1).max(16),
  email: Joi.string().email(),
  phone: Joi.string()
    .min(6)
    .max(14)
    .pattern(/^[0-9]+$/),
})
  .min(1)
  .max(3);

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
