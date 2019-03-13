var mongoose = require('mongoose')

//subscriber Schema
var subscriberSchema = mongoose.Schema({
	id_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    classroom: {
        type: String,
    },
    date: {
        type: String
    },
    remaining_test_days: {
        type: String
    },
    amount_paid: {
        type: String
    },
    ispaid:{
        type: Boolean
    },
    course_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    course_title : {
        type: String
    },
    course_cost: {
        type: String
    },
    course_description: {
        type: String
    },
    course_image: {
        type: String
    },
    course_timetable: {
        type: String
    },
    have_access : {
        type: Boolean
    }
})

var Subscriber = module.exports = mongoose.model('Subscriber', subscriberSchema)
