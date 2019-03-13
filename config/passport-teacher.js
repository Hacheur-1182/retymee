var LocalStrategy2 = require('passport-local').Strategy;
var User = require('../models/teacher');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.use('local-teacher', new LocalStrategy2({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'teacher_email',
        passwordField : 'teacher_password'
    },

    function (email, password, done) {

        User.findOne({email: email}, function (err, user) {
            if (err)
                console.log(err);

            if (!user) {
                return done(null, false, {message: 'No user found!'});
            }

            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err)
                    console.log(err);

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password.'});
                }
            });
        });

    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}


