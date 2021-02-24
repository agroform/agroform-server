require('dotenv').config();

const mongoose = require('mongoose');
const {Farmer, Contractor} = require('./models/User.model');
const vehicule = require('./models/vehicule.model');
const Service = require('./models/Service.model');

const vehiculeData = require('./data/vehicule.json');
const serviceData = require('./data/service.json');

const MONGODB_URI = process.env.MONGODB_URI;

const farmerSeed = {
  username: "Bob",
  email: "bob@agrofrom.com",
  passwordHash: "$2a$10$3I6hXo5rUvXA1u83WpTjWOGjDrPemv/7k3FbWmIdfS7LiPMWWJIDK",
  firstName: "Bob",
  lastName: "Farmer",
  country: "France",
  city: "Rennes",
  street: "Rue de la Republique",
  userImg: "image url",
  logo: "logo url",
};

const contractorSeed = {
  username: "Alice",
  email: "alice@agroform.com",
  passwordHash: "$2a$10$3I6hXo5rUvXA1u83WpTjWOGjDrPemv/7k3FbWmIdfS7LiPMWWJIDK",
  firstName: "Alice",
  lastName: "Contractor",
  country: "France",
  city: "Rennes",
  street: "Rue de la Republique",
  userImg: "image url",
  logo: "logo url",
  service: [],
  vehicules: [],
};

mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
  useUnifiedTopology: true
  })
  .then(async () => {
    await Promise.all([
      vehicule.insertMany(vehiculeData),
      Service.insertMany(serviceData),
      Farmer.create(farmerSeed),
      Contractor.create(contractorSeed)
    ]);
  })
  .then(() => console.log("data base seeded with vehicules, services and 2 dummy users"))
  .then(() => mongoose.connection.close())
  .catch(err => console.log(err));


