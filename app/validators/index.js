const { signUpValidator, } = require(`./signUpValidator`);
const { loginValidator, } = require(`./loginValidator`);
const { soleIdValidator, } = require(`./soleIdValidator`);
const { registerBookValidator, } = require(`./registerBookValidator`);
const { soleBookIdValidator, } = require(`./soleBookIdValidator`);
const { updateBookValidator, } = require(`./updateBookValidator`);
const { requestApprovalValidator, } = require(`./requestApprovalValidator`);

module.exports = {
    signUpValidator,
    loginValidator,
    soleIdValidator,
    registerBookValidator,
    soleBookIdValidator,
    updateBookValidator,
    requestApprovalValidator,
};
