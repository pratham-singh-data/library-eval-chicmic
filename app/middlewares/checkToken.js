const { verify, } = require('jsonwebtoken');
const { SECRET_KEY, } = require('../../config');
const { generateLocalSendResponse, } = require('../helpers/responder');
const { findOneInTokens, findFromUsersById, } = require('../services');
const { VALID_TOKEN_NEEDED,
    INVALID_TOKENTYPE,
    CREDENTIALS_COULD_NOT_BE_VERIFIED, } = require('../utils/messages');

/** Returns a token checking middleware function
 * @param {Array} types array of types of token to validate
 * @return {Function} token validation function
 */
function checkToken(...types) {
    /** Checks token send by request
     * @param {Request} req Express request object
     * @param {Response} res Express response object
     * @param {Function} next Express next function
     */
    return async function(req, res, next) {
        const localResponder = generateLocalSendResponse(res);

        // check that token was sent
        if (! req.headers.token) {
            localResponder({
                statusCode: 403,
                message: VALID_TOKEN_NEEDED,
            });

            return;
        }

        const tokenData = await findOneInTokens({
            token: req.headers.token,
        });

        // check that token recieved was from your system
        if (! tokenData) {
            localResponder({
                statusCode: 403,
                message: VALID_TOKEN_NEEDED,
            });

            return;
        }

        // check that given is a login token
        if (! types.includes(tokenData.tokenType)) {
            localResponder({
                statusCode: 403,
                message: INVALID_TOKENTYPE,
            });

            return;
        }

        try {
            req.headers.token = verify(req.headers.token, SECRET_KEY);
        } catch (err) {
            localResponder({
                statusCode: 403,
                message: VALID_TOKEN_NEEDED,
            });

            return;
        }

        // confirm a corresponding user exists
        const userData = await findFromUsersById(req.headers.token.id);

        if (! userData) {
            localResponder({
                statusCode: 403,
                message: CREDENTIALS_COULD_NOT_BE_VERIFIED,
            });

            return;
        }

        // user is valid if they are here
        next();
    };
}

module.exports = {
    checkToken,
};
