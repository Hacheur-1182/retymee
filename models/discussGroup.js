var mongoose = require('mongoose');

//Page Schema

var DiscussGroupSchema = mongoose.Schema({
    groupname: {
        type: String,
        required: true
    },
    course_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    course_name:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    messages: [{
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        content:{
            type: String,
            required: true
        },
        file:{
            type: String
        },
        fileType:{
            type: String
        },
        date:{
            type: String
        }
    }]
})

var DiscussGroup = module.exports = mongoose.model('DiscussGroup', DiscussGroupSchema);
