const { writeFileSync, } = require(`fs`);
const { ERROR_LOG_DIRECTORY_URL } = require('./constants');
const { error, } = require('./logger');

/** Logs error to console
 * @param {Error} err Error object
 */
function loggingErrorHandler(err) {
    const logFileName = `${ERROR_LOG_DIRECTORY_URL}/${Date.now()}.error.log`;

    writeFileSync(logFileName,
        `${err.name}\n\n${err.stack}`);

    error(`${err.message}\nError details in ${logFileName}`);
}

module.exports = {
    loggingErrorHandler,
};
