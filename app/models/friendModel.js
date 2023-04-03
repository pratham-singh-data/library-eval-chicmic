const { Schema, model, Types: { ObjectId, }, } = require('mongoose');

const friendSchema = new Schema({
    sender: {
        type: ObjectId,
        required: true,
    },
    reciever: {
        type: ObjectId,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const friendModel = model(`friends`, friendSchema);

module.exports = {
    friendModel,
};
