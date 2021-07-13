const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    // let testAccount = await nodemailer.createTestAccount();

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            pool: true,
            host: "smtp.gmail.com",
            port: 465,
            secure: false,
            // Sender Email and Password
            auth: {
              user: "petersmith273322@gmail.com",
              pass: "mams9990"
            },
            tls: {
              // do not fail on invalid certs
              rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: 'petersmith273322@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully", {
            from: 'razamudassir912@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;