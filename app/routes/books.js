const { Router, } = require('express');
const { registerBook,
    readBook,
    listAllBooks, } = require('../controllers/bookController');
const { checkToken, } = require('../middlewares/checkToken');
const { validateBody, validateParams, } = require('../middlewares/validators');
const { TOKEN_TYPES, } = require('../utils/constants');
const { registerBookValidator,
    soleBookIdValidator, } = require('../validators');

// eslint-disable-next-line new-cap
const bookRouter = Router();

bookRouter.post(`/`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateBody(registerBookValidator),
    registerBook);
bookRouter.get(`/`,
    checkToken(TOKEN_TYPES.LOGIN),
    listAllBooks);
bookRouter.get(`/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleBookIdValidator),
    readBook);

module.exports = {
    bookRouter,
};
