const Joi = require('joi');

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const resourceSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().optional(),
  image: Joi.string().uri().optional(),
  location: Joi.string().optional(),
  tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
  images: Joi.alternatives().try(Joi.array().items(Joi.string().uri()), Joi.string().uri()).optional(),
});

function validateAuth(req, res, next) {
  const { error } = authSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, data: null, message: error.message });
  next();
}

function validateResourceJoi(req, res, next) {
  const { error } = resourceSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, data: null, message: error.message });
  next();
}

module.exports = { validateAuth, validateResourceJoi };
