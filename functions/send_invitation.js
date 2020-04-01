module.exports = function (studentName, courseName, email, data) {
	const nodemailer = require('nodemailer');
	var data = ''
	+'<br><h1 style="color:black;text-align:center">Bonjour '+studentName+'!</h1>'
	+'<br><h1 style="color:black;text-align:center">Informations pour participer au cours de: '+courseName+'.</h1>'
	+'<p style="color:black;text-align:center">'+data+'</p>'
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
        subject: 'Invitation pour la participation au cours', // Subject line
        text: 'Vous êtes invité à participer au cours', // plain text body
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