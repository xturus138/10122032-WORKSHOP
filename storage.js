const multer = require('multer');

const storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null,Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage : storage,
    limits : {fileSize : 1024*1024}
})

module.exports = upload;