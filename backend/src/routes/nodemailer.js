// const nodemailer = require("nodemailer");
// const email = process.env.EMAIL;
// const password = process.env.PASSWORD;
// function mailer(to, subject) {
//   console.log(email, password);
//   const output = "Your bid is now obsolete! Time to up the ante and bid more!";
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     service: "gmail", //
//     auth: {
//       user: process.env.EMAIL, // generated ethereal user
//       pass: process.env.PASSWORD, // generated ethereal password
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: process.env.EMAIL, // sender address
//     to: to, // list of receivers
//     subject: subject, // Subject
//     html: output,
//     // attachments: [
//     //   {
//     //     // use URL as an attachment
//     //     filename: "stc-logo.jpeg",
//     //     path: __dirname + "/stc-logo.jpeg",
//     //     cid: "stc",
//     //   },
//     // ],
//   };

//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log("mailsent");
//   });
// }

// module.exports = mailer;
