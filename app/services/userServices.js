const { userModel, } = require('../models');
const { saveDocument,
    findById,
    findOne,
    updateById, } = require('./serviceOperators/operators');

/** Saves a document in users model
 * @param {Object} doc Document to store in model
 */
async function saveDocumentInUsers(doc) {
    return await saveDocument(userModel, doc);
};

/** finds id element from users model
 * @param {String} id Id of document to retrieve
 * @return {Object} data from database
 */
async function findFromUsersById(id) {
    return await findById(userModel, id);
}

/** executes searchQuery and projectionQuery on users model
 * @param {Object} searchQuery search query to execute on collection
 * @param {Object} projectionQuery projection query to execute on collection
 * @return {Object} data from database
 */
async function findOneInUsers(searchQuery, projectionQuery) {
    return await findOne(userModel, searchQuery, projectionQuery);
}

/** updates id element from users model
 * @param {String} id id of element to update
 * @param {Object} updateQuery update query for collection
 */
async function updateInUsersById(id, updateQuery) {
    await updateById(userModel, id, updateQuery);
}

module.exports = {
    saveDocumentInUsers,
    findFromUsersById,
    findOneInUsers,
    updateInUsersById,
};
