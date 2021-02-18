const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema(
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
    resOwner: { 
      type: Schema.Types.ObjectId, 
      ref: "Contractor" 
    }
  },
  {
    timestamps: true
  }
);

const Response = mongoose.model("Response", responseSchema);
module.exports = Response;
