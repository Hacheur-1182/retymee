var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
})

var Admin = module.exports = mongoose.model('Admin', adminSchema);
