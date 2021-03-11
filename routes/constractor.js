const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

// const User = require('../models/User.model');
const Quote = require('../models/Quote.model');
const Service = require('../models/Service.model');
const Offer = require('../models/Offer.model');
const Vehicule = require('../models/Vehicule.model');
const { Contractor, User } = require('../models/User.model');

const {
    ensureObjIdValid,
    ensureLoggedInAsContractor
  } = require('../utils/middleware');



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
router.get('/quotes/:id',ensureObjIdValid, (req, res, next) => {

    Quote.findById(req.params.id)
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
    Offer.find({'offerOwner':req.user._id})
        .select('_id')
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
        vehicule: req.body.vehicule,
        measureHa: req.body.measureHa,
        pricePerHa: req.body.pricePerHa,
        measureHour: req.body.measureHour,
        expecTime: req.body.expecTime,
        pricePerHour: req.body.pricePerHour,
        timer: req.body.timer,
        offerOwner: req.user._id
    })
    .then( newOffer => {
        res.json(newOffer);
    })
    .catch( err => {
        res.status(500).json(err);
    });
});

///// Retrieve details of a specific OFFER /////
router.get('/offers/:id',ensureObjIdValid, (req, res, next) => {

    Offer.findById(req.params.id)
        .then( offer => {
            res.json(offer);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Update a OFFER /////
router.put('/offers/:id', ensureObjIdValid, (req, res, next) => {

    Offer.findByIdAndUpdate(req.params.id, req.body)
        .then( () => {
            res.json({ message: `Offer with ${req.params.offerId} is updated successfully.` });
        })
        .catch( err => {
            res.status(500).send(err);
        });
});

/// Delete a OFFER /////
router.delete('/offers/:id', ensureObjIdValid, (req, res, next) => {

    Offer.findByIdAndRemove(req.params.id)
        .then( () => {
            res.json({ message: `Offer with ${req.params.id} is removed successfully.` });
        })
        .catch( err => {
            res.status(500).send(err);
        });
});
/// Get a List of all default VERHICULES /////
router.get('/vehiculeslist', (req, res, next) => {
    Vehicule.find()
        .then( allVehicules => {
            res.json( allVehicules );
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

///// Retrieve all vehicule of a contractor /////
router.get('/vehicules',ensureLoggedInAsContractor , (req, res, next) => {

    Contractor.findById(req.user._id)
        .then( allvehicules => {
            res.json(allvehicules.vehicules);
        })
        .populate('vehicules')
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Add a vehiculeS /////
router.post("/vehicules", ensureLoggedInAsContractor, (req, res, next) => {

    Contractor.findByIdAndUpdate( {_id: req.user._id},
        { $push: { 'vehicules': req.body.vehiculeId} },
        { new : true },
        )
        .populate('vehicules')
        .then( addvehicule => {
            res.json(addvehicule);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Delete a vehicule /////
router.put('/vehicules/:id', ensureLoggedInAsContractor, (req, res, next) => {

    Contractor.findByIdAndUpdate({_id: req.user._id},
        { $pull:{ vehicules: req.params.id  } },
        )
    .then( () => {
        res.json({ message: `vehicule with ${req.params.id} is removed successfully.` });
    })
    .catch( err => {
        res.status(500).json(err);
    });
});

///// Retrieve all SERVICES of a contractor /////
router.get('/services', ensureLoggedInAsContractor, (req, res, next) => {

    Contractor.findById(req.user._id)
        .select('services')
        .populate('services')
        .then( allServices => {
            res.json(allServices);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Get a List of all SERVICES /////
router.get('/servicelist', (req, res, next) => {
    Service.find()
        .then( allServices => {
            res.json( allServices );
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Add a SERVICES /////
router.post("/services", ensureLoggedInAsContractor, (req, res, next) => {
    Contractor.findByIdAndUpdate( req.user._id,
        { $push: { 'services': req.body.id} },
        { new : true},
        )
        .populate('services')
        .then( serviceList => {
            res.json(serviceList)
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Delete a SERVICE ////
router.put('/services/:id', ensureLoggedInAsContractor, (req, res, next) => {
    Contractor.findByIdAndUpdate( req.user._id,
        { $pull: { 'services': req.params.id } },
        )
    .then( () => {
        res.json({ message: `Service with ${req.params.id} is removed successfully.` });
    })
    .catch( err => {
        res.status(500).json(err);
    });
});

module.exports = router;