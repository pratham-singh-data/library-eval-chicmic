const { Schema, model, Types: { ObjectId, }, } = require('mongoose');
const { FRIEND_REQUEST_STATUS, } = require('../utils/constants');

const friendSchema = new Schema({
    sender: {
        type: ObjectId,
        required: true,
    },
    reciever: {
        type: ObjectId,
        required: true,
    },
    status: {
        type: String,
        default: FRIEND_REQUEST_STATUS.PENDING,
    },
}, {
    timestamps: true,
});

const friendModel = model(`friends`, friendSchema);

module.exports = {
    friendModel,
};
