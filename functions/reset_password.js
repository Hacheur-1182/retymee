module.exports = function (email, newPassword) {
	const nodemailer = require('nodemailer');
	var data = 
	'<h4 style="color:black;">Récupération du mot de passe</h4>'
	+'<p>Utilisez ce nouveau mot de passe pour vous connecter:</p>'
	+'<p><b>'+newPassword+'</b></p>'
	+'<p>Modifiez le une fois connecté à votre compte.</p>'
	+'<br><p>Copyright © 2020. Powered by Inchtechs</p>';
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
        subject: 'Récupération du mot de passe', // Subject line
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