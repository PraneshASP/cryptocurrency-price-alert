const nodemailer = require("nodemailer");
const config = require("../config");

module.exports = async (email, message, title) => {
  //sendEmail
  try {
    const smtpEndpoint = "smtp.sendgrid.net";

    const port = 465;

    const senderAddress = `${config.NAME} <${config.EMAIL_ADDRESS}>`;

    var toAddress = email;

    const smtpUsername = config.SENDGRID_USERNAME;

    const smtpPassword = config.SENDGRID_PASSWORD;

    var subject = title;

    var body_html = `<html>
    <p>${message}</p>
    </html>`;

    // Create the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      port: port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    // Specify the fields in the email.
    let mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };

    await transporter.sendMail(mailOptions);

    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Couldn't send email",
    };
  }
};
