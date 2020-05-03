var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    startAt:{
        type: Date,
        required: true
    },
    endAt:{
        type: Date,
        required: true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    courseTitle:{
        type: String,
        required: true
    },
    questions: [{
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        label:{
            type: String
        },
        mark:{
            type: Number
        },
        responses:{
            type: Array
        },
        trueResponses:{
            type: Array
        },
    }]
})

var Quiz = module.exports = mongoose.model('Quiz', quizSchema);
