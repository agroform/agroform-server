const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    service: String,
    mainService: String,
    icon: String
  },
  {
    timestamps: true
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
