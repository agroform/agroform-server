const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Successfully connected to database"))
  .catch(error => {
    console.error("An error ocurred trying to connect to the database", error);
    process.exit(1);
  });