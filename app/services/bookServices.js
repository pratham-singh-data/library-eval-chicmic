const { bookModel, } = require('../models/bookModel');
const { saveDocument, findById, } = require('./serviceOperators/operators');

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

module.exports = {
    saveDocumentInBooks,
    findFromBooksById,
};
