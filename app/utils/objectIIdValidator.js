const { isValidObjectId, } = require('mongoose');
const { CANNOT_BE_CAST_TO_OBJECTID, } = require('./messages');

/** Checks if input is a valid objectID
 * @param {String} inp Input to validate
 * @return {String} A validated inp
 */
function objectIdValidator(inp) {
    if (! isValidObjectId(inp)) {
        throw new Error(CANNOT_BE_CAST_TO_OBJECTID);
    }

    return inp;
}

module.exports = {
    objectIdValidator,
};
