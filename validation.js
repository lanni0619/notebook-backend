const Joi = require("joi");

const signupCheck = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(6).max(255).required(),
});

const loginCheck = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(6).max(255).required(),
});

const noteCheck = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().min(1).required(),
});

module.exports.signupCheck = signupCheck;
module.exports.loginCheck = loginCheck;
module.exports.noteCheck = noteCheck;
