const multer = require('multer');

/* file extensions output */
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

/* image size limitation */
const maxSize = 3 * 1280 * 1280;

/* set the storage location for files uploads, remove spaces from filename, add date into filename */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {//Crée un nom unique pour la nouvelle image
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

/* multer configured with storage constant */
module.exports = multer({storage: storage, limits: { fileSize: maxSize }}).single('file');
