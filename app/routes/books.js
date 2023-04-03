const { Router, } = require('express');
const { registerBook,
    readBook,
    listAllBooks,
    purchaseBook,
    deleteBook,
    updateBook, } = require('../controllers/bookController');
const { checkToken, } = require('../middlewares/checkToken');
const { validateBody, validateParams, } = require('../middlewares/validators');
const { TOKEN_TYPES, } = require('../utils/constants');
const { registerBookValidator,
    soleBookIdValidator,
    updateBookValidator, } = require('../validators');

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
bookRouter.patch(`/:id/purchase`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleBookIdValidator),
    purchaseBook);
bookRouter.delete(`/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleBookIdValidator),
    deleteBook);
bookRouter.put(`/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleBookIdValidator),
    validateBody(updateBookValidator),
    updateBook);

module.exports = {
    bookRouter,
};
