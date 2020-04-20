module.exports = function (email, username, password) {
	const nodemailer = require('nodemailer');
	var data = '<br>'
	+'<br><h2 style="color:black">Your are a new teacher on Retymee</h2>'
	+'<h3 style="color:black">Informations of your Account:</h3>'
    +'<h4>Your Username is: '+username+'</h4>'
    +'<h4>Your Password is: '+password+'</h4>'
    +'<h5>You can now login in your account.</h5>'
    +'<br><p style=""><a href="http://www.retymee.com/teacher/dashboard" style="font-size:20px;padding:.2em 1.5em;text-decoration:none">Visit Your dashboard</a></p>';
	+'<br><p style="text-align:center">Copyright Retymee 2020. By Inchtechs</p>';
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "retymee.liveclass@gmail.com",
            pass: "retymee@123"
        },
        tls:{
        	rejectUnauthorised:false
        }
    });

    let mailOptions = {
        from: '"Retymee " <retymee.liveclass@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Retymee Teacher Account ✔', // Subject line
        text: 'Your are a new teacher on Retymee', // plain text body
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