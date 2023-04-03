const { Router, static, } = require('express');
const { uploadImageControllerGenerator, } =
    require('../controllers/uploadController');
const { sendResponse, } = require('../helpers/responder');
const { checkToken, } = require('../middlewares/checkToken');
const { IMAGE_DATABASE_URL, TOKEN_TYPES, } = require('../utils/constants');

// eslint-disable-next-line new-cap
const uploadRouter = Router();

uploadRouter.use(`/image`, static(IMAGE_DATABASE_URL));

// empty callback added to prevent an error due to setting response twice
uploadRouter.post(`/image`,
    checkToken(TOKEN_TYPES.LOGIN),
    uploadImageControllerGenerator(`file`),
    (req, res) => {
        if (! req.file) {
            return;
        }

        sendResponse(res, {
            statusCode: 200,
            message: `${req.baseUrl}/image/${req.file.filename}`,
        });
    });

module.exports = {
    uploadRouter,
};
