const { Router } = require('express');
const router = new Router();

const { User, Farmer } = require('../models/User.model.js');
const Field = require('../models/Field.model');
const Quote = require('../models/Quote.model');

const {
  ensureObjIdValid,
  ensureLoggedInAsFarmer
} = require('../utils/middleware');

router.get('/profile', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({message: 'Unauthorized. Please log in'});
    return;
  }
  res.status(200).json(req.user);
})

router.put('/profile', (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body)
    .then(() => {
      res.json({ message: `Your profile is updated successfully.` });
    })
    .catch(err => {
      res.status(400).json({message: `Error: ${err.message}`});
    })
})

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
      .populate('service field quoteOwner offers')
      .then(quotes => {
        res.status(200).json(quotes);
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
      res.status(200).json(newQuote);
    })
    .catch(err => {
      res.status(400).json(err);
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
