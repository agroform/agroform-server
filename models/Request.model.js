const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  service: [], //<- here place an String out of an .json-Object
  field: { type: Schema.Types.ObjectId, ref: 'Farmer' },
  date: Date,
  transport: false,
  destination: String,
  description: String,
  reqOwner: { type: Schema.Types.ObjectId, ref: "Farmer" },
  response: [
    {
      responseDate: Date,
      vehicle: String,
      measureHa: true,
      pricePerHa: Number,
      measureHour: false,
      expecTime: Number,
      pricePerHour: Number,
      timer: Number,
    },
  ],
  timestamps: true,
});

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
