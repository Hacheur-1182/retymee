var mongoose = require('mongoose');

//Page Schema

var coursesSchema = mongoose.Schema({
    type: {
        type: String
    },
    title:{
        type: String,
        required: true
    },
    session:{
        type: String,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    startdate:{
        type: String,
        required: true
    },
    enddate:{
        type: String,
        required: true
    },
    cost:{
        type: String,
        required: false
    },
    content:{
        type: String,
        required: false
    },
    description:{
        type: String
    },
    category:{
        type: String
    },
    image:{
        type: String
    },
    timetable:{
        type: String
    },
    dateposted:{
        type: String
    },
    supports: [{
        name:{
            type: String
        },
        desc:{
            type: String
        },
        file:{
            type: String
        }
    }],
    teachers: [{
        teacher_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        firstname:{
            type: String
        },
        lastname:{
            type: String
        },
        email:{
            type: String
        },
        tel:{
            type: Number
        },
        address:{
            type: String
        },
        matiere:{
            type: String
        }
    }]
})

var Course = module.exports = mongoose.model('Course', coursesSchema);
