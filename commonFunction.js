const nodemailer = require('nodemailer');

module.exports = {

    sendMail(email, subject, text, callback) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "",
                pass: "",
            }
        }),

            mailOptions = {
                from: '',
                to: email,
                subject: subject,
                text: text
            }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                callback(error, null);
            } else {
                console.log('Email sent: ' + info.response);
                callback(null, info)
            }
        })
    },
    getOtp: () => {
        var otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);
        return otp;
        
    }

}