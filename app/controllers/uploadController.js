const multer = require('multer');
const { IMAGE_DATABASE_URL,
    FILE_SIZE_MAX,
    ALLOWED_FILE_EXTENSIONS, } = require('../utils/constants');
const uuid = require(`uuid`);
const { sendResponse, } = require('../helpers/responder');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(undefined, IMAGE_DATABASE_URL);
    },
    filename: function(req, file, cb) {
        const fileExtension = file.originalname.
            slice(file.originalname.lastIndexOf(`.`));

        const fileName = `${uuid.v4()}${fileExtension}`;

        cb(undefined, fileName);
    },
});

const upload = multer({
    storage,

    fileFilter: (req, file, cb) => {
        const fileExtension = file.originalname.
            slice(file.originalname.lastIndexOf(`.`));

        if (! ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
            cb(null, false);

            sendResponse(req.res, {
                statusCode: 400,
                message: `File type ${fileExtension} not allowed`,
            });

            return;
        }

        cb(null, true);
    },

    limits: {
        fileSize: FILE_SIZE_MAX,
    },
});

/** Generates a controller that uploads a file in local database
 * @param { String } fieldName Name of field that contains the file to upload
 * @return { Function } Multer middleware function
 */
function uploadImageControllerGenerator(fieldName) {
    return upload.single(fieldName);
}

module.exports = {
    uploadImageControllerGenerator,
};
