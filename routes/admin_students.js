
const express = require('express');
var router = express.Router();

//Get Course Model
var Student = require('../models/student');

var Subscriber = require('../models/subscriber');


//Get students
router.get('/', ensureAuthenticated, (req, res) =>{
	Student.find(function(err, students){
		if(err) return console.log(err)

		res.render("./admin/students", {
	        title : "Students Management",
	        students : students
	    });
	})
})

//Delete  teachers 
router.get('/delete/:id', ensureAuthenticated, (req, res) =>{
    var id = req.params.id;

    var myquery = { _id: id };
    Subscriber.deleteMany({id_user: id}, (err, user) => {
        if (err) throw err;
        
        Student.deleteOne(myquery, function(err, obj) {
            if (err) throw err;

            req.flash('success', 'Student Deleted');
            res.redirect('/admin/home')
        });
    })
})

//Get  student details
router.get('/info/:id', ensureAuthenticated, (req, res) =>{
    var id = req.params.id;

    Student.findById(id, function(err, student){
        if(err) return console.log(err)

        res.render("./admin/student_details", {
            title : "Teachers Details",
            student : student
        });
    })
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