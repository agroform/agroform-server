const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehiculeSchema = new Schema(
  {
    vehicule: String,
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

const Vehicule = mongoose.model("Vehicule", vehiculeSchema);

module.exports = Vehicule;
