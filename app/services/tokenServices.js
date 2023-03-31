const { tokenModel, } = require('../models');
const { saveDocument, findOne, } = require('./serviceOperators/operators');

/** Saves a document in users model
 * @param {Object} doc Document to store in model
 */
async function saveDocumentInTokens(doc) {
    return await saveDocument(tokenModel, doc);
};

/** executes searchQuery and projectionQueryon given model
 * @param {Object} searchQuery search query to execute on collection
 * @param {Object} projectionQuery projection query to execute on collection
 * @return {Object} data from database
 */
async function findOneInTokens(searchQuery, projectionQuery) {
    return await findOne(tokenModel, searchQuery, projectionQuery);
}

module.exports = {
    saveDocumentInTokens,
    findOneInTokens,
};
