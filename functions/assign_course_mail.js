module.exports = function (email, coursename, course_id, coursetimetable) {
	const nodemailer = require('nodemailer');
	var data = '<br>'
	+'<br><h1 style="color:black">You have a new course to Teache</h1>'
	+'<h2 style="color:black">Informations of the course</h2>'
    +'<h3>Name: '+coursename+'</h3>'
	+'<h3>Download Timetable on attached files</h3>'
    +'<br><p style=""><a href="www.onlineprepa.com" style="color:rgb(234, 58, 60);font-size:30px;background-color:white;padding:.2em 2em;text-decoration:none">Visit Your dashboard</a></p>';
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
        to: email, // list of receivers
        subject: 'OnlinePrepa Course Assignation ✔', // Subject line
        text: 'New Course', // plain text body
        html: data, // html body
        attachments: [
            {
              filePath: './timetables/'+course_id+'/'+coursetimetable
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
}