const express = require('express');
var passport = require('passport');
let moment = require("moment")
var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var  router = express.Router();
const mongoose = require('mongoose')

var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var resizeImg = require('resize-img')

//Get TeachersDemand Model
var TeacherDemand = require('../models/teachers_demand');
//Get Course Model
var Course = require('../models/course');
//Get Teachers Model
var Teacher = require('../models/teacher');
//Get DiscussGroup Model
var DiscussGroup = require('../models/discussGroup');
//Get Student Model
var Student = require('../models/student');
//Get Subscribers Model
var Subscriber = require('../models/subscriber');

//Login
router.post('/login', function(req, res, next){
	passport.authenticate('local-teacher', function(err, user, info) {
		if (err) { return next(err) }
		if (!user) { 
			return res.send('0') 
		} else {
			passport.authenticate('local-teacher')(req, res, function () {
				return res.send('1')
			})
		}
	})(req, res, next);
});

//Ouvrir la page de profil
router.get('/dashboard', ensureAuthenticated2, (req, res) =>{
	res.render('./app/teachers_dashboard', {
		title : "Teacher Dashboard",
		classromm_id: req.classromm_id
	})

});

//Modifier son profil
router.get('/dashboard/edit-account', ensureAuthenticated2, (req, res) =>{
	res.render('./app/edit_account', {
		title : "Edit my Account"
	})
}); 

// Envoyer les notifications aux étudiants pour un cours
router.post('/notify', ensureAuthenticated2, (req, res) =>{
	var classroomInfos = req.body.classromm_id;
	var course_id  = req.body.hidden_course_id2;

	Subscriber.find({course_id: course_id}, function(err, subscribers){
			if(err) return console.log(err)
			
			// Array that will content student's email
			var  subscribersEmails = [];
			var  courseTitle = "";
            if(subscribers) {
				subscribers.forEach(subscriber => {
					subscribersEmails.push(subscriber.email);
					courseTitle = subscriber.course_title;
				});
				require('../functions/send_invitation')(courseTitle, subscribersEmails, classroomInfos)
				req.flash('success', 'Invitation envoyée avec succès')
				res.redirect('/teacher/dashboard')
			} else {
				req.flash('warning', 'Aucune personne enregistrée à ce cours.')
				res.redirect('/teacher/dashboard')
			}
        }
    );
});

// Définir le lien de la salle virtuelle
router.post('/add-link', ensureAuthenticated2, (req, res) =>{
	var classroom_link  = req.body.classromm_id.trim();
	var course_id  = req.body.hidden_course_id2;

	query = {course_id: course_id}
	Subscriber.updateMany(
        query,
        {$set: {classroom: classroom_link}},
        function(err, message){
            if(err) return console.log(err)

            console.log("Link added")
        }
    );
	req.flash('success', 'Link set Successfully')
	res.redirect('/teacher/dashboard')

});

//Ajouter un support de cours
router.post('/add-support', ensureAuthenticated2, (req, res) =>{
	var supportFile = typeof req.files.file !== "undefined" ? req.files.file.name : "";

	req.checkBody('support', 'Title must have a value').notEmpty();

	var support = req.body.support;
	var desc = req.body.desc;
	var course_id = req.body.course_id;
	var errors = req.validationErrors();
	if (errors) {
		res.render('./app/teachers_dashboard', {
			title : "Teacher Dashboard"
		})
	}else{
		var query = {_id:  course_id};
		console.log(req.body)
        Course.findOneAndUpdate(
            query,
            {$push: {"supports": {name: support, desc : desc, file: supportFile}}},
            {safe: true, upsert: true},
            function(err, message){
                if(err) return console.log(err)

                mkdirp('public/course_support/'+course_id, function(err){
                    return console.log(err);
                });

            	if(supportFile != ""){
	                var support = req.files.file;
	                var path = 'public/course_support/'+course_id+'/'+supportFile;

	                support.mv(path, function(err){
	                    return console.log(err);
	                })
	            }
	            req.flash('success', 'Support ajouté avec succès')
	            res.redirect('/teacher/dashboard')
			},
			{useFindAndModify: false}
        );
	}

});

