const { bookModel, } = require('../models/bookModel');
const { saveDocument,
    findById,
    runAggregate,
    updateById, } = require('./serviceOperators/operators');

/** Saves a document in books model
 * @param {Object} doc Document to store in model
 */
async function saveDocumentInBooks(doc) {
    return await saveDocument(bookModel, doc);
};

/** finds id element from books model
 * @param {String} id Id of document to retrieve
 * @return {Object} data from database
 */
async function findFromBooksById(id) {
    return await findById(bookModel, id);
}

/** Runs an aggregation pipeline on the books model
 * @param {Array} pipeline aggregation pipeline to run
 * @return {Object} Result of operation
 */
async function runAggregateOnBooks(pipeline) {
    return await runAggregate(bookModel, pipeline);
}

/** updates id element from books model
 * @param {String} id id of element to update
 * @param {Object} updateQuery update query for collection
 */
async function updateInBooksById(id, updateQuery) {
    await updateById(bookModel, id, updateQuery);
}

module.exports = {
    saveDocumentInBooks,
    findFromBooksById,
    runAggregateOnBooks,
    updateInBooksById,
};
