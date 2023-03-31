const Joi = require('joi');
const { STRING_LENGTH_MIN, STRING_LENGTH_MAX, } = require('../utils/constants');
const { objectIdValidator, } = require('../utils/objectIIdValidator');

const registerBookValidator = Joi.object({
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
    authors: Joi.array().
        items(Joi.string().custom(objectIdValidator)).
        unique().
        min(1).
        required(),
    ISBN: Joi.string().required(),
});

module.exports = {
    registerBookValidator,
};
