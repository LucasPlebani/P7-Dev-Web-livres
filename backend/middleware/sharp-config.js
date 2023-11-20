// sharp-config.js
const sharp = require('sharp');
const fs = require('fs');

const ResizeConvertImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  sharp(req.file.path)
    .resize(250, 400) 
    .toFormat('webp')
    .toFile('images/' + req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp'))
    .then(() => {
      req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');

      
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting original file:', err);
        }
        next();
      });
    })
    .catch((error) => {
      console.error('Image processing error:', error);
      next();
    });
};

module.exports = ResizeConvertImage;