const { sign, } = require('jsonwebtoken');
const { SECRET_KEY, } = require('../../config');
const { hashPassword, } = require('../helpers/hashPassword');
const { generateLocalSendResponse,
    sendResponse, } = require('../helpers/responder');
const { findOneInUsers,
    saveDocumentInUsers,
    saveDocumentInTokens,
    updateInUsersById,
    findFromUsersById,
    saveDocumentInFriends,
    findOneInFriends,
    runAggregateOnFriends,
    findFromFriendsById,
    updateInFriendsById,
    findInUsers, } = require('../services');
const { TOKEN_EXPIRY_TIME,
    TOKEN_TYPES,
    FRIEND_REQUEST_STATUS, } = require('../utils/constants');
const { Types: { ObjectId, }, } = require(`mongoose`);
const { EMAIL_ALREADY_IN_USE,
    DATA_SUCCESSFULLY_CREATED,
    CREDENTIALS_COULD_NOT_BE_VERIFIED,
    SUCCESSFUL_LOGIN,
    DATA_SUCCESSFULLY_UPDATED,
    CANNOT_ACCESS_DATA,
    NON_EXISTENT_USER,
    NO_SELF_FRIEND,
    DUPLICATE_FRIEND_REQUEST,
    NON_EXISTENT_REQUEST, } = require('../utils/messages');

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
        if (await findOneInFriends({
            $or: [
                {
                    sender: token.id,
                    reciever: id,
                },

                {
                    sender: id,
                    reciever: token.id,
                },
            ],
        })) {
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

/** Registers a friend request
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function requestFriend(req, res, next) {
    const { params: { id, }, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    // cannot send self a friend request
    if (token.id === id) {
        localResponder({
            statusCode: 400,
            message: NO_SELF_FRIEND,
        });

        return;
    }

    try {
        // check that the other user exists
        const targetUserData = await findFromUsersById(id);

        if (! targetUserData) {
            localResponder({
                statusCode: 400,
                message: NON_EXISTENT_USER,
            });

            return;
        }

        // check if friend request is already registered
        if (await findOneInFriends({
            $or: [
                {
                    sender: token.id,
                    reciever: id,
                },

                {
                    reciever: token.id,
                    sender: id,
                },
            ],
        })) {
            localResponder({
                statusCode: 403,
                message: DUPLICATE_FRIEND_REQUEST,
            });

            return;
        }

        // generate data
        const data = {
            sender: token.id,
            reciever: id,
            status: FRIEND_REQUEST_STATUS.PENDING,
        };

        const savedData = await saveDocumentInFriends(data);

        localResponder({
            statusCode: 200,
            message: DATA_SUCCESSFULLY_CREATED,
            savedData,
        });
    } catch (err) {
        next(err);
    }
}

/** Lists all requests of the current user
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function listRequests(req, res, next) {
    const { headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        const data = await runAggregateOnFriends([
            {
                $match: {
                    reciever: new ObjectId(token.id),
                    status: FRIEND_REQUEST_STATUS.PENDING,
                },
            },

            {
                $lookup: {
                    from: `users`,
                    localField: `sender`,
                    foreignField: `_id`,
                    as: `sender`,
                },
            },
        ]);

        localResponder({
            statusCode: 200,
            data,
        });
    } catch (err) {
        next(err);
    }
}

/** Approves or Disapproves Id request
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function approveRequest(req, res, next) {
    const { params: { id, approval, }, headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        const requestData = await findFromFriendsById(id);

        if (! requestData) {
            localResponder({
                statusCode: 400,
                message: NON_EXISTENT_REQUEST,
            });

            return;
        }

        // do not allow if user is not the reciever
        if (String(requestData.reciever) !== token.id) {
            localResponder({
                statusCode: 401,
                message: CANNOT_ACCESS_DATA,
            });

            return;
        }

        // reciever can alter state
        await updateInFriendsById(id, {
            $set: {
                FRIEND_REQUEST_STATUS: approval ?
                    FRIEND_REQUEST_STATUS.APPROVED :
                    FRIEND_REQUEST_STATUS.REJECTED,
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

/** Checks sent requests
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function checkSentRequests(req, res, next) {
    const { headers: { token, }, } = req;
    const localResponder = generateLocalSendResponse(res);

    try {
        const data = await runAggregateOnFriends([
            {
                $match: {
                    sender: new ObjectId(token.id),
                },
            },

            {
                $lookup: {
                    from: `users`,
                    localField: `reciever`,
                    foreignField: `_id`,
                    as: `reciever`,
                },
            },
        ]);

        localResponder({
            statusCode: 200,
            data,
        });
    } catch (err) {
        next(err);
    }
}

/** List all users (to add as friends)
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function listUsers(req, res, next) {
    const { headers: { token, }, } = req;

    try {
        const data = await findInUsers({
            _id: {
                $ne: token.id,
            },
        }, {
            _id: true,
            name: true,
            profilePicture: true,
        });

        sendResponse(res, {
            statusCode: 200,
            data,
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
    requestFriend,
    listRequests,
    approveRequest,
    checkSentRequests,
    listUsers,
};
