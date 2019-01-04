const multer = require("multer");
const fs = require("fs");
const tempFilePath = __dirname + '/tmp'

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (!fs.existsSync(tempFilePath)) {
            fs.mkdirSync(tempFilePath);
        }
        cb(null, tempFilePath)
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`)
    }
})

const upload = multer({ storage: storage }).single('file');

module.exports = {
    upload
}
