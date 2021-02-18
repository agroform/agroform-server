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
  responses: [{type: Schema.Types.ObjectId, ref: "Response"}],
  timestamps: true,
});

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
