const { sendResponse, } = require('../helpers/responder');

/** Reads an existing user (Can be done by self and friends)
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function notFound(req) {
    sendResponse(req.res, {
        statsuCode: 404,
        message: `Endpoint does not exist.`,
    });
}

module.exports = {
    notFound,
};
