const express = require('express');
var  router = express.Router();

//Get Course Model
var Course = require('../models/course');

router.get('/',(req, res) =>{

	Course.find(function(err, courses){
		if(err) return console.log(err);
        res.render('index', {
	    	title : "Retymee",
			menu_id_home : "active",
			menu_id_prep : "prep",
			menu_id_exam : "exam",
			menu_id_rep : "rep",
			courses: courses
	    });
    }).limit(4)
    
});

router.get('/chat',(req, res) =>{
    res.render('chat', {
    	title : "OnlinePrepa"
    });
});

router.get('/mail',(req, res) =>{

	const nodemailer = require('nodemailer');
	var data = '<br><center><a style="color:rgb(234, 58, 60);border: 1px solid rgb(234, 58, 60);font-size:30px;background-color:white;padding:.5em 3em;text-decoration:none" href="www.onlineprepa.app/dashboard">Activate your Account</a></center>'
	+'<br><h1 style="color:black">Thank you for your registration to Onlineprepa</h1>'
	+'<h3 style="color:black">You must activate your account to access to your profile</h3>'
	+'<a href="localhost:3000/dashboard" class="btn btn-danger">Click on the activate button on the top.</a>'
	+'<br><p style="text-align:center">Copyright OnlinePrepa 2018</p>';
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "onlineprepalearning@gmail.com",
            pass: "onlineprepa123"
        },
        tls:{
        	rejectUnauthorised:false
        }
    });

    let mailOptions = {
        from: '"OnlinePrepa " <onlineprepalearning@gmail.com>', // sender address
        to: 'ngaleuabel@gmail.com', // list of receivers
        subject: 'OnlinePrepa Registration ✔', // Subject line
        text: 'Thank you For Your registration', // plain text body
        html: data, // html body
        attachments: [
            {
              filePath: './timetables/5b3beafa16ce362e800ab1e2/3-tpQos.pdf'
            },
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
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
    })
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

//Afficher laes cours de repetition
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
		title : "Cours de repétition"
	})
});


// Exports
module.exports = router;
