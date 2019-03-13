const express = require('express');
var passport = require('passport')
const bcrypt = require('bcryptjs')
var  router = express.Router();
let moment = require("moment")

//Get Course Model
var Course = require('../models/course');
//Get Student Model
var Student = require('../models/student');
//Get Teacher Model
var Teacher = require('../models/teacher');
//Get Subcriber Model
var Subscriber = require('../models/subscriber');
//Get DiscussGroup Model
var DiscussGroup = require('../models/discussGroup');


//Sign up for students
router.post('/signup', (req, res, next) =>{
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('username', 'Username Field is required').notEmpty();
	req.checkBody('username', 'Username Field is required').isLength({ min: 6 });
	req.checkBody('email', 'Email Field is required').notEmpty() ;
	req.checkBody('email', 'Email must be a valid Email Address').isEmail() ;
	req.checkBody('password', 'Password Field is required').notEmpty() ;
	req.checkBody('password', 'Password Field is required').isLength({ min: 6 }) ;
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password) ;

	var errors = req.validationErrors();

	if(errors){

		res.send(errors[0].param);
		console.log(errors)

	}else {
		//Je vérifie si le username existe déja
		Student.findOne({username : username}, function(err, user){
			if(err) return console.log(err);
			if(user){
				res.send("username_exist");
			}else{
				//Je vérifie si l'email existe déja
				Student.findOne({email : email}, function(err, usermail){
					if(err) return console.log(err);
					if(usermail){
						res.send("email_exist");
					}else{
						//Je crée un nouvel étudiant
						newStudent = new Student({
							firstname: "",
							lastname: "",
							username: username,
							email : email,
							isStudent : true,
							password: password,
							image: "avatar.png"
						});
						Student.saveStudent(newStudent, function(err, student){
							if(err) return console.log(err);
							console.log("Student created");
						})
						// Passport Config
						require('../functions/registration_mail')(email);
						req.flash('success', 'You are registered, you have received confirmation Mail');
						res.send("1");
					}
				})
			}
		})
	}
});

//Login
router.post('/login', function(req, res, next){
	//require('../config/passport')(passport);
	//if(res.locals.student) res.redirect('/student/dashboard')
	passport.authenticate('local-student', {
        successRedirect: '/student/dashboard',
        failureRedirect: '/#',
        failureFlash: true
    })(req, res, next)
});

//Register to a course
router.get('/course/:id/register', ensureAuthenticatedForCourseRegistration, (req, res) =>{
	course_id = req.params.id;

	Course.findById(course_id, (err, course)=>{
		if(err) return console.log(err)

		Subscriber.findOne({id_user : req.user._id, course_id: course._id}, (err, subscriber)=>{
			if(err) return console.log(err)

			if(subscriber){
				req.flash('danger', 'You are already registered to this course');
				res.redirect("/student/dashboard");
			}else{
				newSubscriber = new Subscriber({
					id_user : req.user._id,
					firstname : req.user.firstname,
					lastname : req.user.lastname,
					username : req.user.username,
					email : req.user.email,
					date : new Date().toDateString(),
					classroom: "",
					ispaid : false,
					course_id : course_id,
					course_title : course.title,
					course_cost: course.cost,
					course_description: course.description,
					course_image: course.image,
					course_timetable: course.timetable,
					have_access : true,
				})

				newSubscriber.save(function(err, subcriber){
					if(err) return console.log(err);
					console.log("new Subcriber Ok!");

					DiscussGroup.findOne({course_id: course._id}, function(err, group){
						if(err) return console.log(err)

						//Si un groupe n'existe pas pour le cours je le creé
						if(!group){
							discussGroup = new DiscussGroup({
								groupname : course.title,
								course_id : course._id,
								course_name : course.title,
								description : "Ce groupe vous permet d'échanger sur les différents thèmes abordés en cours."
							})

							discussGroup.save(function(err, group){
								if(err) return console.log(err)
								console.log("Group added")
							})
						}
					})

					req.flash('success', 'You are succefully registered to this course');
					res.redirect("/student/dashboard");
				})
			}
		})

	})
	
});

//Logout
router.get('/logout', (req, res) =>{
	req.logout();
    req.flash('success', 'You are logout')
    res.redirect('/')
});


//Ouvrir la page de profil
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
	if(req.user.isStudent){
		Subscriber.find({id_user : req.user._id}, (err, subscriber_courses)=>{
			if(err) return console.log(err);

			subscriber_courses.forEach(function(course){

		    	//Access control to the course
		    	if(!course.ispaid){
		    		var date = new Date(course.date).getTime();
					var now = new Date().getTime();
			    	var distance = now - date;
			    	var days = distance / (1000 * 60 * 60 * 24);

			    	if(days < 1){
			    		course.remaining_test_days = "Il vous reste 2 jours de Test";
			    	}else if(days < 2){
			    		course.remaining_test_days = "Il vous reste 1 jour de Test";
			    	}else{
			    		//Update the course access to "false"
			    		if(course.have_access != false){
			    			var query = { id_user: req.user._id, course_id: course.course_id };
							var newvalues = { $set: {have_access : false} };
							Subscriber.updateOne(query, newvalues, function(err, res) {
							    if (err) throw err;
							    console.log("Course Access updated");
							});
			    		}
			    		course.have_access = false;
			    		course.remaining_test_days = "Votre période de Test s'est épuisée";
			    	}
			    }
			})

			res.render('./app/dashboard', {
				subscriber_courses : subscriber_courses,
				title : "Dashboard"
			})
		})
	}else{
		res.redirect('/teacher/dashboard')
	}
});

//Modifier son profil
router.get('/dashboard/edit-account', ensureAuthenticated, (req, res) =>{
	res.render('./app/edit_account', {
		title : "Edit my Account"
	})
}); 

//Poster un message dans un groupe
router.post('/group/send', ensureAuthenticated, (req, res) =>{
	var groupid = req.body.group_id;
	var content = req.body.content;
	var file = req.body.file;
	console.log(groupid)
	console.log(content)
	console.log(file)

	var query = {_id:  groupid};
    DiscussGroup.findOneAndUpdate(
        query,
        {$push: {"messages": {user_id: req.user._id, content: content,date:new Date(), file: file}}},
        {safe: true, upsert: true},
        function(err, message){
        	if(err) return console.log(err)

        	console.log(message)
        	res.send('1')
        }
    );
}); 


//Ouvrir le groupe de discussion
router.get('/course/group/:id', ensureAuthenticated, (req, res) =>{
	var course_id = req.params.id;
	
	Course.findById(course_id, function(err, course){
		if(err) return console.log(err)

		if(course){
			DiscussGroup.findOne({course_id: course_id}, function(err, group){
				if(err) return console.log(err)

				if(group){
					group.messages.forEach( function(msg) {
						msg.date = moment(msg.date).fromNow();
					});

					Student.find(function(err, students){
						if(err) return console.log(err)

						Teacher.find(function(err, teachers){
							if(err) return console.log(err)
							res.render('./app/discuss_group', {
								course: course,
								group: group,
								teachers: teachers,
								students : students,
								isTeacher: false,
								title : "Groupe de discussion"
							})
						})	
					})
				}
			})
		}
	})
});

//accesss control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('danger', 'Please login')
        res.redirect('/')
    }
}

//Registration to a course accesss control
function ensureAuthenticatedForCourseRegistration(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('danger', 'Please login')
        res.redirect('/course/'+req.params.id)
    }
}


// Exports
module.exports = router;
