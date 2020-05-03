var mongoose = require('mongoose');

var quizResponseSchema = mongoose.Schema({
    quizId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    questionId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    mark:{
        type: Number
    },
    userName:{
        type: String
    },
    email:{
        type: String
    },
    responses:{
        type: Array
    }
})

var QuizResponse = module.exports = mongoose.model('QuizResponse', quizResponseSchema);
