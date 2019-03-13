var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
//Get Teachers Model
var Teacher = require('../models/teacher');


var teachersSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
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
    matiere:{
        type: String
    },
    image:{
        type: String
    },
    description:{
        type: String
    },
    courses: [{
        course_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        title:{
            type: String
        },
        description:{
            type: String
        },
        image:{
            type: String
        },
        session:{
            type: String
        },
        timetable:{
            type: String
        }
    }]
})

var Teacher = module.exports = mongoose.model('Teacher', teachersSchema);


//Save student
module.exports.saveTeacher = function (newTeacher, cb) {
    bcrypt.hash(newTeacher.password, 10, function (err, hash) {
        if (err) throw err;
        //set hash
        newTeacher.password = hash;
        console.log("Teacher is being saved");
        newTeacher.save()
        cb;
    })
}


