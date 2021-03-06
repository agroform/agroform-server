const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require('./Offer.model.js');
require('./Service.model.js');
require('./Field.model.js');
require('./User.model.js');

const quoteSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service'
    },
    field: {
      type: Schema.Types.ObjectId,
      ref: 'Field'
    },
    date: Date,
    transport: {
      type: Boolean,
      default: false
    },
    destination: String,
    description: String,
    quoteOwner: {
      type: Schema.Types.ObjectId,
      ref: "Farmer"
    },
    offers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Offer"
      }
    ],
  },
  {
    timestamps: true
  }
);

const Quote = mongoose.model("Quote", quoteSchema);
module.exports = Quote;