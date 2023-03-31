const { Schema, model, } = require('mongoose');
const { TOKEN_TYPES, } = require('../utils/constants');

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        default: TOKEN_TYPES.LOGIN,
    },
}, {
    timestamps: true,
});

const tokenModel = model(`tokens`, tokenSchema);

module.exports = {
    tokenModel,
};
