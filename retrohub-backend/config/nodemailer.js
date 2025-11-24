require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass:process.env.EMAIL_PASS, // app password for Gmail
    }
});

module.exports=transporter;