const express = require('express');
const router  = express.Router();

const { uploadUserImg } = require('../configs/cloudinary.config');

router.post('/upload', uploadUserImg.single('image'), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded"));
    return;
  }
  res.json({
    imageUrl: req.file.path
  });
})

module.exports = router;