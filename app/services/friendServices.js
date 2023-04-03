const { friendModel, } = require('../models');
const { saveDocument, findOne, } = require('./serviceOperators/operators');

/** Saves a document in friends model
 * @param {Object} doc Document to store in model
 */
async function saveDocumentInFriends(doc) {
    return await saveDocument(friendModel, doc);
};

/** executes searchQuery on friends model
 * @param {Object} searchQuery search query to execute on collection
 * @param {Object} projectionQuery projection query to execute on collection
 * @return {Object} data from database
 */
async function findOneInFriends(searchQuery, projectionQuery) {
    return findOne(friendModel, searchQuery, projectionQuery);
}

module.exports = {
    saveDocumentInFriends,
    findOneInFriends,
};
