// ======================================================
// AAUREX MAIN JAVASCRIPT SYSTEM
// Handles:
// 1. Header scroll effect
// 2. Scroll animations
// 3. Homepage AI preview buttons
// 4. Contact form backend email automation
// 5. AI Tools real backend connection
// ======================================================


// ======================================================
// LIVE RENDER BACKEND URL
// ======================================================

const BACKEND_URL = "https://aaurex.onrender.com";


// ======================================================
// MAIN PAGE INTERACTIONS
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // HEADER SCROLL EFFECT
    // ======================================================

    const header = document.querySelector(".site-header");

    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 40) {
                header.style.background = "rgba(7, 20, 38, 0.96)";
                header.style.boxShadow = "0 18px 45px rgba(0,0,0,0.35)";
            } else {
                header.style.background = "rgba(7, 20, 38, 0.86)";
                header.style.boxShadow = "none";
            }
        });
    }


    // ======================================================
    // SCROLL REVEAL ANIMATION
    // ======================================================

    const revealItems = document.querySelectorAll(
        ".impact-card, .feature-card, .split-image, .split-content, .final-cta, .story-card, .value-card, .member-card, .founder-card, .social-card"
    );

    revealItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(36px)";
        item.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, {
        threshold: 0.15
    });

    revealItems.forEach(item => revealObserver.observe(item));


    // ======================================================
    // HOMEPAGE AI PREVIEW BUTTONS
    // ======================================================

    const aiButtons = document.querySelectorAll(".ai-options button");
    const aiMessage = document.querySelector(".ai-message");

    if (aiButtons.length > 0 && aiMessage) {
        aiButtons.forEach(button => {
            button.addEventListener("click", () => {
                const text = button.innerText;

                if (text.includes("Research")) {
                    aiMessage.innerText =
                        "AAUREX supports student-led medical research, innovation projects, and collaboration with professionals and universities.";
                }

                else if (text.includes("Workshop")) {
                    aiMessage.innerText =
                        "AAUREX workshops focus on hands-on medical learning, anatomy, clinical exposure, and interactive training experiences.";
                }

                else if (text.includes("Conference")) {
                    aiMessage.innerText =
                        "AAUREX conferences bring together students, medical professionals, researchers, and universities for academic collaboration.";
                }

                else if (text.includes("Membership")) {
                    aiMessage.innerText =
                        "AAUREX membership is designed for medical students, professionals, and university collaborators interested in education and research.";
                }
            });
        });
    }


    // ======================================================
    // BUTTON HOVER FEEDBACK
    // ======================================================

    const buttons = document.querySelectorAll(".primary-btn, .secondary-btn, .header-btn");

    buttons.forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.filter = "brightness(1.08)";
        });

        button.addEventListener("mouseleave", () => {
            button.style.filter = "brightness(1)";
        });
    });


    // ======================================================
    // CONTACT FORM BACKEND EMAIL LOGIC
    // ======================================================

    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    if (contactForm && contactStatus) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const role = document.getElementById("role").value;
            const type = document.getElementById("type").value;
            const subject = document.getElementById("subject").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !role || !type || !subject || !message) {
                contactStatus.innerText = "Please complete all required fields.";
                return;
            }

            contactStatus.innerText = "Sending your message...";

            try {
                const response = await fetch(`${BACKEND_URL}/api/contact`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        role,
                        type,
                        subject,
                        message
                    })
                });

                const data = await response.json();

                if (data.success) {
                    contactStatus.innerText =
                        "Message sent successfully. Please check your email for confirmation.";

                    contactForm.reset();
                } else {
                    contactStatus.innerText =
                        data.message || "Message could not be sent. Please try again.";
                }

            } catch (error) {
                console.error("Contact Form Error:", error);

                contactStatus.innerText =
                    "Server not responding. Please make sure the Render backend is live.";
            }
        });
    }


    // ======================================================
    // AI TOOLS ENTER KEY SUPPORT
    // ======================================================

    const aiInput = document.getElementById("aiInput");

    if (aiInput) {
        aiInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                sendAIMessage();
            }
        });
    }

});


// ======================================================
// AI TOOLS PAGE: FILL PROMPT
// Used by suggestion buttons on ai-tools.html
// ======================================================

function fillPrompt(text) {
    const input = document.getElementById("aiInput");

    if (input) {
        input.value = text;
        input.focus();
    }
}


// ======================================================
// REAL AAUREX AI ASSISTANT
// Used on ai-tools.html
// ======================================================

async function sendAIMessage() {
    const input = document.getElementById("aiInput");
    const chatBody = document.getElementById("chatBody");

    if (!input || !chatBody) return;

    const message = input.value.trim();

    if (!message) return;

    const userBubble = document.createElement("div");
    userBubble.className = "user-message";
    userBubble.innerText = message;
    chatBody.appendChild(userBubble);

    input.value = "";

    const typingBubble = document.createElement("div");
    typingBubble.className = "bot-message";
    typingBubble.innerHTML = `
        <strong>AAUREX Assistant</strong>
        <p>Thinking...</p>
    `;

    chatBody.appendChild(typingBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch(`${BACKEND_URL}/api/ai-chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (data.success) {
            typingBubble.innerHTML = `
                <strong>AAUREX Assistant</strong>
                <p>${data.reply}</p>
            `;
        } else {
            typingBubble.innerHTML = `
                <strong>AAUREX Assistant</strong>
                <p>${data.reply || "AI could not respond right now."}</p>
            `;
        }

    } catch (error) {
        console.error("AI Fetch Error:", error);

        typingBubble.innerHTML = `
            <strong>AAUREX Assistant</strong>
            <p>Server not responding. Please make sure the Render backend is live.</p>
        `;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
}