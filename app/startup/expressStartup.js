const { json, } = require('express');
const { notFound, } = require('../controllers/notFoundController');
const { handleError, } = require('../middlewares/handleError');
const { userRouter, bookRouter, uploadRouter, } = require('../routes');

/** Express startup function
 * @param {Application} app Express application object
 */
function expressStartup(app) {
    app.use(json());

    app.use(`/user`, userRouter);
    app.use(`/book`, bookRouter);
    app.use(`/uploads`, uploadRouter);

    app.use(handleError, notFound);
}

module.exports = {
    expressStartup,
};
