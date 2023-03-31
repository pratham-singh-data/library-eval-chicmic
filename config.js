const { DEFAULT_SALT, DEFAULT_SECRET_KEY, } = require('./app/utils/constants');

module.exports = {
    PORT: process.env.PORT ?? 8000,
    MONGODB_URL: process.env.MONGODB_URL,
    SALT: process.env.SALT ?? DEFAULT_SALT,
    SECRET_KEY: process.env.SECRET_KEY ?? DEFAULT_SECRET_KEY,
};
