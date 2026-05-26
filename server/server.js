const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
    res.send("AAUREX backend is running successfully.");
});

app.post("/api/contact", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            role,
            type,
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

        if (!process.env.RESEND_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Email service is not configured."
            });
        }

        const enquiryType = enquiry || type || "General enquiry";

        await resend.emails.send({
            from: "AAUREX Website <onboarding@resend.dev>",
            to: "aaurex.info@gmail.com",
            replyTo: email,
            subject: `New AAUREX Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>New Contact Form Message - AAUREX</h2>

                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                    <p><strong>Role:</strong> ${role || "Not provided"}</p>
                    <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
                    <p><strong>Subject:</strong> ${subject}</p>

                    <hr>

                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
            `
        });

        await resend.emails.send({
            from: "AAUREX <onboarding@resend.dev>",
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
        });

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