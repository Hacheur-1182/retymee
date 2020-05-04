const express = require('express');
var passport = require('passport');
let moment = require("moment")
var mkdirp = require('mkdirp')
var fs = require('fs-extra')
var  router = express.Router();
const mongoose = require('mongoose')


var Course = require('../models/course');
//Get Teachers Model
var Teacher = require('../models/teacher');
//Get DiscussGroup Model
var Student = require('../models/student');
//Get Subscribers Model
var Subscriber = require('../models/subscriber');


var Quiz = require('../models/quiz');
var QuizResponse = require('../models/quizResponse');

// Ouvrir l'interface pour la gestion des évaluations [Enseignant]
router.get('/', ensureAuthenticated2, (req, res) =>{
    Quiz.find({teacherId: req.user._id}, (err, quizzes) => {
        if (err) throw err
        console.log(quizzes)
        quizzes.forEach(e => console.log(e.startAt))
        quizzes.forEach(e => console.log(new Date(e.startAt)))
        res.render('./app/evaluation/quiz_dashboard', {
            isTeacher: true,
            quizzes: quizzes,
            title : "Gestion des évaluations"
        })
    })
});

// Ouvrir l'interface pour la gestion des évaluations [Etudiant]
router.get('/student/:courseId/all', ensureAuthenticated2, (req, res) =>{
    const courseId = req.params.courseId;

    Quiz.find({courseId: courseId}, (err, quizzes) => {
        if (err) throw err

        res.render('./app/evaluation/quiz_student_dash', {
            isTeacher: false,
            quizzes: quizzes,
            title : "Liste des Quiz"
        })
    })
});

// Ouvrir l'interface pour la création d'une évaluation
router.get('/builder', ensureAuthenticated2, (req, res) =>{
    res.render('./app/evaluation/quiz_form_builder', {
        isTeacher: true,
        teacher: req.user,
        title : "Création d'un évaluation"
    })
});

// Poster un Quiz
router.post('/builder', ensureAuthenticated2, (req, res) =>{
    const title = req.body.title;
    const startAt = req.body.startAt;
    const endAt = req.body.endAt;
    const courseId = req.body.courseId;
    const courseTitle = req.body.courseTitle;
    const questions = JSON.parse(req.body.questions);

    questions.forEach(question => {
        question['_id'] = mongoose.Types.ObjectId();
    });

    let newQuiz = new Quiz({
        title: title,
        teacherId: req.user._id,
        startAt: startAt,
        endAt: endAt,
        courseId: courseId,
        courseTitle: courseTitle,
        questions: questions
    })

    newQuiz.save(function (err, resp) {
        if (err) return console.error(err);
        req.flash('success', "Quiz ajouté avec succès")
        res.send('1');
    });

});


// Afficher les questions une par une
router.get('/:quizId', ensureAuthenticated2, (req, res) =>{
    const quizId = req.params.quizId;
    
    Quiz.findById(quizId, (err, quiz) => {
        if (err) throw err;

        // Vérifier si la période du cours est effective
        const startTime = new Date(quiz.startAt).getTime();
        const endTime = new Date(quiz.endAt).getTime();

        const now = new Date().getTime();

        if ((startTime - now) > 0) {
            // L'heure du quiz n'est pas encore arrivé
            res.render('./app/evaluation/quiz_waiting', {
                isTeacher: false,
                title : "Quiz en attente"
            })
        } else {
            // L'heure de démarrage du quiz est passé
            if((endTime - now) > 0) {
                // Le quiz est en cours
                QuizResponse.find({quizId: quizId, userId: req.user._id}, (err, quizResponses) => {
                    if (err) throw err;
        
                    // Choose a random question
                    let chosenQuestion = null // Question to choose ramdomly
                    const allQuestions = quiz.questions; // Question list
                    const N = allQuestions.length // Total numbers of questions
                    const NA = quizResponses.length // Total numbers of anwsered questions
        
                    if(NA < N) { // All questions have not been anwserd
                        while (!chosenQuestion) {
                            let randomNumber = Math.trunc(Math.random() * N) // Pick a random number
                            chosenQuestion = allQuestions[randomNumber] // Random choosen question
                            
                            // Find if question is not already anwered
                            const anwseredQuestionsIds = quizResponses.map(question => question.questionId.toString());
                            if(anwseredQuestionsIds.includes(chosenQuestion._id.toString())) {
                                chosenQuestion = null;
                            }
                        }
        
                        res.render('./app/evaluation/quiz', {
                            isTeacher: false,
                            quiz: quiz,
                            question: chosenQuestion,
                            title : "Quiz"
                        })
        
                    } else { // All question have been anwsered
                        res.render('./app/evaluation/quiz_finished', {
                            isTeacher: false,
                            title : "Quiz Terminé"
                        })
                    }
                })
            } else {
                // Le quiz est déja terminé
                res.render('./app/evaluation/quiz_finished', {
                    isTeacher: false,
                    title : "Quiz Terminé"
                })
            }
        }
    })
});

