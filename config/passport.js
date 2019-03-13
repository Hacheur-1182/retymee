var LocalStrategy = require('passport-local').Strategy;
var Student = require('../models/student');
var Teacher = require('../models/teacher');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.use('local-student', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'login_email',
        passwordField : 'login_password'
    },

    function (email, password, done) {

        Student.findOne({email: email}, function (err, student) {
            if (err)
                console.log(err);

            if (!student) {
                return done(null, false, {message: 'No user found!'});
            }

            bcrypt.compare(password, student.password, function (err, isMatch) {
                if (err)
                    console.log(err);

                if (isMatch) {
                    return done(null, student);
                } else {
                    return done(null, false, {message: 'Wrong password.'});
                }
            });
        });

    }));


    passport.use('local-teacher', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'teacher_email',
        passwordField : 'teacher_password'
    },

    function (email, password, done) {

        Teacher.findOne({email: email}, function (err, teacher) {
            if (err)
                console.log(err);

            if (!teacher) {
                return done(null, false, {message: 'No user found!'});
            }

            bcrypt.compare(password, teacher.password, function (err, isMatch) {
                if (err)
                    console.log(err);

                if (isMatch) {
                    return done(null, teacher);
                } else {
                    return done(null, false, {message: 'Wrong password.'});
                }
            });
        });

    }));

    passport.serializeUser(function (user, done) {
        console.log(user.username+ "logged")
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Student.findById(id, function (err, user) {
            if(user){
                done(err, user);
            }
        });
        Teacher.findById(id, function (err, user) {
            if(user){
                done(err, user);
            }
        });
    });
}

