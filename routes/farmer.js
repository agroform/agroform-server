const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');

const { User, Farmer } = require('../models/User.model.js');
const Field = require('../models/Field.model.js');

router.get('/fields', (req, res, next) => {
  const farmerId = req.user._id;
  Farmer
    .findById(farmerId)
    .populate('fields')
    .then(farmer => {
      res.json(farmer.fields);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post('/fields', (req, res, next) => {
  const farmerId = req.user._id;

  const {
    fieldName, 
    polygon, 
    location, 
    size
  } = req.body;

  Field.create({
    fieldName, 
    polygon, 
    location, 
    size
  })
  .then(newField => {
    Farmer
      .findByIdAndUpdate(farmerId, {
        $push: {fields: newField._id}
      })
      .then(() => {
        res.json(newField)
      })
      .catch(err => {
        res.json(err)
      });
  })
  .catch(err => {
    res.json(err);
  })
});

router.get('/fields/:fieldId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.fieldId)) {
    res.status(400).json({ message: 'Specified field does not exist' });
    return;
  }

  Field.findById(req.params.fieldId)
    .populate('serviceHistory.service')
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;