const { Router, } = require('express');
const { registerUser,
    loginUser,
    updateUser, } = require('../controllers/userControllers');
const { validateBody, } = require('../helpers/validators');
const { checkToken, } = require('../middlewares/checkToken');
const { TOKEN_TYPES, } = require('../utils/constants');
const { signUpValidator,
    loginValidator, } = require('../validators');

// eslint-disable-next-line new-cap
const userRouter = Router();

userRouter.post(`/register`, validateBody(signUpValidator), registerUser);
userRouter.post(`/login`, validateBody(loginValidator), loginUser);
userRouter.put(`/`, checkToken(TOKEN_TYPES.LOGIN),
    validateBody(signUpValidator),
    updateUser);

module.exports = {
    userRouter,
};
