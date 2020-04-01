var mongoose = require('mongoose')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs')

//Get Course Model
var Course = require('../models/course');
//Get Student Model
var Student = require('../models/student');

//Student Schema

var studentSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    tel:{
        type: String
    },
    address:{
        type: String
    },
    ville:{
        type: String
    },
    bornat:{
        type: String
    },
    sex:{
        type: String
    },
    isStudent:{
        type: Boolean
    },
    status:{
        type: String
    },
    image:{
        type: String
    },
    about:{
        type: String
    },
    accountActivated:{
        type: Boolean,
        default: false
    },
    courses : [{
        course_id : {
            type: mongoose.Schema.Types.ObjectId
        },
        access : {
            type: Boolean
        }
    }]
})

var Student = module.exports = mongoose.model('Student', studentSchema)

module.exports.getStudentByUsername = function(username, callback){
    var query = {username : username};
    Student.findOne(query, callback)
}

//Fetch All classes
module.exports.getStudentById = function(id, cb){
    Student.findById(id, cb)
}


//Save student
module.exports.saveStudent = function(newStudent, cb){
    bcrypt.hash(newStudent.password, 10, function(err, hash){
        if (err) throw err;
        //set hash
        newStudent.password = hash;
        console.log("Student is being saved");
        //async.parallel([newStudent.save, newStudent.save], cb)
        newStudent.save()
        .then(user => {
            cb(user);
        })
    })
}



