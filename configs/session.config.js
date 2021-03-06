const session = require('express-session');

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models/User.model.js');

module.exports = app => {

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: {
        sameSite: process.env.ENV === "production" ? 'none' : 'lax',
        maxAge: 60000000,
        secure: process.env.ENV === "production",
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      }),
      resave: true,
      saveUninitialized: false, // <== false if you don't want to save empty session object to the store
      ttl: 60 * 60 * 24 * 30 // 60 sec * 60min * 24h * 30day
    })
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        User.findOne({ email })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'Incorrect email' });
            }

            if (!bcryptjs.compareSync(password, user.passwordHash)) {
              return done(null, false, { message: 'Incorrect password' });
            }

            done(null, user);
          })
          .catch(err => done(err));
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());

};