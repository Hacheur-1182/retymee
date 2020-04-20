
const express = require('express');
var router = express.Router();

//Get Course Model
var Course = require('../models/course');
//Get teacher Model
var Teacher = require('../models/teacher');
//Get Student Model
var Student = require('../models/student');
//Get TeachersDemand Model
var TeacherDemand = require('../models/teachers_demand');

//Add teachers
router.post('/add',ensureAuthenticated, (req, res) =>{
    req.checkBody('firstname', 'Firstname must have a value').notEmpty();
    req.checkBody('lastname', 'Lastname must have a value').notEmpty();
    req.checkBody('username', 'Username must have a value').notEmpty();
    req.checkBody('email', 'Email must have a value').notEmpty(); 
    req.checkBody('tel', 'Tel must have a value').notEmpty();
    req.checkBody('matiere', 'Matiere must have a value').notEmpty();
    req.checkBody('password', 'Password Field is required (Min 5 caracters)').isLength({ min: 6 }) ;
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password) ;

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var tel = req.body.tel;
    var address = req.address;
    var matiere = req.body.matiere ;
    var description = req.body.desc;

    var errors = req.validationErrors();
    if (errors) {
    	req.flash('danger', "Veuillez remplir tous les champs avec (*). Assurez vous que les mots de passe sont identiques")
        res.redirect('/admin/home')
    }else {
        Teacher.findOne({
            email: email
        }, function(err, teacher) {
        	if(err) return console.log(err)
            if (teacher) {
                req.flash('danger', 'Ce compte existe déja');
                res.redirect('/admin/home')
            } else {
                var newTeacher = new Teacher({
                    firstname : firstname,
                    lastname: lastname,
                    username: username,
                    email : email,
                    password: password,
                    tel: tel,
                    address: address,
                    image : "avatar.png",
                    matiere: matiere,
                    description: description
                });

                Teacher.saveTeacher(newTeacher, function(teacher){
					if(!teacher) {
                        req.flash('danger', 'Une érreur s\'est produite. Veuillez reéssayer');
                        return res.redirect('/admin/home')
                    } else {
                        require('../functions/teacher_registration_mail')(email, username, password);
                        req.flash('success', 'Enseignant crée avec succès')
                        return res.redirect('/admin/home')
                    }
				})
                
            }
        });
    }
})

//Get teachers
router.get('/',ensureAuthenticated, (req, res) =>{
    Teacher.find(function(err, teachers){
        if(err) return console.log(err)

        res.render("./admin/teachers", {
            title : "Teachers Management",
            teachers : teachers
        });
    })
})

//Get  teachers details
router.get('/demand/:id',ensureAuthenticated, (req, res) =>{
    var id = req.params.id;

    TeacherDemand.findById(id, function(err, teacher){
        if(err) return console.log(err)

        res.render("./admin/teacher_demand_details", {
            title : "Teachers Details",
            teacher : teacher
        });
    })
})

//Delete  teachers Demand
router.get('/demand/delete/:id',ensureAuthenticated, (req, res) =>{
    var id = req.params.id;

    var myquery = { _id: id };
    TeacherDemand.deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log("One teacher Demand deleted");
    });
    req.flash('success', 'Teacher Demand Deleted');
    res.redirect('/admin/home')
})

//Delete  teachers 
router.get('/delete/:id', ensureAuthenticated, (req, res) =>{
    var id = req.params.id;

    var myquery = { _id: id };
    
    // Get all courses Id that teacher teachs
    Teacher.findById(id, (err, teacher) => {
        if (err) throw err;
        if(teacher && teacher.courses.length) {
            // Delete teachers on active courses 
            teacher.courses.forEach(course => {
                Course.updateOne({_id: course.course_id},
                    { $pull: { teachers: { teacher_id: id } } }, 
                    (err, data) => {
                        if (err) throw err;
                        
                        // The delete the teacher
                        Teacher.deleteOne(myquery, function(err, obj) {
                            if (err) {
                                throw err;
                            } else {
                                req.flash('success', 'Enseignant supprimé');
                                return res.redirect('/admin/home')
                            }
                        });
                    })
            });
            // He dont teach any course
        } else {
            Teacher.deleteOne(myquery, function(err, obj) {
                if (err) {
                    throw err;
                } else {
                    req.flash('success', 'Enseignant supprimé');
                    return res.redirect('/admin/home')
                }
            });
        }
    })
})

//Get  teachers details
router.get('/info/:id', ensureAuthenticated, (req, res) =>{
    var id = req.params.id;

    Teacher.findById(id, function(err, teacher){
        if(err) return console.log(err)

        res.render("./admin/teacher_details", {
            title : "Teachers Details",
            teacher : teacher
        });
    })
})



function renderWhenError(){
    var N_STUD, N_TEACH, N_COURS;
    Course.countDocuments(function (err, c) {
        if (c) N_COURS = c;
    });
    Teacher.countDocuments(function (err, c) {
        if (c) N_TEACH = c;
    });
    Student.countDocuments(function (err, c) {
        if (c) N_STUD = c;
    });

    TeacherDemand.find(function (err, teachersDemand) {
        if (err) return console.log(err)
        Course.find(function (err, courses) {
            res.render("admin/index", {
                teachersDemand: teachersDemand,
                errors: errors,
                N_STUD: N_STUD,
                N_TEACH: N_TEACH,
                N_COURS: N_COURS,
                courses: courses,
                type: "",
                title: "",
                session: "",
                duration: "",
                startdate: "",
                enddate: "",
                cost: "",
                category: "",
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                tel: tel,
                address: address,
                matiere: matiere,
                description: description
            });
        })
    })
}

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