const { userRouter, } = require(`./user`);
const { bookRouter, } = require(`./books`);
const { uploadRouter, } = require(`./uploads`);

module.exports = {
    userRouter,
    bookRouter,
    uploadRouter,
};
