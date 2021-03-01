const { Router } = require('express');
const router = new Router();

const { User, Farmer } = require('../models/User.model.js');
const Field = require('../models/Field.model');
const Quote = require('../models/Quote.model');

const {
  ensureObjIdValid,
  ensureLoggedInAsFarmer
} = require('../utils/middleware');


router.get('/fields', (req, res, next) => {
  const farmerId = req.user._id;
  Field.find({owner: farmerId})
    .then(fields => {
      res.json(fields)
    })
    .catch(err => {
      res.json({
        message: "Something went wrong :("
      })
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
    size,
    owner: farmerId,
  })
    .then(newField => {
      res.json({
        message: "New field successfully added",
        newField: newField._id
      })
    })
    .catch(err => {
      res.json({
        message: "Something went wrong :("
      });
    })
});

router.get('/fields/:id', ensureObjIdValid, (req, res, next) => {
  Field.findById(req.params.id)
    .populate('serviceHistory.service')
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

router.put('/fields/:id', ensureObjIdValid, (req, res, next) => {
  Field.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json( {message: `Field ${req.body.fieldName} is successfully updated`} );
    })
    .catch(() => {
      res.json(err)
    });
})

router.delete('/fields/:id', ensureObjIdValid, (req, res, next) => {
  Field.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json( {message: `Field ${req.body.fieldName} is successfully deleted`} );
    })
    .catch(() => {
      res.json(err)
    });
})

router.get('/quotes?', (req, res, next) => {
  const fieldId = req.query.field;
  const farmerId = req.query.farmer;

  if (fieldId && farmerId) {
    res.json({ message: "the request is made to incorrect API endpoint" });
    return;
  }

  if (fieldId) {
    Quote.find({field: fieldId})
      .populate('service field quoteOwner offers')
      .then(quotes => {
        res.status(200).json(quotes);
      })
      .catch(err => {
        res.status(400).json({message: "Error occurred whilte retriving quotes"})
      });
      return;
  }

  if (farmerId) {
    Quote.find({quoteOwner: farmerId})
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(400).json({message: "Error occurred whilte retriving quotes"})
      });
      return;
  }
})

router.post('/quotes', ensureLoggedInAsFarmer, (req, res, next) => {
  Quote.create({
    service: req.body.service,
    field: req.body.field,
    date: req.body.date,
    transport: req.body.transport,
    destination: req.body.destination,
    quoteOwner: req.user._id,
  })
    .then(newQuote => {
      res.json({
        message: "New quote successfully added",
        newField: newQuote._id
      })
    })
    .catch(err => {
      res.json({
        message: "Something went wrong :("
      });
    })
})

router.put('/quotes/:id', ensureObjIdValid, (req, res, next) => {
  Quote.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.status(200).json({message: "Quote successfully updated"});
    })
    .catch(err => {
      res.status(400).json({message: `Error: ${err.message}`});
    })
})

router.delete('/quotes/:id', ensureObjIdValid, (req, res, next) => {
  Quote.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).json({message: "Quote successfully deleted"});
    })
    .catch(err => {
      res.status(400).json({message: `Error: ${err.message}`});
    })
})

module.exports = router;
