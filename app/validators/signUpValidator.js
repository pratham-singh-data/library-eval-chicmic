const Joi = require('joi');
const { STRING_LENGTH_MIN, STRING_LENGTH_MAX, } = require('../utils/constants');

const signUpValidator = Joi.object({
    name: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.SHORT).
        required(),
    email: Joi.string().
        email().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
        required(),
    password: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
        required(),
    profilePicture: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
        required(),
    type: Joi.string().valid(`normal`, `author`).required(),
});

module.exports = {
    signUpValidator,
};
