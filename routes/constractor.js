const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

// const User = require('../models/User.model');
const Quote = require('../models/Quote.model');
const Offer = require('../models/Offer.model');
const Vehicle = require('../models/Vehicle.model');
const { User } = require('../models/User.model');


///// Retrieve list of QUOTES /////
router.get("/quotes", (req, res, next) => {
    Quote.find()
        .populate('offers')
        .then( allQuotes => {
            res.json( allQuotes );
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

///// Retrieve details of a specific QUOTE /////
router.get('/quotes/:quotesId', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.quotesId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Quote.findById(req.params.quotesId)
        .populate('offer')
        .then( quote => {
            res.json(quote);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

///// Retrieve all OFFERS by contractor /////
router.get('/offers', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Offer.find({offerOwner: req.params.userId})
        .then( allOffers => {
            res.json(allOffers);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

///// Create new OFFERS /////
router.post("/offers", (req, res, next) => {
    Offer.create({
        date: req.body.date,
        vehicle: req.body.vehicle,
        measureHa: req.body.measureHa,
        pricePerHa: req.body.pricePerHa,
        measureHour: req.body.measureHour,
        expecTime: req.body.expecTime,
        pricePerHour: req.body.pricePerHour,
        timer: req.body.timer,
        owner: req.user._id
    })
    .then( newOffer => {
        res.json(newOffer);
    })
    .catch( err => {
        res.status(500).json(err);
    });
});

///// Retrieve details of a specific OFFER /////
router.get('/offers/:offerId', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.offerId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Offer.findById(req.params.offerId)
        .then( offer => {
            res.json(offer);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Update a OFFER /////
router.put('/offers/:offerId', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.offerId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Offer.findByIdAndUpdate(req.params.offerId, req.body)
        .then( () => {
            res.json({ message: `Offer with ${req.params.offerId} is updated successfully.` });
        })
        .catch( err => {
            res.status(500).send(err);
        });
});

/// Delete a OFFER /////
router.delete('/offers/:offerId', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.offerId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Offer.findByIdAndRemove(req.params.offerId)
        .then( () => {
            res.json({ message: `Offer with ${req.params.offerId} is removed successfully.` });
        })
        .catch( err => {
            res.status(500).send(err);
        });
});

///// Retrieve all VEHICLE of a contractor /////
router.get('/vehicles', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    User.find(req.params.userId)
        .then( allVehicles => {
            res.json(allVehicles);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Add a VEHICLES /////
router.put("/vehicles", (req, res, next) => {
    console.log(req.user._id)
    User.findByIdAndUpdate( req.user._id,
        { $push: { vehicles: req.body.vehicleId} }
        )
        .then( response => {
            res.json(response)
        })
        .catch( err => {
            res.status(500).json(err);
        });
});




module.exports = router;