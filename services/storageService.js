
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.csv')
    }
})


const storeImage = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = file.mimetype;
        if (ext !== 'text/csv') {
            return callback(new Error(`Only CSV's are allowed`))
        }
        callback(null, true)
    },
    limits: { fileSize: parseInt(process.env.MULTER_FILE_SIZE) || 6097152 }
})

module.exports.storeImage = storeImage;