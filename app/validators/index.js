const { signUpValidator, } = require(`./signUpValidator`);
const { loginValidator, } = require(`./loginValidator`);
const { soleIdValidator, } = require(`./soleIdValidator`);
const { registerBookValidator, } = require(`./registerBookValidator`);

module.exports = {
    signUpValidator,
    loginValidator,
    soleIdValidator,
    registerBookValidator,
};
