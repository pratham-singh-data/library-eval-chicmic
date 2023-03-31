const { json, } = require('express');
const { handleError, } = require('../middlewares/handleError');
const { userRouter, } = require('../routes');

/** Express startup function
 * @param {Application} app Express application object
 */
function expressStartup(app) {
    app.use(json());

    app.use(`/user`, userRouter);

    app.use(handleError);
}

module.exports = {
    expressStartup,
};
