const mongoose = require(`mongoose`);
const { MONGODB_URL, } = require('../../config');

/** Asyncronously connects to mongoose server
 */
async function mongoConnect() {
    await mongoose.connect(MONGODB_URL);
    console.log(`Successfully connected to MongoDB at ${MONGODB_URL}`);
}

module.exports = {
    mongoConnect,
};
