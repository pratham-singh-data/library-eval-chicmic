const { sign, } = require('jsonwebtoken');
const { SECRET_KEY, } = require('../../config');
const { hashPassword, } = require('../helpers/hashPassword');
const { generateLocalSendResponse, } = require('../helpers/responder');
const { findOneInUsers,
    saveDocumentInUsers,
    saveDocumentInTokens, } = require('../services');
const { TOKEN_EXPIRY_TIME, } = require('../utils/constants');
const { EMAIL_ALREADY_IN_USE,
    DATA_SUCCESSFULLY_CREATED,
    CREDENTIALS_COULD_NOT_BE_VERIFIED,
    SUCCESSFUL_LOGIN, } = require('../utils/messages');

/** Register new user in database
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function registerUser(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const { body, } = req;

    try {
        // check whether email is unique
        // redundant check as email is a unique index
        if (await findOneInUsers({
            email: body.email,
        })) {
            localResponder({
                statusCode: 400,
                message: EMAIL_ALREADY_IN_USE,
            });

            return;
        }

        body.password = hashPassword(body.password);

        const savedData = await saveDocumentInUsers(body);

        const token = sign({
            id: savedData._id,
        }, SECRET_KEY, {
            expiresIn: TOKEN_EXPIRY_TIME.LOGIN,
        });

        await saveDocumentInTokens({
            token,
            userId: savedData._id,
        });

        localResponder({
            statusCode: 200,
            message: DATA_SUCCESSFULLY_CREATED,
            token,
            savedData,
        });
    } catch (err) {
        next(err);
    }
}

/** Logs in an existing user
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function loginUser(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const { body, } = req;

    try {
        body.password = hashPassword(body.password);

        const userData = await findOneInUsers(body);

        if (! userData) {
            localResponder({
                statusCode: 400,
                message: CREDENTIALS_COULD_NOT_BE_VERIFIED,
            });

            return;
        }

        const token = sign({
            id: userData._id,
        }, SECRET_KEY, {
            expiresIn: TOKEN_EXPIRY_TIME.LOGIN,
        });

        await saveDocumentInTokens({
            token,
            userId: userData._id,
        });

        localResponder({
            statusCode: 200,
            message: SUCCESSFUL_LOGIN,
            token,
        });
    } catch (err) {
        next(err);
    }
}


module.exports = {
    registerUser,
    loginUser,
};
