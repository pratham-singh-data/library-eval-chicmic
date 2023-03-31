const { generateLocalSendResponse, } = require('../helpers/responder');
const { findFromBooksById,
    findFromUsersById,
    saveDocumentInBooks,
    findOneInUsers, } = require('../services');
const { BOOK_ALREADY_REGISTERED,
    CANNOT_ACCESS_DATA,
    ONE_AUTHOR_NOT_REGISTERED,
    ONLY_AUTHOR_CAN_REGISTER_BOOKS,
    DATA_SUCCESSFULLY_CREATED, } = require('../utils/messages');

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

module.exports = {
    registerBook,
};
