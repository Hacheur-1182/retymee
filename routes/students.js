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
	var email = req.body.login_email;
	var password = req.body.login_password;
	var status = req.body.status
	var password2 = req.body.password2;

	req.checkBody('username', 'Username Field is required').notEmpty();
	req.checkBody('username', 'Username Field is required').isLength({ min: 5 });
	req.checkBody('login_email', 'Email Field is required').notEmpty() ;
	req.checkBody('login_email', 'Email must be a valid Email Address').isEmail() ;
	req.checkBody('login_password', 'Password Field is required').notEmpty() ;
	req.checkBody('login_password', 'Password Field is required').isLength({ min: 6 }) ;
	req.checkBody('password2', 'Passwords do not match').equals(password) ;

	var errors = req.validationErrors();

	if(errors){

		res.send(errors[0].param);

	}else {
		//Je vérifie si l'email existe déja
		Student.findOne({email : email}, function(err, usermail){
			if(err) return console.log(err);
			if(usermail){
				res.send("email_exist");
			}else{
				//Je crée un nouvel étudiant
				newStudent = new Student({
					firstname: username,
					lastname: username,
					username: username.split(' ')[0],
					email : email,
					status: status,
					isStudent : true,
					password: password,
					image: "avatar.png"
				});
				Student.saveStudent(newStudent, function(student) {
					if(err) return console.log(err);
					// Login the user
					passport.authenticate('local-student')(req, res, function () {
						require('../functions/registration_mail')(email, student._id);
						res.send('1')
					})
				})
			}
		})
	}
});

// Activate user account
router.get('/:id/activateAccount', (req, res, next) =>{
	var userId = req.params.id;

	Student.updateOne({_id: userId}, {$set: {accountActivated: true}}, function(err, user) {
		if(err) return console.log(err);
		req.flash('success', 'Votre compte a été activé avec succès');
		res.redirect('/student/dashboard')
	})
});

//Login
router.post('/login', function(req, res, next){	
	passport.authenticate('local-student', function(err, user, info) {
		if (err) { return next(err) }
		if (!user) { 
			return res.send('0') 
		} else {
			passport.authenticate('local-student')(req, res, function () {
				return res.send('1')
			})
		}
	})(req, res, next);

});

//Register to a course
router.get('/course/:id/register', ensureAuthenticatedForCourseRegistration, (req, res) =>{
	course_id = req.params.id;
	
	Student.findById(req.user._id, ((err, user) => {
		if(err) return console.log(err)

		// Verify if user account is validated
		if(user.accountActivated) {
			Course.findById(course_id, (err, course)=> {
				if(err) return console.log(err)
		
				Subscriber.findOne({id_user : req.user._id, course_id: course._id}, (err, subscriber)=>{
					if(err) return console.log(err)
		
					if(subscriber){
						req.flash('danger', 'Vous êtes déja enregistré à ce cours');
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
		
							req.flash('success', 'Vous êtes enregistré avec succès sur ce cours');
							res.redirect("/student/dashboard");
						})
					}
				})
		
			})
			// Le compte n'est pas encore activé
		} else {
			req.flash('warning', 'Vous devez activer votre compte pour pouvoir vous inscrire à un cours. Consultez votre boîte mail.');
			res.redirect("/student/dashboard");
		}
	}))

	
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

	var query = {_id:  groupid};
    DiscussGroup.findOneAndUpdate(
        query,
        {$push: {"messages": {user_id: req.user._id, content: content,date:new Date(), file: file}}},
        {safe: true, upsert: true},
        function(err, message){
        	if(err) return console.log(err)

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
		} else {
			req.flash('warning', "Cette discussion n'est plus disponible")
			res.redirect('/student/dashboard')
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
    if(req.isAuthenticated() && req.user.role != "admin"){
        return next()
    }else{
        req.flash('danger', 'Please login')
        res.redirect('/course/'+req.params.id)
    }
}


// Exports
module.exports = router;
