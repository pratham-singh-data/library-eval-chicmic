const { json, } = require('express');
const { notFound, } = require('../controllers/notFoundController');
const { handleError, } = require('../middlewares/handleError');
const { hitLogger, } = require('../middlewares/hitLogger');
const { userRouter, bookRouter, uploadRouter, } = require('../routes');

/** Express startup function
 * @param {Application} app Express application object
 */
function expressStartup(app) {
    app.use(json());
    app.use(hitLogger);

    app.use(`/user`, userRouter);
    app.use(`/book`, bookRouter);
    app.use(`/uploads`, uploadRouter);

    app.use(handleError, notFound);
}

module.exports = {
    expressStartup,
};
