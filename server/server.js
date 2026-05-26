const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Home test route
app.get("/", (req, res) => {
    res.send("AAUREX backend is running successfully.");
});

// Contact email route
app.post("/api/contact", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            role,
            enquiry,
            subject,
            message
        } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("EMAIL_USER or EMAIL_PASS missing in environment variables");
            return res.status(500).json({
                success: false,
                message: "Email configuration missing."
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email to AAUREX
        const adminMailOptions = {
            from: `"AAUREX Website" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New AAUREX Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>New Contact Form Message - AAUREX</h2>

                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                    <p><strong>Role:</strong> ${role || "Not provided"}</p>
                    <p><strong>Enquiry Type:</strong> ${enquiry || "Not provided"}</p>
                    <p><strong>Subject:</strong> ${subject}</p>

                    <hr>

                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
            `
        };

        // Auto reply to sender
        const autoReplyOptions = {
            from: `"AAUREX" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Thank you for contacting AAUREX",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Thank you for contacting AAUREX</h2>

                    <p>Dear ${name},</p>

                    <p>
                        Thank you for reaching out to AAUREX. We have received your message
                        and our team will review it shortly.
                    </p>

                    <p>
                        AAUREX is committed to advancing medical education, research,
                        workshops, conferences and innovation.
                    </p>

                    <p>
                        Regards,<br>
                        <strong>AAUREX Team</strong>
                    </p>
                </div>
            `
        };

        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(autoReplyOptions);

        console.log("Contact email sent successfully");

        return res.status(200).json({
            success: true,
            message: "Email sent successfully."
        });

    } catch (error) {
        console.error("Email sending error:", error);

        return res.status(500).json({
            success: false,
            message: "Email not sent. Please try again later."
        });
    }
});

// AI route placeholder / safe response if needed
app.post("/api/ai-chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                reply: "Please enter a message."
            });
        }

        return res.json({
            success: true,
            reply: "AAUREX Intelligence Assistant is currently being upgraded. Please contact AAUREX through the contact page for official support."
        });

    } catch (error) {
        console.error("AI route error:", error);

        return res.status(500).json({
            success: false,
            reply: "AI assistant is temporarily unavailable."
        });
    }
});

app.listen(PORT, () => {
    console.log(`AAUREX backend running on port ${PORT}`);
});
