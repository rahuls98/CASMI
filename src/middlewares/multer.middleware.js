const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const MAX_SIZE = process.env.UPLOAD_FILE_MAX_MB * 1000 * 1000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const singleFileUpload = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE },
}).single("file");

module.exports = { singleFileUpload };
