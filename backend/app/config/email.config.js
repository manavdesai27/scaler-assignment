const nodemailer = require('nodemailer');
const ejs = require('ejs');

const transport = nodemailer.createTransport({
    host: 'email_host',
    port: 'email_port',
    auth: {
        user: 'email_username',
        pass: 'email_password'
    }
});

const sendEmail = (receiver, subject, content) => {
    ejs.renderFile(__dirname + '../templates/welcome.ejs', { receiver, content }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: 'email_username',
                to: receiver,
                subject: subject,
                html: data
            };

            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
        }
    });
};

module.exports = {
    sendEmail
};