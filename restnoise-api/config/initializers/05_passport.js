var passport = require('passport')
  ,BasicStrategy = require('passport-http').BasicStrategy
  ,User = require('../../app/models/user.js')
  ,config = require("config")
  ,winston = require("winston");

var validUsers = config.get("passport.authusers");

module.exports = function() {
    winston.info("Initializing Passport");
    winston.info("Passport settings:",config.get("passport"));

  this.use(passport.initialize());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new BasicStrategy(
    function(username, password, done) {
      return done( null, validUsers[username] == password );
      /*
      }
      User.findOne({ username: username }, function(err, user) {
        return done( null, true );
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.validPassword(password)) { return done(null, false); }
        return done(null, user);
      });
      */
    }
  ));

    winston.info("Initialized Passport");

  //this.get('*', passport.authenticate('basic', { session : false }) );
  //this.all( passport.authenticate('basic', { session : false }) );
}
