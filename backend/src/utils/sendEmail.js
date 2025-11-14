import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",   // Gmail SMTP — you can change if needed
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Use App Password for Gmail
            },
        });

        const mailOptions = {
            from: `"E-Griverence Hub" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("📨 Email Sent Successfully:", info.messageId);
        return info;

    } catch (error) {
        console.error("❌ Email Sending Failed:", error);
        throw new Error("Email sending failed");
    }
};
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"E-Grievance Hub" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email sending error:", error);
    }
};

export default sendEmail;
