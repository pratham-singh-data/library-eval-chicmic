const { Router, } = require('express');
const { registerUser,
    loginUser,
    updateUser,
    readUser,
    requestFriend,
    listRequests,
    approveRequest, } = require('../controllers/userControllers');
const { validateBody, validateParams, } = require('../middlewares/validators');
const { checkToken, } = require('../middlewares/checkToken');
const { TOKEN_TYPES, } = require('../utils/constants');
const { signUpValidator,
    loginValidator,
    soleIdValidator,
    requestApprovalValidator, } = require('../validators');

// eslint-disable-next-line new-cap
const userRouter = Router();

userRouter.post(`/register`, validateBody(signUpValidator), registerUser);
userRouter.post(`/login`, validateBody(loginValidator), loginUser);
userRouter.put(`/`, checkToken(TOKEN_TYPES.LOGIN),
    validateBody(signUpValidator),
    updateUser);
userRouter.get(`/requests`,
    checkToken(TOKEN_TYPES.LOGIN),
    listRequests);
userRouter.get(`/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleIdValidator),
    readUser);
userRouter.post(`/:id/request`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleIdValidator),
    requestFriend);
userRouter.patch(`/request/:id/:approval`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(requestApprovalValidator),
    approveRequest);

module.exports = {
    userRouter,
};
