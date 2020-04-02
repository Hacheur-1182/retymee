module.exports = function (email, username) {
	const nodemailer = require('nodemailer');
	var data = '<br><center><a style="color:rgb(234, 58, 60);border: 1px solid rgb(234, 58, 60);font-size:30px;background-color:white;padding:.5em 3em;text-decoration:none" href="localhost:3000/student/'+username+'/activateAccount">Activate your Account</a></center>'
	+'<br><h1 style="color:black;text-align:center">Merci de vous être inscrit</h1>'
	+'<h3 style="color:black;text-align:center">Vous devez activer votre compte pour pouvoir accéder à votre profile.</h3>'
	+'<p><center>Cliquez sur le bouton activer ci-dessus.<center></p>'
	+'<br><p style="text-align:center">Copyright © 2020. Powered by Inchtechs</p>';
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
        from: '"Retymee " <retymee@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Retymee Registration ✔', // Subject line
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