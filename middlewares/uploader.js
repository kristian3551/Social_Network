const multer = require('multer');
const { staticDirname } = require('../config');

const filename = (req, file, next) => {
    const lastDotIndex =  file.originalname.lastIndexOf('.');
    const fileExtension = file.originalname.substring(lastDotIndex);

    next(null, `img-${Date.now()}${fileExtension}`);
};

const destination = (req, file, next) => {
    next(null, `${__dirname}/../${staticDirname}`);
};

module.exports = multer({
    storage: multer.diskStorage({ 
        destination, filename
    })
})