// Répondre à une question
router.post('/:quizId/:questionId', ensureAuthenticated2, (req, res) =>{
    const quizId = req.params.quizId;
    const questionId = req.params.questionId;
    let userResponse = req.body.response ? req.body.response: [];
    
    if(!Array.isArray(userResponse)) {
        userResponse = [userResponse]
    }

    Quiz.findById(quizId, (err, quiz) => {
        if (err) throw err;

        // Get the answered question
        let question = quiz.questions.filter(q => q._id == questionId)
        question = question[0]

        // Correct the user anwser
        const trueResponses = question.trueResponses; // True response list
        const markPerTrueResponse = question.mark / trueResponses.length;
        let totalQuestionMark = 0;

        // Process marks calculation | remove 1 point for each wrong awnser
        // userResponse.forEach(response => {
        //     if(trueResponses.includes(response)) {
        //         totalQuestionMark+= markPerTrueResponse;
        //     } else {
        //         totalQuestionMark-=1
        //     }
        // });

        // process mark calculation | 0 point if user failed one question
        if(userResponse.length <= trueResponses.length) {
            userResponse.forEach(response => {
                if(trueResponses.includes(response)) {
                    totalQuestionMark+= markPerTrueResponse;
                }
            });
        }

        let newResponse = new QuizResponse({
            quizId: quiz._id,
            courseId: quiz.courseId, 
            questionId: questionId,
            userId: req.user._id,
            mark: totalQuestionMark,
            userName: req.user.firstname,
            email: req.user.email,
            responses: userResponse
        })

        newResponse.save(function (err, resp) {
            if (err) return console.error(err);
            
            res.redirect('/quiz/'+quizId);
        });
    })
});

// Prévisualisation du Quiz
router.get('/preview/:quizId', ensureAuthenticated2, (req, res) =>{
    const quizId = req.params.quizId
    
    Quiz.findById(quizId, (err, quiz) => {
         if (err) throw err

         res.render('./app/evaluation/quiz_preview', {
             isTeacher: true,
             quiz: quiz,
             title : "Prévisualisation du Quiz"
         })
    })
});

// Afficher les résultats d'un quiz
router.get('/results/:quizId', ensureAuthenticated2, (req, res) =>{
    const quizId = req.params.quizId
    
    Quiz.findById(quizId, (err, quiz) => {
        if (err) throw err
        
        QuizResponse.aggregate([
            {
                $match: { "quizId": mongoose.Types.ObjectId(quizId) }
            },
            {
                $group : {
                    _id : "$userId",
                    total: { $sum: "$mark" },
                    count: { $sum: 1 },
                    username: { "$first": "$userName" },
                    email: { "$first": "$email" },
                }
            }
        ],
            (err, results) => {
            if (err) throw err

            res.render('./app/evaluation/quiz_results', {
                isTeacher: true,
                quiz: quiz,
                results: results,
                title : "Résultats"
            })
       })
    })
});

//Registration to a course accesss control
function ensureAuthenticated2(req, res, next){
    if(req.isAuthenticated() && req.user.role != "admin"){
        return next()
    }else{
        res.redirect('/')
    }
}

// Exports
module.exports = router;
