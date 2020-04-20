const express = require('express');
var  router = express.Router();
var bcrypt = require('bcryptjs')

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

// Afficher la vue de modification du mot de passe (adresse email)
router.get('/user/reset-password', (req, res) =>{
	res.render('./app/reset_password', {
		title : "Reset password",
		menu_id_home : "home",
		menu_id_prep : "prep",
		menu_id_exam : "exam",
		menu_id_rep : "active"
	})
});

// Envoyer le mail pour la récupération du mot de passe
router.post('/user/reset-password', (req, res) =>{
	const email = req.body.email;
	const isTeatcher = req.body.isTeatcher;

	if(isTeatcher) {
		// Find if this email exist
		Teacher.findOne({email: email}, (err, teacher) => {
			if(err) throw err
	
			if(teacher) {
				const newpassword = Math.trunc(Math.random() * 100000000).toString();
				bcrypt.hash(newpassword, 10, function(err, hash){
					if (err) throw err;
	
					Teacher.updateOne({email: email},
						{$set: {password: hash}},
						(err, user) => {
							if(err) throw err
							require('../functions/reset_password')(email, newpassword)
							req.flash('success', 'Mot de passe mise à jour avec succès');
							res.redirect('/')
					})
				})
			} else {
				req.flash('warning', 'Cette adresse email n\'est associé à aucun compte.');
				res.redirect('/user/reset-password')
			}
		})
	} else {
		// Find if this email exist
		Student.findOne({email: email}, (err, student) => {
			if(err) throw err
	
			if(student) {
				const newpassword = Math.trunc(Math.random() * 100000000).toString();
				bcrypt.hash(newpassword, 10, function(err, hash){
					if (err) throw err;
	
					Student.updateOne({email: email},
						{$set: {password: hash}},
						(err, user) => {
							if(err) throw err
							require('../functions/reset_password')(email, newpassword)
							req.flash('success', 'Mot de passe mise à jour avec succès');
							res.redirect('/')
					})
				})
			} else {
				req.flash('warning', 'Cette adresse email n\'est associé à aucun compte.');
				res.redirect('/user/reset-password')
			}
		})
	}
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
		Student.findOne({email: email}, (err, user) => {
			if(err) throw err;
			var toUpdate;
			console.log(user)
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
					res.redirect('/student/dashboard/edit-account')
			})
		})
	} else {
		// It is a teacher
		Teacher.findOne({email: email}, (err, user) => {
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
					res.redirect('/teacher/dashboard/edit-account')
			})
		})
	}
});

// Modifier son mot de passe
router.post('/user/password/update', ensureAuthenticated, (req, res) =>{
	const currentpassword = req.body.currentpassword;
	const newpassword = req.body.newpassword;

	req.checkBody('currentpassword', 'Champs requis').notEmpty() ;
	req.checkBody('newpassword', 'Mot de passe requis').isLength({ min: 6 }) ;
	req.checkBody('confirmation', 'Passwords do not match').equals(newpassword) ;

	var errors = req.validationErrors();

	if(errors){
		res.send(errors[0].param);
	} else {
		// It is a student
		bcrypt.compare(currentpassword, req.user.password, function (err, isMatch) {
			if (err)
				console.log(err);

			// L'ancien mot de passe est bien vérifiée
			if (isMatch) {
				
					bcrypt.hash(newpassword, 10, function(err, hash){
						if (err) throw err;

						if(req.user.isStudent) {
							Student.updateOne({_id: req.user._id},
								{$set: {password: hash}},
								(err, user) => {
									if(err) throw err
									req.flash('success', 'Mot de passe mise à jour avec succès');
									res.redirect('/student/dashboard/edit-account')
							})
						} else {
							// It is a teacher
							Teacher.updateOne({_id: req.user._id},
								{$set: {password: hash}},
								(err, user) => {
									if(err) throw err
									req.flash('success', 'Mot de passe mise à jour avec succès');
									res.redirect('/teacher/dashboard/edit-account')
							})
						}
					})
			} else {
				if(req.user.isStudent) {
					req.flash('warning', 'L\'ancien mot de passe n\'est pas valide.');
					res.redirect('/student/dashboard/edit-account')
				} else {
					req.flash('warning', 'L\'ancien mot de passe n\'est pas valide.');
					res.redirect('/teacher/dashboard/edit-account')
				}
			}
		});


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
