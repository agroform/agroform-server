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
    userImg: `https://avatars.dicebear.com/4.5/api/jdenticon/${username}.svg`
  });

  newUser.save(err => {
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

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
          res
            .status(500)
            .json({
              message: "Something went wrong authenticating user"
            });
          return;
      }

      if (!theUser) {
          res
            .status(401)
            .json(failureDetails);
          return;
      }

      req.login(theUser, (err) => {
          if (err) {
              res
                .status(500)
                .json({
                  message: "Session save went wrong"
                });
              return;
          }

          // We are now logged in (that's why we can also send req.user)
          res.status(200).json(theUser);
      });
  })
  (req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: "Successfully logged out" });
});


router.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});


router.get('/profile', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({message: 'Unauthorized. Please log in'});
    return;
  }
  res.status(200).json(req.user);
})

router.post('/profile', (req, res, next) => {
  let userInfos = JSON.parse(JSON.stringify(req.body));

  if (!userInfos.password) {
    User.findByIdAndUpdate(req.user._id, userInfos)
    .then(() => {
      res.json({ message: `Your profile is updated successfully.` });
    })
    .catch(err => {
      res.status(400).json({message: `Error: ${err.message}`});
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(userInfos.password)) {
      res
        .status(400)
        .json({
          message: "Can not update Password, it should have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter"
        });
      return;
  }

  const salt = bcryptjs.genSaltSync(saltRounds);
  const hashedPassword = bcryptjs.hashSync(userInfos.password, salt);
  delete userInfos.password;
  userInfos.passwordHash = hashedPassword;

  User.findByIdAndUpdate(req.user._id, userInfos)
    .then(() => {
      res.json({ message: `Your profile is updated successfully.` });
    })
    .catch(err => {
      res.status(400).json({message: `Error: ${err.message}`});
    })
})

module.exports = router;