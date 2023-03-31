const { Router, } = require('express');
const { registerUser, loginUser, } = require('../controllers/userControllers');
const { validateBody, } = require('../helpers/validators');
const { signUpValidator, loginValidator, } = require('../validators');

// eslint-disable-next-line new-cap
const userRouter = Router();

userRouter.post(`/register`, validateBody(signUpValidator), registerUser);
userRouter.post(`/login`, validateBody(loginValidator), loginUser);

module.exports = {
    userRouter,
};
