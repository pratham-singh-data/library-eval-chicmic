const { Schema, model, Types: { ObjectId, }, } = require('mongoose');
const { DEFAULT_PROFILE_PICTURE,
    DEFAULT_USER_TYPE, } = require('../utils/constants');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: DEFAULT_PROFILE_PICTURE,
    },
    type: {
        type: String,
        default: DEFAULT_USER_TYPE,
    },
    purchasedBooks: [ ObjectId, ],
    requestedFriends: [ ObjectId, ],
    friends: [ ObjectId, ],
});

const userModel = model(`users`, userSchema);

module.exports = {
    userModel,
};
