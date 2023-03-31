const { Router, } = require('express');
const { registerUser, } = require('../controllers/userControllers');
const { validateBody, } = require('../helpers/validators');
const { signUpValidator, } = require('../validators');

// eslint-disable-next-line new-cap
const userRouter = Router();

userRouter.post(`/register`, validateBody(signUpValidator), registerUser);

module.exports = {
    userRouter,
};
