const { Router, } = require('express');
const { registerBook, } = require('../controllers/bookController');
const { checkToken, } = require('../middlewares/checkToken');
const { validateBody, } = require('../middlewares/validators');
const { TOKEN_TYPES, } = require('../utils/constants');
const { registerBookValidator, } = require('../validators');

// eslint-disable-next-line new-cap
const bookRouter = Router();

bookRouter.post(`/`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateBody(registerBookValidator),
    registerBook);

module.exports = {
    bookRouter,
};
