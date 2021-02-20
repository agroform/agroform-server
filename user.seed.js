require('dotenv').config();

const mongoose = require('mongoose');
const {Farmer, Contractor} = require('./models/User.model');
const Request = require('./models/Service.model');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// const farmerA = {
//   username: "farmer A",
//   email: "test@test.com",
//   passwordHash: "cdindna;lkcidalkn",
//   firstName: "test",
//   lastName: "farmer",
//   country: "France",
//   city: "Rennes",
//   street: "Rue de la Republique",
//   userImg: "image url",
//   logo: "logo url",
//   fields: [
//     {
//       fieldName: "field 1",
//       polygon: "poloygon url",
//       location: "somewhere",
//       size: 100
//     }
//   ]
// }

// Farmer.create(farmerA)
//   .then((data) => {
//     console.log(data)
//   })
//   .catch(err => {
//     console.log(err)
//   })

// const contractorB = {
//   username: "contractor B",
//   email: "test3@test.com",
//   passwordHash: "cdindna;lkcidalkn",
//   firstName: "test3",
//   lastName: "contractor",
//   country: "France",
//   city: "Rennes",
//   street: "Rue de la Republique",
//   userImg: "image url",
//   logo: "logo url",
//   service: [],
//   vehicles: [],
// }

// Contractor.create(contractorB)
//   .then((data) => {
//     console.log(data)
//   })
//   .catch(err => {
//     console.log(err)
//   })


// const requestA = {
//   date: Date.now(),
//   transport: true,
//   destination: "some road",
//   description: "somewhere",
//   reqOwner: "602d96c935b505cc9daed44b",
// }

// Request.create(requestA)
//   .then((data) => {
//     console.log(data)
//   })
//   .catch(err => {
//     console.log(err)
//   })
