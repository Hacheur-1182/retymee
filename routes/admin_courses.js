const express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var mongoose = require('mongoose');

//Get Course Model
var Course = require('../models/course');

//Get Students Model
var Student = require('../models/student');

//Get Teachers Model
var Teacher = require('../models/teacher');

//Get TeacherDemand Model
var TeacherDemand = require('../models/teachers_demand');


//Get courses
router.get('/', (req, res) =>{
    var count;
    Course.count(function(err, c){
        count = c; 
    });

    Course.find(function(err, courses){
        res.render('./admin/courses',{
            title : "Courses Management",
            courses : courses,
            count: count
        })
    })
})

//Admin Post add course
router.post('/add-course', function(req, res){
    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    var timeTableFile = typeof req.files.timetable !== "undefined" ? req.files.timetable.name : "";

    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('session', 'Session must have a value').notEmpty();
    req.checkBody('duration', 'Duration must have a value').notEmpty();
    req.checkBody('startdate', 'Startdate must have a value').notEmpty(); 
    req.checkBody('enddate', 'Endtdate must have a value').notEmpty();
    req.checkBody('cost', 'Cost must have a value').notEmpty();
    req.checkBody('category', 'Category must have a value').notEmpty();
    req.checkBody('description', 'Description must have a value').notEmpty();

    var type = req.body.type;
    var title = req.body.title;
    var session = req.body.session;
    var duration = req.body.duration;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var cost = req.body.cost ;
    var category = req.body.category;
    var description = req.body.description;

    var errors = req.validationErrors();
    if (errors) {
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

        TeacherDemand.find(function (err, teachersDemand) {
            if (err) return console.log(err)

            Course.find(function(err, courses){
                res.render("admin/index", {
                    teachersDemand: teachersDemand,
                    errors: errors,
                    N_STUD: N_STUD,
                    N_TEACH: N_TEACH,
                    N_COURS: N_COURS,
                    courses : courses,
                    type : type,
                    title: title,
                    session: session,
                    duration : duration,
                    startdate: startdate,
                    enddate: enddate,
                    cost: cost,
                    category: category,
                    description: description,
                    firstname : "",
                    lastname : "",
                    username : "",
                    email : "",
                    tel : "",
                    address : "",
                    matiere : "",
                    description : ""
                });
            })
        })

    }else{
        Course.findOne({
            title: title
        }, function(err, course) {
            if (course) {
                if (course.title == title && course.session == session) {
                    req.flash('danger', 'Course title exists, choose another.');
                    var N_STUD, N_TEACH, N_COURS;
                    Course.countDocuments(function(err, c){
                        N_STUD = c; 
                    });
                    Teacher.countDocuments(function(err, c){
                        N_TEACH = c; 
                    });
                    Student.countDocuments(function(err, c){
                        N_COURS = c; 
                    });
                    TeacherDemand.find(function (err, teachersDemand) {
                        if (err) return console.log(err)

                        Course.find(function(err, courses){
                            res.render("admin/index", {
                                teachersDemand: teachersDemand,
                                N_STUD: N_STUD,
                                N_TEACH: N_TEACH,
                                N_COURS: N_COURS,
                                courses: courses,
                                errors: errors,
                                type : type,
                                title: title,
                                session: session,
                                duration : duration,
                                startdate: startdate,
                                enddate: enddate,
                                cost: cost,
                                category: category,
                                description: description,
                                firstname : "",
                                lastname : "",
                                username : "",
                                email : "",
                                tel : "",
                                address : "",
                                matiere : "",
                                description : ""
                            });
                        })
                    })
                }
                
            } else {
                var course = new Course({
                    type : type,
                    title: title,
                    session: session,
                    duration : duration,
                    startdate: startdate,
                    enddate: enddate,
                    cost: cost,
                    description: description,
                    category: category,
                    timetable: timeTableFile,
                    image: imageFile,
                    dateposted: new Date().toLocaleDateString()
                });
                course.save(function(err) {
                    if (err) return console.log(err);

                    mkdirp('public/img/course_images/'+course._id, function(err){
                        return console.log(err);
                    });

                    mkdirp('public/timetables/'+course._id, function(err){
                        return console.log(err);
                    });

                    if(imageFile != ""){
                        var courseImage = req.files.image;
                        var path = 'public/img/course_images/'+course._id+'/'+imageFile;

                        courseImage.mv(path, function(err){
                            return console.log(err);
                        })
                    }

                    if(timeTableFile != ""){
                        var courseTimeTable = req.files.timetable;
                        var path2 = 'public/timetables/'+course._id+'/'+timeTableFile;

                        courseTimeTable.mv(path2, function(err){
                            return console.log(err);
                        })
                    }

                    req.flash('success', 'Course Added')
                    res.redirect('/admin/home');
                })
            }
        });
    }
})

//Set a course to a teacher
router.get('/assign-course', (req, res) =>{
    Course.find(function(err, courses){
        if(err) return console.log(err)

        Teacher.find(function(err, teachers){
            if(err) return console.log(err)

            res.render("./admin/assign-class", {
                title : "Assign Course",
                courses: courses,
                teachers: teachers
            });
        })
    })
})

//Set a course to a teacher
router.post('/assign-course', (req, res) =>{
    var teacher_id = req.body.teacher_id;
    var course_id = req.body.hidden_course_id;

    //Je met à jour la table des cours et les cours du prof
    var query1 = {_id:  course_id};
    var query2 = {_id:  teacher_id};

    Teacher.findById(teacher_id, function(err, teacher){
        if(err) return console.log(err)

        Course.findOneAndUpdate(
            query1,
            {$push: {"teachers": {teacher_id: teacher._id, firstname: teacher.firstname, lastname: teacher.lastname, email: teacher.email, tel: teacher.tel, address: teacher.address, matiere: teacher.matiere}}},
            {safe: true, upsert: true},
            function(err, data){
                if(err) return console.log(err)

                Course.findById(course_id, function(err, course){
                    Teacher.findOneAndUpdate(
                        query2,
                        {$push: {"courses": {course_id: course_id, title: course.title, description : course.description, image: course.image, timetable: course.timetable}}},
                        {safe: true, upsert: true},
                        function(err, message){
                            if(err) return console.log(err)
                        }
                    );
                    require('../functions/assign_course_mail')(teacher.email, course.title, course._id, course.timetable);
                    req.flash('success', 'Course Successfully assigned')
                    res.redirect('/admin/courses/assign-course')
                })
            }
        );
    })

})

//Get courses details
router.get('/detail/:id', (req, res) =>{
    res.render("./admin/course-details", {
        title : "Courses Details"
    });
})



//Exports 
module.exports = router;