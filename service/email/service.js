const Mailgen = require("mailgen");

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "https://5df1-46-219-206-231.ngrok.io";
        break;
      case "production":
        this.link = "link for production";
        break;
      default:
        this.link = "http://127.0.0.1:3000";
        break;
    }
  }

  createTemplateEmail(name, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: "neopolitan",
      product: {
        name: "iPhonebook",
        link: this.link
      },
    });

    const email = {
      body: {
        name,
        intro: "Welcome to iPhonebook! We're very excited to have you on board.",
        action: {
          instructions: "To get started with iPhonebook, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
      };
      
      return mailGenerator.generate(email)
  }

    async sendVerifyEmail(email, verifyToken) {
        const emailHTML = this.createTemplateEmail(email, verifyToken)
        const message = {
            to: email,
            subject: 'Verify your email',
            html: emailHTML
        }
        try {
            const result = await this.sender.send(message)
            console.log(result)
            return true
        } catch (error) {
            console.log(`Ошибка ${error}`)
            return false
        }

  }
}

module.exports = EmailService
