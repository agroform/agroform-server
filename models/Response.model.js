const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  responseDate: Date,
  vehicle: String,
  measureHa: true,
  pricePerHa: Number,
  measureHour: false,
  expecTime: Number,
  pricePerHour: Number,
  timer: Number,
  resOwner: { type: Schema.Types.ObjectId, ref: "Contractor" },
  timestamps: true,
});

const Response = mongoose.model("Response", responseSchema);
module.exports = Response;
