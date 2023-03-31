const { sign, } = require('jsonwebtoken');
const { SECRET_KEY, } = require('../../config');
const { hashPassword, } = require('../helpers/hashPassword');
const { generateLocalSendResponse, } = require('../helpers/responder');
const { findOneInUsers,
    saveDocumentInUsers,
    saveDocumentInTokens, } = require('../services');
const { TOKEN_EXPIRY_TIME, } = require('../utils/constants');
const { EMAIL_ALREADY_IN_USE,
    DATA_SUCCESSFULLY_CREATED, } = require('../utils/messages');

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

module.exports = {
    registerUser,
};
