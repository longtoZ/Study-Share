import nodemailer from 'nodemailer';
import env from 'dotenv';
env.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        this.type = {
            'email_verification': {
                subject: 'Email Verification',
                html: (code) => `<p>Your verification code is: <strong>${code}</strong>. This code will expire in 2 minutes.</p>`
            },
            'password_reset': {
                subject: 'Password Reset',
                html: (code) => `<p>Your password reset code is: <strong>${code}</strong>. This code will expire in 2 minutes.</p>`
            }
        }
    }

    async sendEmail(to, code, type) {
        const mailOptions = {
            // from: process.env.EMAIL_FROM,
            to,
            subject: this.type[type].subject,
            html: this.type[type].html(code),
        };
        
        await this.transporter.sendMail(mailOptions);
    }
}

export default EmailService;