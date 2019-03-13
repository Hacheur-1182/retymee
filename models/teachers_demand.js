var mongoose = require('mongoose');

//Page Schema

var teachersDemandSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username:{
        type: String
    },
    email:{
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
    matiere:{
        type: String
    },
    image:{
        type: String
    },
    about:{
        type: String
    }
})

var TeacherDemand = module.exports = mongoose.model('TeacherDemand', teachersDemandSchema);
