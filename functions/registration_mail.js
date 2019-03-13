module.exports = function (email) {
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
        to: email, // list of receivers
        subject: 'OnlinePrepa Registration ✔', // Subject line
        text: 'Thank you For Your registration', // plain text body
        html: data // html body
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