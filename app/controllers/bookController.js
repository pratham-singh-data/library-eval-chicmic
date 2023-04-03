const { generateLocalSendResponse,
    sendResponse, } = require('../helpers/responder');
const { findFromBooksById,
    findFromUsersById,
    saveDocumentInBooks,
    findOneInUsers,
    runAggregateOnBooks,
    updateInUsersById,
    updateInBooksById, } = require('../services');
const { BOOK_ALREADY_REGISTERED,
    CANNOT_ACCESS_DATA,
    ONE_AUTHOR_NOT_REGISTERED,
    ONLY_AUTHOR_CAN_REGISTER_BOOKS,
    DATA_SUCCESSFULLY_CREATED,
    NON_EXISTENT_BOOK,
    DATA_SUCCESSFULLY_UPDATED,
    DATA_SUCCESSFULLY_DELETED, } = require('../utils/messages');

/** Reads an existing user (Can be done by self and friends)
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function registerBook(req, res, next) {
    const { body, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        // user must be an author
        const userData = await findFromUsersById(token.id);

        if (userData.type !== `author`) {
            localResponder({
                statusCode: 403,
                message: ONLY_AUTHOR_CAN_REGISTER_BOOKS,
            });

            return;
        }

        // check if the id is already registerred
        if (await findFromBooksById(body.ISBN)) {
            localResponder({
                statusCode: 403,
                message: BOOK_ALREADY_REGISTERED,
            });

            return;
        }

        // at least one of the authors should be self
        if (! body.authors.includes(token.id)) {
            localResponder({
                statusCode: 401,
                message: CANNOT_ACCESS_DATA,
            });

            return;
        }

        // every author should be in the database
        for (const authorId of body.authors) {
            if (! await findOneInUsers({
                _id: authorId,
                type: `author`,
            })) {
                localResponder({
                    statusCode: 400,
                    message: ONE_AUTHOR_NOT_REGISTERED,
                });

                return;
            }
        }

        body._id = body.ISBN;
        delete body.ISBN;
        const savedData = await saveDocumentInBooks(body);

        localResponder({
            statusCode: 200,
            nmessage: DATA_SUCCESSFULLY_CREATED,
            savedData,
        });
    } catch (err) {
        next(err);
    }
}

/** Reads an existing book
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function readBook(req, res, next) {
    const { params: { id, }, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        const userData = await findFromUsersById(token.id);
        const bookData = await findFromBooksById(id);

        // user can still read a deleted book if they previously purchased it
        if (! bookData || ( bookData.deleted &&
                        ! userData.purchasedBooks.includes(bookData._id) )) {
            localResponder({
                statusCode: 400,
                message: NON_EXISTENT_BOOK,
            });

            return;
        }

        localResponder({
            statusCode: 200,
            data: bookData,
        });
    } catch (err) {
        next(err);
    }
}


/** Reads all books
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function listAllBooks(req, res, next) {
    try {
        const data = await runAggregateOnBooks([
            {
                $lookup: {
                    from: `users`,
                    foreignField: `_id`,
                    localField: `authors`,
                    as: `authors`,
                },
            },
        ]);

        sendResponse(res, {
            statusCode: 200,
            data,
        });
    } catch (err) {
        next(err);
    }
}

/** Purchase book of given id
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function purchaseBook(req, res, next) {
    const { params: { id, }, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        const bookData = await findFromBooksById(id);

        if (! bookData || bookData.deleted) {
            localResponder({
                statusCode: 400,
                message: NON_EXISTENT_BOOK,
            });

            return;
        }

        // user can purchase the same book multiple times
        await updateInUsersById(token.id, {
            $push: {
                purchasedBooks: bookData.id,
            },
        });

        localResponder({
            statusCode: 200,
            message: DATA_SUCCESSFULLY_UPDATED,
        });
    } catch (err) {
        next(err);
    }
}

/** Delete book of given id
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function deleteBook(req, res, next) {
    const { params: { id, }, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        const bookData = await findFromBooksById(id);

        // check if book exists
        if (! bookData || bookData.deleted) {
            localResponder({
                statusCode: 400,
                message: NON_EXISTENT_BOOK,
            });

            return;
        }

        // this operation may only be performed by an author of this book
        if (! bookData.authors.includes(token.id)) {
            localResponder({
                statusCode: 401,
                message: CANNOT_ACCESS_DATA,
            });

            return;
        }

        await updateInBooksById(id, {
            $set: {
                deleted: true,
            },
        });

        localResponder({
            statusCode: 200,
            message: DATA_SUCCESSFULLY_DELETED,
        });
    } catch (err) {
        next(err);
    }
}

/** Updates book of given id
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function updateBook(req, res, next) {
    const { params: { id, }, body, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        const bookData = await findFromBooksById(id);

        // check if book exists
        if (! bookData || bookData.deleted) {
            localResponder({
                statusCode: 400,
                message: NON_EXISTENT_BOOK,
            });

            return;
        }

        // this operation may only be performed by an author of this book
        if (! bookData.authors.includes(token.id)) {
            localResponder({
                statusCode: 401,
                message: CANNOT_ACCESS_DATA,
            });

            return;
        }

        updateInBooksById(id, {
            $set: body,
        });

        localResponder({
            statusCode: 200,
            message: DATA_SUCCESSFULLY_UPDATED,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    registerBook,
    readBook,
    listAllBooks,
    purchaseBook,
    deleteBook,
    updateBook,
};
