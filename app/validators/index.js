const { signUpValidator, } = require(`./signUpValidator`);
const { loginValidator, } = require(`./loginValidator`);
const { soleIdValidator, } = require(`./soleIdValidator`);
const { registerBookValidator, } = require(`./registerBookValidator`);
const { soleBookIdValidator, } = require(`./soleBookIdValidator`);
const { updateBookValidator, } = require(`./updateBookValidator`);
const { approveRequestValidator, } = require(`./approveRequestValidator`);

module.exports = {
    signUpValidator,
    loginValidator,
    soleIdValidator,
    registerBookValidator,
    soleBookIdValidator,
    updateBookValidator,
    approveRequestValidator,
};
