import nodemailer from "nodemailer";


console.log(process.env.NODEMAILER_USER, "process.env.NODEMAILER_USER");

class EmailService {
  constructor(config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    }
  }) {
    this.transporter = nodemailer.createTransport(config);
  }

  async send(options) {
    options = {
      ...{
        from: '"Hello My friend 👻" <sanjarbekweb@gmail.com>', // sender address
        to: "sanjarmacbook@gmail.com", // list of receivers
        subject: "Want to hack you by stealing your money", // Subject line
        text: "Qonday bo'lar ekan, Bos shu linkmi jaliq", // plain text body
        html: "<a href='#'><b>Hello world?</b></a>", // html body
      }, ...options,
    }
    const info = await this.transporter.sendMail(options);
    // console.log("Message sent: %s", info.messageId, info);
    return info;
  }
}
let emailService = new EmailService()
export default emailService;