const Joi = require('joi');

const soleBookIdValidator = Joi.object({
    id: Joi.string().required(),
});

module.exports = {
    soleBookIdValidator,
};
