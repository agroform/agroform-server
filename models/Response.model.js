const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema(
  {
    date: Date,
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle'
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
      ref: "Contractor" 
    }
  },
  {
    timestamps: true
  }
);

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
