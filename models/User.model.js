const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
require('../models/Service.model.js');

const options = {
  discriminatorKey: 'kind'
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: String,
    firstName: String,
    lastName: String,
    country: String,
    city: String,
    street: String,
    userImg: String,
    logo: String,
  }, 
  {
    timestamps: true
  }, options
);

const User = mongoose.model('User', userSchema);


const farmerSchema = new mongoose.Schema(
  {
    fields: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Field'
      }
    ],
  }, options
);
const Farmer = User.discriminator('Farmer', farmerSchema);


const contractorSchema = new mongoose.Schema(
  {
    services: [{
      type: Schema.Types.ObjectId,
      ref: 'Service'
    }],
    vehicles: [{
      type: Schema.Types.ObjectId,
      ref: 'Vehicle'
    }]
  }, options
);
const Contractor = User.discriminator('Contractor', contractorSchema);


module.exports = { User, Farmer, Contractor };