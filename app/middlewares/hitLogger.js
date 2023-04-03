const { appendFileSync, } = require(`fs`);
const { HIT_LOG_FILE_URL, } = require('../utils/constants');

/** Logs hits in a log file
 * @param { Request } req Express request object
 * @param { Response } res Express response object
 * @param { Function } next Express next functiom
*/
function hitLogger(req, res, next) {
    appendFileSync(HIT_LOG_FILE_URL,
        `${Date.now()}\t${req.method}\t${req.originalUrl}\n`);

    next();
}

module.exports = {
    hitLogger,
};
