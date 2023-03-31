const { sign, } = require('jsonwebtoken');
const { SECRET_KEY, } = require('../../config');
const { hashPassword, } = require('../helpers/hashPassword');
const { generateLocalSendResponse, } = require('../helpers/responder');
const { findOneInUsers,
    saveDocumentInUsers,
    saveDocumentInTokens,
    updateInUsersById,
    findFromUsersById, } = require('../services');
const { TOKEN_EXPIRY_TIME, TOKEN_TYPES, } = require('../utils/constants');
const { EMAIL_ALREADY_IN_USE,
    DATA_SUCCESSFULLY_CREATED,
    CREDENTIALS_COULD_NOT_BE_VERIFIED,
    SUCCESSFUL_LOGIN,
    DATA_SUCCESSFULLY_UPDATED,
    CANNOT_ACCESS_DATA,
    NON_EXISTENT_USER, } = require('../utils/messages');

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
            type: TOKEN_TYPES.LOGIN,
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
            type: TOKEN_TYPES.LOGIN,
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

/** Updates an existing user
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function updateUser(req, res, next) {
    const { body, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    body.password = hashPassword(body.password);

    try {
        // check if email is already regsiterred by any user other the self
        if (await findOneInUsers({
            email: body.email,
            _id: {
                $ne: token.id,
            },
        })) {
            localResponder({
                statusCode: 403,
                message: EMAIL_ALREADY_IN_USE,
            });

            return;
        }

        await updateInUsersById(token.id, {
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

/** Reads an existing user (Can be done by self and friends)
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function readUser(req, res, next) {
    const { params: { id, }, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        const targetUserData = await findFromUsersById(id);

        if (! targetUserData) {
            localResponder({
                statusCode: 400,
                message: NON_EXISTENT_USER,
            });

            return;
        }

        // if reading self; no problem
        if (String(targetUserData._id) === token.id) {
            localResponder({
                statusCode: 200,
                data: targetUserData,
            });

            return;
        }

        // check if reading friend, if so: allow
        if (targetUserData.friends.includes(token.id)) {
            localResponder({
                statusCode: 200,
                data: targetUserData,
            });

            return;
        }

        // cannot read
        localResponder({
            statusCode: 401,
            message: CANNOT_ACCESS_DATA,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    readUser,
};
