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


// Exports
module.exports = router;
