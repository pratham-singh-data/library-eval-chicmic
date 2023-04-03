const Joi = require('joi');
const { STRING_LENGTH_MIN, STRING_LENGTH_MAX, } = require('../utils/constants');

const updateBookValidator = Joi.object({
    name: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.SHORT).
        required(),
    text: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.LONG).
        required(),
    pages: Joi.number().integer().min(2).max(99999).required(),
    profilePicture: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
        required(),
});

module.exports = {
    updateBookValidator,
};
