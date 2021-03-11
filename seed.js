require('dotenv').config();

const mongoose = require('mongoose');
const Vehicule = require('./models/Vehicule.model');
const Service = require('./models/Service.model');

const vehiculeData = require('./data/vehicule.json');
const serviceData = require('./data/service.json');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    await Promise.all([
      Vehicule.insertMany(vehiculeData),
      Service.insertMany(serviceData),
    ]);
  })
  .then(() => console.log("data base seeded with vehicules, services and 2 dummy users"))
  .then(() => mongoose.connection.close())
  .catch(err => console.log(err));


