module.exports = {
    DEFAULT_SALT: `DEFAULT_SALT`,
    DEFAULT_SECRET_KEY: `DEFAULT_SECRET_KEY`,
    DEFAULT_PROFILE_PICTURE: `DEFUALT_PROFILE_PICTURE`,
    DEFAULT_USER_TYPE: `normal`,
    STRING_LENGTH_MIN: 1,
    STRING_LENGTH_MAX: {
        SHORT: 80,
        NORMAL: 1000,
        LONG: 999999999,
    },
    TOKEN_TYPES: {
        LOGIN: 0,
    },
    TOKEN_EXPIRY_TIME: {
        LOGIN: 31536000, // 365 * 24 * 60 * 60; one year
    },
    FRIEND_REQUEST_STATUS: {
        PENDING: `pending`,
        APPROVED: `approved`,
        REJECTED: `rejected`,
    },
};
