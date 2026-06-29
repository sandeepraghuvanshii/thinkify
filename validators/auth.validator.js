const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  username: Joi.string().required().min(3).max(20),
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().min(6).max(30).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(20),
  email: Joi.string().email().lowercase(),
  password: Joi.string().required().min(6).max(30).required(),
}).or("username", "email");

module.exports = { registerSchema, loginSchema };
