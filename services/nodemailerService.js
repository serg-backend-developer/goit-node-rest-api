import nodemailer from 'nodemailer';

export async function sendEmailTo(to, subject, text) {
    try {
        const mailTransporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const info = await mailTransporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
        });

        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email.');
    }
}
