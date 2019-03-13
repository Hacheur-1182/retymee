var express = require('express')
var path = require('path')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session')
var morgan = require('morgan')
var expressValidator = require('express-validator')
var config = require('./config/database')
var fileUpload = require('express-fileupload')
var cookieParser = require('cookie-parser')
var passport = require('passport');
var async = require('async')
var nodemailer = require('nodemailer')
var http = require('http');

//Init App
var app = express();
var server = http.createServer(app);

//Get DiscussGroup Model
var DiscussGroup = require('./models/discussGroup');

//Connect to db
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to the DB");
});


//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

//setup public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set global errors variable
app.locals.errors = null;

// Express fileUpload middleware
app.use(fileUpload());

//Cookie parser
app.use(cookieParser())
// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
//  cookie: { secure: true }
}));

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport Config
require('./config/passport')(passport);


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next) {
   res.locals.user = req.user || null;
   next();
});


//set routes
var pages = require('./routes/pages.js');
var teachers = require('./routes/teachers.js');
var students = require('./routes/students.js');
var adminTeachers = require('./routes/admin_teachers.js');
var adminStudents = require('./routes/admin_students.js');
var adminCourses = require('./routes/admin_courses.js');
var admin_discussGroup = require('./routes/admin_discussGroup.js');
var admin_pages = require('./routes/admin_pages.js');
app.use('/', pages);
app.use('/admin', admin_pages);
app.use('/teacher', teachers);
app.use('/admin/teachers', adminTeachers);
app.use('/admin/students', adminStudents);
app.use('/student', students);
app.use('/admin/courses', adminCourses);
app.use('/admin/group', admin_discussGroup);


//Socket.io
var io = require('socket.io').listen(server)

io.on('connection', function(socket){
    var client = socket.request._query.pseudo
    console.log(client+" vient de se connecter");

    socket.on('new message', function(data){
        console.log("Message: ")
        socket.broadcast.emit('addMessage', data)

        var query = {_id:  data.group_id};
        var user_id = data.user_id;
        var content = data.content;
        var file = data.file;
        var date = data.date;

        DiscussGroup.findOneAndUpdate(
            query,
            {$push: {"messages": {user_id: user_id, content: content, date, file: file}}},
            {safe: true, upsert: true},
            function(err, message){
                if(err) return console.log(err)

                socket.emit('sending verification', "gone")
                console.log("New chat message added")
            }
        );
    })
})

//Start the server
var port = 3000;
server.listen(port, function(){
    console.log("Server on port: "+port);
})