//Ouvrir le groupe de discussion
router.get('/course/group/:id', ensureAuthenticated2, (req, res) =>{
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
								isTeacher : true,
								students : students,
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

//Logout
router.get('/logout', (req, res) =>{
	req.logout();
    req.flash('success', 'You are logout')
    res.redirect('/')
});

//Afficher le formulaire de contact des enseignants
router.get('/contact',(req, res) =>{
	firstname = "";
	lastname = "";
	username = "";
	email = "";
	tel = "";
	address = "";
	ville = "";
	bornat = "";
	image = "",
	sex = "";
	matiere = "";
	about = "";
    res.render('./app/contact', {
    	title : "Contact Us for Teaching",
    	menu_id_home : "home",
		menu_id_prep : "prep",
		menu_id_exam : "exam",
		menu_id_rep : "rep",
		firstname: firstname,
		firstname : lastname,
		username: username,
		email: email,
		tel: tel,
		address: address,
		ville: ville,
		bornat: bornat,
		image: image,
		sex: sex,
		matiere: matiere,
		about: about
    });
});


//Enregistrement des enseignants
router.post('/contact',(req, res) =>{
	var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
	req.checkBody('image', 'You must upload an image').isImage(imageFile);

	var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var tel = req.body.tel;
    var address = req.body.address;
    var ville = req.body.ville ;
    var bornat = req.body.bornat;
    var image = req.body.image;
    var sex = req.body.sex;
    var matiere = req.body.matiere;
    var about = req.body.about;

    var errors = req.validationErrors();

    if (errors) {
        res.render("app/contact", {
        	title : "Contact Us for Teaching",
	    	menu_id_home : "home",
			menu_id_prep : "prep",
			menu_id_exam : "exam",
			menu_id_rep : "rep",
            errors: errors,
            firstname: firstname,
			lastname : lastname,
			username: username,
			email: email,
			tel: tel,
			address: address,
			ville: ville,
			bornat: bornat,
			image: image,
			sex: sex,
			matiere: matiere,
			about: about
        });
    }else{
        TeacherDemand.findOne({
            email: email
        }, function(err, teacher) {
            if (teacher) {
                req.flash('danger', 'Teachers already exists.');
                res.render("app/contact", {
                	title : "Contact Us for Teaching",
			    	menu_id_home : "home",
					menu_id_prep : "prep",
					menu_id_exam : "exam",
					menu_id_rep : "rep",
                    errors: errors,
                    firstname: firstname,
					lastname : lastname,
					username: username,
					email: email,
					tel: tel,
					address: address,
					ville: ville,
					bornat: bornat,
					image: image,
					sex: sex,
					matiere: matiere,
					about: about
                });
                
            } else {
                var teacherDemand = new TeacherDemand({
                    firstname: firstname,
					lastname : lastname,
					username: username,
					email: email,
					tel: tel,
					address: address,
					ville: ville,
					bornat: bornat,
					image: image,
					sex: sex,
					matiere: matiere,
					about: about
                });
                teacherDemand.save(function(err) {
                    if (err) return console.log(err);

                    mkdirp('public/img/teacher_images/'+teacherDemand._id, function(err){
                        return console.log(err);
                    });

                    if(imageFile != ""){
                        var productImage = req.files.image;
                        var path = 'public/img/teacher_images/'+teacherDemand._id+'/'+imageFile;

                        productImage.mv(path, function(err){
                            return console.log(err);
                        })
                    }

                    req.flash('success', 'your request has been taken into consideration')
                    res.redirect('/teacher/contact');
                })
            }
        });
    }

});


//Registration to a course accesss control
function ensureAuthenticated2(req, res, next){
    if(req.isAuthenticated() && req.user.role != "admin"){
        return next()
    }else{
        req.flash('danger', 'Please login')
        res.redirect('/')
    }
}

// Exports
module.exports = router;
