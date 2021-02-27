const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require('./Vehicule.model.js');
require('./User.model.js');

const offerSchema = new Schema(
  {
    date: Date,
    vehicule: {
      type: Schema.Types.ObjectId,
      ref: 'vehicule'
    },
    measureHa: {
      type: Boolean,
      default: true
    },
    pricePerHa: Number,
    measureHour: {
      type: Boolean,
      default: false
    },
    expecTime: Number,
    pricePerHour: Number,
    timer: Number,
    offerOwner: {
      type: Schema.Types.ObjectId,
      ref: 'Contractor'
    },
    status: {
      type: String,
      enum: ['pending', 'validated', 'declined'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
