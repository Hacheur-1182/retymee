module.exports = function (courseName, emails, data) {
	const nodemailer = require('nodemailer');
	var html = ''
	+'<br><h3 style="color:black;text-align:center">Salut!</h3>'
	+'<br><h4 style="color:black;text-align:center">Informations pour participer au cours de:</h4>'
	+'<br><h1 style="color:black;text-align:center">'+courseName+'.</h1>'
	+'<p style="color:black;text-align:center">'+data+'</p>'
	+'<br><p style="text-align:center">Copyright © 2020. Powered by Inchtechs</p>';
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
        to: emails, // list of receivers
        subject: 'Invitation pour la participation au cours', // Subject line
        text: 'Vous êtes invité à participer au cours', // plain text body
        html: html // html body
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