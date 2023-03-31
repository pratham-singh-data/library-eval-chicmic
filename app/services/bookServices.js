const { bookModel, } = require('../models/bookModel');
const { saveDocument,
    findById,
    runAggregate, } = require('./serviceOperators/operators');

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

module.exports = {
    saveDocumentInBooks,
    findFromBooksById,
    runAggregateOnBooks,
};
