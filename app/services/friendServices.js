const { friendModel, } = require('../models');
const { saveDocument,
    findOne,
    runAggregate,
    findById,
    updateById, } = require('./serviceOperators/operators');

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

/** Runs an aggregation pipeline on the friends model
 * @param {Array} pipeline aggregation pipeline to run
 * @return {Object} Result of operation
 */
async function runAggregateOnFriends(pipeline) {
    return await runAggregate(friendModel, pipeline);
}

/** finds id element from friends model
 * @param {String} id Id of document to retrieve
 * @return {Object} data from database
 */
async function findFromFriendsById(id) {
    return await findById(friendModel, id);
}

/** updates id element from books model
 * @param {String} id id of element to update
 * @param {Object} updateQuery update query for collection
 */
async function updateInFriendsById(id, updateQuery) {
    await updateById(friendModel, id, updateQuery);
}

module.exports = {
    saveDocumentInFriends,
    findOneInFriends,
    runAggregateOnFriends,
    findFromFriendsById,
    updateInFriendsById,
};
