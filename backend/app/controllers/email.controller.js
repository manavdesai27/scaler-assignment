const sendEmail = require('../services/email.service').sendMail;

exports.sendEmail = async (req, res) => {
    const { to, message } = req.body;

    const result = await sendEmail(to, message)
    res.send(result);
}