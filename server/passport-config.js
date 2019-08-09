var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

passport.use('local',new LocalStrategy({
    usernameField:'username',
    passwordField:'password'
},
    function (username, password, done) {
        
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            
            if (!user) {
               // console.log('Incorrect username.');
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.isValid(password)) {
              //  console.log('Incorrect password.');
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });