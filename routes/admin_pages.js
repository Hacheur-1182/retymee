const express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var resizeImg = require('resize-img')

//Get Course Model
var Course = require('../models/course');

//Get Students Model
var Student = require('../models/student');

//Get Teachers Model
var Teacher = require('../models/teacher');

//Get TeacherDemand Model
var TeacherDemand = require('../models/teachers_demand');

//Get Teachers Model
var Subscriber = require('../models/subscriber');


//Get admin login
router.get('', (req, res) =>{
    res.render("./admin/login", {
        title : "Admin Panel Login"
    });
})

//Get admin index
router.get('/home', ensureAuthenticated, (req, res) =>{
    var N_STUD, N_TEACH, N_COURS; 
    Course.countDocuments(function(err, c){
        if(c) N_COURS = c;
    });
    Teacher.countDocuments(function(err, c){
        if(c) N_TEACH = c;  
    });
    Student.countDocuments(function(err, c){
        if(c) N_STUD = c; 
    });
    type = "";
    title = "";
    session = "";
    duration = "";
    startdate = "";
    enddate = "";
    cost = "";
    category = "";
    description = "";
    
    Course.find(function(err, courses){
        if(err) return console.log(err)

        TeacherDemand.find(function(err, teachersDemand){
            if(err) return console.log(err)

            res.render("./admin/index", {
                title : "Admin Panel",
                teachersDemand: teachersDemand,
                N_STUD: N_STUD,
                N_TEACH: N_TEACH,
                N_COURS: N_COURS,
                courses : courses,
                type : type,
                title: title,
                session: session,
                duration : duration,
                startdate: startdate,
                enddate: enddate,
                cost: cost,
                category: category,
                description: description,
                firstname : "",
                lastname : "",
                username : "",
                email : "",
                tel : "",
                address : "", 
                matiere : "",
                description : ""
            });
        })
    })
})

//Get admin payment registration
router.get('/payment/register-payment', ensureAuthenticated, (req, res) =>{
    Subscriber.find({ispaid: false}, function(err, subscribers){
        if(err) return console.log(err)

        Course.find(function(err, courses){
            if(err) return console.log(err)

            res.render("./admin/payment", {
                title : "Payment Registration",
                subscribers: subscribers,
                courses: courses
            });
        })
    }).limit(10)
})

//Get student list for one course 
router.get('/payment/course/:id', ensureAuthenticated, (req, res) =>{
    var course_id = req.params.id;

    Subscriber.find({course_id: course_id}, function(err, subscribers){
        if(err) return console.log(err)

        Course.find(function(err, courses){
            if(err) return console.log(err)

            res.render("./admin/payment", {
                title : "Payment Resgistration",
                subscribers: subscribers,
                courses: courses
            });
        })
    })
})

//Validate  payment 
router.get('/payment/register/:id/:courseid', ensureAuthenticated, (req, res) =>{
    var user_id = req.params.id;
    var course_id = req.params.courseid;

    //update
    var query = {id_user:  user_id, course_id: course_id};
    Subscriber.updateOne(
        query,
        {$set: {ispaid: true, have_access : true}},
        function(err, message){
            if(err) return console.log(err)

            req.flash('success', "Successfully Registered")
            res.redirect('/admin/payment/register-payment')
        }
    );
})


//Get admin profile
router.get('/profile', ensureAuthenticated, (req, res) =>{
    res.render("./admin/profile", {
        title : "My Profile"
    });
})

//Get admin settings
router.get('settings', ensureAuthenticated, (req, res) =>{
    res.render("./admin/settings", {
        title : "Settings"
    });
})

//accesss control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user.role == "admin"){
        return next()
    }else{
        req.flash('danger', 'Please login')
        res.redirect('/admin')
    }
}

//Exports 
module.exports = router;