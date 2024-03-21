const nodemailer = require('nodemailer');

// Tạo transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tuantvph39285@fpt.edu.vn',
        pass: 'bbpa wsme qmch cxbr'
    }
});

// Hàm gửi email
function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'tuantvph39285@fpt.edu.vn',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendEmail };
