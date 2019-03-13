
const express = require('express');
var router = express.Router();

//Get Course Model
var Student = require('../models/student');


//Get students
router.get('/', (req, res) =>{
	Student.find(function(err, students){
		if(err) return console.log(err)

		res.render("./admin/students", {
	        title : "Students Management",
	        students : students
	    });
	})
})

//Delete  teachers 
router.get('/delete/:id', (req, res) =>{
    var id = req.params.id;

    var myquery = { _id: id };
    Student.deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log("One Student deleted");
    });
    req.flash('success', 'Student Deleted');
    res.redirect('/admin/home')
})

//Get  teachers details
router.get('/info/:id', (req, res) =>{
    var id = req.params.id;

    Student.findById(id, function(err, student){
        if(err) return console.log(err)

        res.render("./admin/student_details", {
            title : "Teachers Details",
            student : student
        });
    })
})

//Exports 
module.exports = router;