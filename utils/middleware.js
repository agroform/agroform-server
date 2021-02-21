const mongoose = require('mongoose');
const { Farmer } = require('../models/User.model.js');

function ensureObjIdValid(req, res, next) {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  } else {
    res.status(400).json({ message: 'Specified field does not exist' });
    return;
  }
}

function ensureLoggedInAsFarmer(req, res, next) {
  if (Farmer.findById(req.user._id)) {
    return next();
  } else {
    res.status(400).json({ message: 'Unauthorized. Only loggedin farmers can execute this operation' })
  }
}

module.exports = { ensureObjIdValid, ensureLoggedInAsFarmer };