const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storageUser = new CloudinaryStorage({
  cloudinary,
  params: {
      folder: 'agrofrom_users',
  },
  allowedFormats: ['jpg', 'jpeg', 'png'],
  filename: function (req, res, cb) {
    cb(null, res.originalname);
  }
});

const uploadUserImg = multer({ storage: storageUser });

module.exports = { uploadUserImg };