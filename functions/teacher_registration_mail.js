module.exports = function (email, username, password) {
	const nodemailer = require('nodemailer');
	var data = '<br>'
	+'<br><h1 style="color:black">Your are a new teacher on OnlinePrepa</h1>'
	+'<h2 style="color:black">Informations of the Account</h2>'
    +'<h3>Your Username is: '+username+'</h3>'
    +'<h3>Your Password is: '+password+'</h3>'
    +'<h4>Log In to your account to change it.</h4>'
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
        subject: 'OnlinePrepa Teacher Account ✔', // Subject line
        text: 'Your are a new teacher on onlineprepa', // plain text body
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