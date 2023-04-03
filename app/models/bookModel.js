const { Schema, model, Types: { ObjectId, }, } = require('mongoose');

const bookSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    authors: [ ObjectId, ],
    deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const bookModel = model(`books`, bookSchema);

module.exports = {
    bookModel,
};
