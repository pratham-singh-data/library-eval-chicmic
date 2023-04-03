const Joi = require('joi');
const { objectIdValidator, } = require('../utils/objectIIdValidator');

const approveRequestValidator = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
    approval: Joi.boolean().required(),
});

module.exports = {
    approveRequestValidator,
};
