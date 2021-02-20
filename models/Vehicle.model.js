const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
  {
    vehicle: String,
    type: String,
    brand: String,
    weight: Number, //kg
    enginePower: Number, //kW
    maxSpeed: Number,// km/h
    fuelCap: Number, // l
    cropCap: Number, // l
    image: String
  },
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
