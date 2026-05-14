const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AAUREX backend is running successfully.");
});

app.post("/api/contact", async (req, res) => {
    const { name, email, role, type, subject, message } = req.body;

    if (!name || !email || !role || !type || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields."
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"AAUREX Website" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `AAUREX Contact Form - ${subject}`,
            html: `
                <div style="font-family:Arial,sans-serif;line-height:1.6;">
                    <h2>New AAUREX Website Enquiry</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Role:</strong> ${role}</p>
                    <p><strong>Enquiry Type:</strong> ${type}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
            `
        });

        await transporter.sendMail({
            from: `"AAUREX Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "AAUREX – We Received Your Message",
            html: `
                <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111;">
                    <h2 style="color:#6d1f36;">AAUREX</h2>

                    <p>Dear ${name},</p>

                    <p>
                        Thank you for contacting <strong>AAUREX</strong>
                        (Alliance for Advancement in Universal Research, Education and Excellence).
                    </p>

                    <p>
                        We have successfully received your enquiry regarding:
                        <strong>${subject}</strong>
                    </p>

                    <p>
                        Our academic and coordination team will review your message and respond within
                        <strong>24–72 hours</strong>.
                    </p>

                    <p>
                        Warm regards,<br>
                        <strong>AAUREX Team</strong><br>
                        Alliance for Advancement in Universal Research, Education and Excellence
                    </p>
                </div>
            `
        });

        res.json({
            success: true,
            message: "Message sent successfully."
        });

    } catch (error) {
        console.error("Email error:", error);

        res.status(500).json({
            success: false,
            message: "Email failed to send."
        });
    }
});

app.post("/api/ai-chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            reply: "Please enter a message."
        });
    }

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: `
You are the AAUREX Intelligence Assistant.

AAUREX stands for Alliance for Advancement in Universal Research, Education and Excellence.

AAUREX is a medical education, research, workshops, conferences, student-led learning, creative medicine and innovation platform.

You help users with:
- AAUREX information
- workshops
- conferences
- membership
- research opportunities
- medical learning explanations
- study support
- anatomy learning
- AI tools guidance

Important:
- You are educational only.
- Do not diagnose.
- Do not give treatment plans.
- If a user asks for diagnosis, emergency advice, or personal medical treatment, say they should consult a qualified healthcare professional.
- Keep answers clear, professional, helpful and student-friendly.
                    `
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        res.json({
            success: true,
            reply: response.output_text
        });

    } catch (error) {
        console.error("AI error:", error);

        res.status(500).json({
            success: false,
            reply: "AAUREX AI is currently unavailable. Please try again shortly."
        });
    }
});

app.listen(PORT, () => {
    console.log(`AAUREX backend running on http://localhost:${PORT}`);
});
