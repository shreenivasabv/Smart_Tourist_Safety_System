const nodemailer = require("nodemailer");

const isEmailConfigured = () => Boolean(process.env.EMAIL && process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async(to,subject,text)=>{
    if (!isEmailConfigured()) {
        throw new Error("Email service is not configured. Set EMAIL and EMAIL_PASSWORD in backend/.env.");
    }

    await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject,
        text
    });

};

module.exports=sendEmail;
module.exports.isEmailConfigured=isEmailConfigured;
