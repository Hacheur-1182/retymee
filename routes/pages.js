const express = require('express');
var  router = express.Router();

//Get Course Model
var Course = require('../models/course');
//Get Teacher Model
var Teacher = require('../models/teacher');
//Get Student Model
var Student = require('../models/student');

router.get('/',(req, res) =>{
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

	Course.find(function(err, courses){
		if(err) return console.log(err);
        res.render('index', {
	    	title : "Retymee",
			menu_id_home : "active",
			menu_id_prep : "prep",
			menu_id_exam : "exam",
			menu_id_rep : "rep",
			courses: courses,
			N_STUD: N_STUD,
			N_TEACH: N_TEACH,
			N_COURS: N_COURS,
	    });
    }).sort({ $natural: -1 }).limit(4)
    
});

router.get('/chat',(req, res) =>{
    res.render('chat', {
    	title : "OnlinePrepa"
    });
});

//Afficher la liste des cours de preparation
router.get('/prepa-courses', (req, res) =>{
	Course.find(function(err, courses){
		if(err) return console.log(err);
        res.render('./app/courses', {
	    	title : "Cours de Préparation aux Concours à la une",
			menu_id_home : "home",
			menu_id_prep : "active",
			menu_id_exam : "exam",
			menu_id_rep : "rep",
			courses: courses
	    });
    }).sort({ $natural: -1 })
});

//Afficher la liste des examens
router.get('/exams-courses', (req, res) =>{
	res.render('./app/courses_exams', {
		title : "Cours de Préparation aux examens à la une",
		menu_id_home : "home",
		menu_id_prep : "prep",
		menu_id_exam : "active",
		menu_id_rep : "rep"
	})
});

//Afficher la description d'un cours
router.get('/course/:id', (req, res) =>{
	var id = req.params.id;
	Course.findById(id, function(err, course){
		if(err){
			return console.log(err)
		}
		res.render('./app/course_description', {
			course: course,
			title : "Détails sur ce cours",
			menu_id_home : "home",
			menu_id_prep : "active",
			menu_id_exam : "exam",
			menu_id_rep : "rep"
		})
	})
	
});

//Afficher les cours de repetition
router.get('/repetition', (req, res) =>{
	res.render('./app/repetition', {
		title : "Cours de repétition",
		menu_id_home : "home",
		menu_id_prep : "prep",
		menu_id_exam : "exam",
		menu_id_rep : "active"
	})
});


// Accéder à la classe virtuelle
router.get('/classroom', (req, res) =>{
	res.render('./app/meeting', {
		title : "Conférence video"
	})
});

// Modifier les informations de profil: Etudiant et enseignant
router.post('/user/edit-account', ensureAuthenticated, (req, res) =>{
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const username = req.body.username;
	const email = req.body.email;
	const tel = req.body.tel;
	const address = req.body.address;
	const ville = req.body.ville;
	const sex = req.body.sex;
	const status = req.body.status;
	const description = req.body.description;

	if(req.user.isStudent) {
		// It is a student
		Student.findOne({email: req.user.email}, (err, user) => {
			if(err) throw err;
			var toUpdate;
			if(user) {
				// Dont update email address
				toUpdate = {
					lastname: lastname,
					firstname: firstname,
					username: username,
					tel: tel,
					address: address,
					ville: ville,
					sex: sex,
					status: status,
					description: description}
			} else {
				// Update email address
				toUpdate = {
					lastname: lastname,
					firstname: firstname,
					username: username,
					email: email,
					tel: tel,
					address: address,
					ville: ville,
					sex: sex,
					status: status,
					description: description}
			}
			
			Student.updateOne({_id: req.user._id},
				{$set: toUpdate},
				(err, user) => {
					if(err) throw err
					req.flash('success', 'Vos informations ont été mise à jour avec succès');
					res.redirect('/student/dashboard')
			})
		})
	} else {
		// It is a teacher
		Teacher.findOne({email: req.user.email}, (err, user) => {
			if(err) throw err;
			var toUpdate;
			if(user) {
				// Dont update email address
				toUpdate = {
					lastname: lastname,
					firstname: firstname,
					username: username,
					tel: tel,
					address: address,
					ville: ville,
					sex: sex,
					status: status,
					description: description}
			} else {
				// Update email address
				toUpdate = {
					lastname: lastname,
					firstname: firstname,
					username: username,
					email: email,
					tel: tel,
					address: address,
					ville: ville,
					sex: sex,
					status: status,
					description: description}
			}
			
			Teacher.updateOne({_id: req.user._id},
				{$set: toUpdate},
				(err, user) => {
					if(err) throw err
					req.flash('success', 'Vos informations ont été mise à jour avec succès');
					res.redirect('/teacher/dashboard')
			})
		})
	}
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


// Exports
module.exports = router;
