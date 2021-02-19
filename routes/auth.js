const { Router } = require('express');
const router = new Router();

const passport   = require('passport');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const { User } = require('../models/User.model.js');

router.post('/register', (req, res, next) => {
  const { username, email, password, userType } = req.body;

  if (!username || !email || !password || !userType) {
      res
        .status(400)
        .json({
          message: "username, email and password are mandatory for registration"
        });
      return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
      res
        .status(400)
        .json({
          message: "Password should have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter"
        });
      return;
  }

  const salt = bcryptjs.genSaltSync(saltRounds);
  const hashedPassword = bcryptjs.hashSync(password, salt);

  const newUser = new User({
    username,
    email,
    passwordHash: hashedPassword,
    __t: userType,
  });
 
  newUser.save(err => {
    console.log(err)
    if (err) {
      res
        .status(500)
        .json({
          message: "Saving user to database went wrong"
        });
      return;
    }

    req.login(newUser, (err) => {
      if (err) {
        res
          .status(500)
          .json({
            message: "Login after registration went bad"
          });
        return;
      }

      res.status(200).json(newUser);
    })

  });

});



module.exports = router;