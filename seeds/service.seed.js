require('dotenv').config();

const express = require('express');
const router  = express.Router();

const mongoose = require('mongoose');

const data = require('./service.json');
const Service = require('../models/Service.model');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    return self.connection.dropDatabase();
  })
  .then(theNewServiceCreated => {
    return Service.insertMany(data)     
  })  
  .catch(error => {
    console.error('Error connecting to the database', error);
  });


  module.exports = router;