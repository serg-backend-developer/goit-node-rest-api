import nodemailer from 'nodemailer';

const mailTransporter = nodemailer.createTransport({
    host: process.env.UKR_EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.UKR_EMAIL_KEY,
    },
});

export async function sendMail({ recipient, title, content }) {
    try {
        const info = await mailTransporter.sendMail({
            from: process.env.EMAIL,
            to: recipient,
            subject: title,
            text: content,
        });

        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email.');
    }
}
