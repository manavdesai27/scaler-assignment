const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_password'
            }
        });
    }

    sendEmail(data) {
        const formattedData = JSON.stringify(data, null, 2);
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: 'recipient@example.com',
            subject: 'JSON Data Response',
            text: `Received JSON data:\n\n${formattedData}`
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred');
                console.log(error.message);
                return process.exit(1);
            }

            console.log('Message sent successfully!');
            console.log('Server responded with "%s"', info.response);
        });
    }
}

const emailService = new EmailService();

app.use(express.json());

app.post('/sendEmail', (req, res) => {
    const data = req.body;
    emailService.sendEmail(data);
    res.json({ message: 'Email sent successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
