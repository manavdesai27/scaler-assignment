const nodemailer = require('nodemailer');
const transporter = require('../config/email.config').transporter;

exports.sendMail = async (to, message) => {
    const options = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject: 'Booking Confirmation',
        text: `Hello ${message.data.email}, \n 
            Your booking has been confirmed from ${message.data.checkIn} to ${message.data.checkOut} with Room ${message.data.roomId} and the billed cost is \$${message.data.price}.\n Thanks and Regards.
        `,
    }
    const promise = new Promise ((res, rej) => {
        transporter.sendMail(options, (error, info) => {
            if (error) rej(error)
            else res(info)
        })
    })
    return promise    
};