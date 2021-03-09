const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

// const User = require('../models/User.model');
const Quote = require('../models/Quote.model');
const Offer = require('../models/Offer.model');
const { Contractor, User } = require('../models/User.model');

const {
    ensureObjIdValid,
    ensureLoggedInAsContractor
  } = require('../utils/middleware');


///// Retrieve list of QUOTES /////
router.get("/quotes/all", (req, res, next) => {
    Quote.find()
        .populate('service field quoteOwner')
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
        .populate('field service offers')
        .populate({
            path: 'offers',
            populate: {
                path: 'offerOwner',
                model: 'Contractor'
            }
        })
        .populate({
            path: 'offers',
            populate: {
                path: 'vehicule',
                model: 'Vehicule'
            }
        })
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
        .populate('vehicule')
        .then( allOffers => {
            res.json(allOffers);
        })
        .catch( err => {
            console.log(err);
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
        //timer: req.body.timer,
        offerOwner: req.user._id
    })
    .then( newOffer => {
        Quote.findByIdAndUpdate({_id: req.body.quoteId},
            { $push:{ offers: newOffer._id } },
        )
            .then(() => res.json(newOffer))
            .catch(err => console.log(err));
    })
    .catch( err => {
        res.status(500).json(err);
    });
});

///// Retrieve details of a specific OFFER /////
router.get('/offers/:id',ensureObjIdValid, (req, res, next) => {

    Offer.findById(req.params.id)
        .populate('vehicule')
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
            res.json({ message: `Offer is updated successfully.` });
        })
        .catch( err => {
            res.status(500).send(err);
        });
});

/// Delete a OFFER /////
router.post('/offers/:id', ensureObjIdValid, (req, res, next) => {

    Offer.findByIdAndRemove(req.params.id)
        .then( () => {
            console.log(req.body.quoteId);
            Quote.findByIdAndUpdate(req.body.quoteId, {$pull: { offers: req.params.id}})
                .then(() => {
                    console.log(req.params.id);
                    res.json({ message: `Offer with ${req.params.id} is removed successfully.` });
                })
                .catch(err => console.log(err));
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
router.get('/vehicules', ensureLoggedInAsContractor, (req, res, next) => {

    Contractor.findById(req.user._id)
        .populate('vehicules')
        .then( contractorData => {
            res.json(contractorData.vehicules);
        })
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
        .then( addvehicule => {
            res.json(addvehicule);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Delete a vehicule /////
router.put('/vehicules/:id', (req, res, next) => {
    Contractor.findByIdAndUpdate(req.user._id,
        { $pull:{ vehicules: req.body.deletedVehicules} },
        )
    .then( () => {
        res.json({ message: `Vehicules with ${req.params.id} is removed successfully.` });
    })
    .catch( err => {
        res.status(500).json(err);
    });
 });

/// Get a List of all SERVICES /////
router.get("/servicelist", (req, res, next) => {
    Service.find()
        .then( allServices => {
            res.json( allServices );
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

///// Retrieve all SERVICES of a contractor /////
router.get('/services', ensureLoggedInAsContractor, (req, res, next) => {

    Contractor.findById(req.user._id)
        .select('services')
        .then( allServices => {
            res.json(allServices);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Add a SERVICES /////
router.post("/services", ensureLoggedInAsContractor, (req, res, next) => {

    Contractor.findByIdAndUpdate( {_id: req.user._id},
        { $push: { 'services': req.body.id} },
        { new : true},
        )
        .then( addservice => {
            res.json(addservice)
        })
        .catch( err => {
            res.status(500).json(err);
        });
});

/// Delete a SERVICE ////
router.put('/services/:id', (req, res, next) => {
    Contractor.findByIdAndUpdate(req.user._id,
        { $pull:{ services: req.body.deletedService } },
        )
    .then( () => {
        res.json({ message: `Service with ${req.params.id} is removed successfully.` });
    })
    .catch( err => {
        res.status(500).json(err);
    });
 });

module.exports = router;