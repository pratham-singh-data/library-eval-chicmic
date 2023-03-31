const Joi = require('joi');
const { objectIdValidator, } = require('../utils/objectIIdValidator');

const soleIdValidator = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
});

module.exports = {
    soleIdValidator,
};
