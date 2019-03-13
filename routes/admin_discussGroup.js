
const express = require('express');
var router = express.Router();

//Get Course Model
var Course = require('../models/course');
var DiscussGroup = require('../models/discussGroup');


//add discuss group
router.post('/verify-group', (req, res) =>{
	
	var course_id = req.body.groupname;

	DiscussGroup.findOne({course_id : course_id}, function(err, group){
		if(err) return console.log(err)

		if(group){
			res.send('0')
		}else{
			res.send('1')
		}
	})
})

//add discuss group
router.post('/add-group', (req, res) =>{
	
	var course_id = req.body.groupname;
	var description = req.body.description;

	Course.findById(course_id, function(err, course){
		if(err) return console.log(err)
		discussGroup = new DiscussGroup({
			groupname : course.title,
			course_id : course._id,
			course_name : course.title,
			description : description
		})

		discussGroup.save(function(err, group){
			if(err) return console.log(err)
			console.log("Group added")
		})

		req.flash('success', 'Discuss Group added');
		res.redirect('/admin/home')

	})
})


//Exports 
module.exports = router;