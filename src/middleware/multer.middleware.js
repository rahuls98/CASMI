const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        console.log("multer.diskStorage", file);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

module.exports = multer({ storage });
