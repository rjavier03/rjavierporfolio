
// ============================================================
// RONALD JAVIER PORTFOLIO AI CHATBOT
// Gemini AI + Google Apps Script JSONP
// ============================================================


// ============================================================
// CONFIGURATION
// ============================================================

const CHATBOT_API_URL =
    "https://script.google.com/macros/s/AKfycbxuXk2EaWx0Xt16AUHdyvBalF3kyEJ9vRNGYgnHoP1SV6ARVLYa5edoQgp0LIbh2WOx/exec";


// ============================================================
// CHATBOT STATE
// ============================================================

let chatbotInitialized = false;
let chatbotBusy = false;


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// FORMAT AI MESSAGE
// ============================================================

function formatAIMessage(text) {

    if (!text) {
        return "";
    }

    let formatted = escapeHTML(text);

    // Bold markdown
    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    // Line breaks
    formatted = formatted.replace(
        /\n/g,
        "<br>"
    );

    return formatted;
}


// ============================================================
// ADD MESSAGE TO CHAT
// ============================================================

function addChatMessage(
    message,
    sender = "bot"
) {

    const messagesContainer =
        document.getElementById(
            "chatbot-messages"
        );

    if (!messagesContainer) {

        console.error(
            "chatbot-messages element not found."
        );

        return;
    }


    const messageElement =
        document.createElement("div");

    messageElement.className =
        "chatbot-message " +
        (
            sender === "user"
                ? "user-message"
                : "bot-message"
        );


    // --------------------------------------------------------
    // BOT AVATAR
    // --------------------------------------------------------

    if (sender !== "user") {

        const avatar =
            document.createElement("div");

        avatar.className =
            "message-avatar";

        avatar.textContent =
            "RJ";

        messageElement.appendChild(
            avatar
        );
    }


    // --------------------------------------------------------
    // MESSAGE CONTENT
    // --------------------------------------------------------

    const contentElement =
        document.createElement("div");

    contentElement.className =
        "message-content";


    if (sender === "user") {

        contentElement.textContent =
            message;

    } else {

        contentElement.innerHTML =
            formatAIMessage(message);

    }


    messageElement.appendChild(
        contentElement
    );


    messagesContainer.appendChild(
        messageElement
    );


    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


// ============================================================
// TYPING INDICATOR
// ============================================================

function showTypingIndicator() {

    const messagesContainer =
        document.getElementById(
            "chatbot-messages"
        );

    if (!messagesContainer) {
        return;
    }


    removeTypingIndicator();


    const typingElement =
        document.createElement("div");

    typingElement.id =
        "chatbot-typing-indicator";

    typingElement.className =
        "chatbot-message bot-message";


    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        "RJ";


    const content =
        document.createElement("div");

    content.className =
        "message-content";


    content.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;


    typingElement.appendChild(
        avatar
    );

    typingElement.appendChild(
        content
    );


    messagesContainer.appendChild(
        typingElement
    );


    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


// ============================================================
// REMOVE TYPING INDICATOR
// ============================================================

function removeTypingIndicator() {

    const typingElement =
        document.getElementById(
            "chatbot-typing-indicator"
        );

    if (typingElement) {

        typingElement.remove();

    }
}


// ============================================================
// GET PORTFOLIO DATA
// ============================================================
//
// app.js already declares:
//
// let portfolioData = {};
//
// Therefore chatbot.js must NOT declare another
// portfolioData variable.
//
// ============================================================

function getPortfolioDataForAI() {

    try {

        if (
            typeof portfolioData !== "undefined" &&
            portfolioData &&
            typeof portfolioData === "object"
        ) {

            return portfolioData;

        }

    } catch (error) {

        console.error(
            "Unable to access portfolioData:",
            error
        );

    }


    return {};
}


// ============================================================
// GEMINI REQUEST USING JSONP
// ============================================================

async function askAI(message) {
    return new Promise((resolve, reject) => {
        const callbackName =
            "geminiCallback_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 8);

        const script = document.createElement("script");

        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("AI server request timed out."));
        }, 30000);

        function cleanup() {
            clearTimeout(timeout);

            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }

            try {
                delete window[callbackName];
            } catch (error) {
                window[callbackName] = undefined;
            }
        }

        window[callbackName] = function (data) {
            cleanup();

            console.log("AI server response:", data);

            if (!data) {
                reject(new Error("Empty response from AI server."));
                return;
            }

            if (!data.success) {
                reject(
                    new Error(
                        data.error || "AI server returned an error."
                    )
                );
                return;
            }

            resolve(data.reply || "");
        };

        script.onerror = function () {
            cleanup();

            reject(
                new Error(
                    "Unable to connect to the AI server."
                )
            );
        };

        const url =
            CHATBOT_API_URL +
            "?message=" +
            encodeURIComponent(message) +
            "&callback=" +
            encodeURIComponent(callbackName);

        console.log("Sending AI request...");
        console.log("AI request URL:", url);

        script.src = url;

        document.head.appendChild(script);
    });
}

// ============================================================
// SEND MESSAGE
// ============================================================

async function sendMessage() {

    if (chatbotBusy) {
        return;
    }


    const input =
        document.getElementById(
            "chatbot-input"
        );


    if (!input) {

        console.error(
            "chatbot-input element not found."
        );

        return;
    }


    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    // --------------------------------------------------------
    // SHOW USER MESSAGE
    // --------------------------------------------------------

    addChatMessage(
        message,
        "user"
    );


    // Clear input
    input.value = "";


    // --------------------------------------------------------
    // BUSY STATE
    // --------------------------------------------------------

    chatbotBusy = true;


    const sendButton =
        document.getElementById(
            "chatbot-send"
        );


    if (sendButton) {

        sendButton.disabled =
            true;

    }


    // --------------------------------------------------------
    // TYPING
    // --------------------------------------------------------

    showTypingIndicator();


    try {

        // ----------------------------------------------------
        // CHECK PORTFOLIO DATA
        // ----------------------------------------------------

        const currentPortfolioData =
            getPortfolioDataForAI();


        if (
            !currentPortfolioData ||
            Object.keys(
                currentPortfolioData
            ).length === 0
        ) {

            throw new Error(
                "Portfolio data is not available yet."
            );

        }


        // ----------------------------------------------------
        // ASK AI
        // ----------------------------------------------------

        const reply =
            await askAI(
                message
            );


        // ----------------------------------------------------
        // DISPLAY RESPONSE
        // ----------------------------------------------------

        removeTypingIndicator();


        addChatMessage(
            reply,
            "bot"
        );


    } catch (error) {

        console.error(
            "Chatbot error:",
            error
        );


        removeTypingIndicator();


        addChatMessage(
            "Sorry, I couldn't connect to the AI assistant right now. Please try again.",
            "bot"
        );


    } finally {

        chatbotBusy =
            false;


        if (sendButton) {

            sendButton.disabled =
                false;

        }


        input.focus();

    }
}


// ============================================================
// OPEN CHATBOT
// ============================================================

function openChatbot() {

    const windowElement =
        document.getElementById(
            "chatbot-window"
        );


    if (!windowElement) {

        console.error(
            "chatbot-window element not found."
        );

        return;
    }


    windowElement.classList.add(
        "active"
    );


    const input =
        document.getElementById(
            "chatbot-input"
        );


    if (input) {

        setTimeout(
            () => {

                input.focus();

            },
            200
        );

    }
}


// ============================================================
// CLOSE CHATBOT
// ============================================================

function closeChatbot() {

    const windowElement =
        document.getElementById(
            "chatbot-window"
        );


    if (!windowElement) {
        return;
    }


    windowElement.classList.remove(
        "active"
    );
}


// ============================================================
// TOGGLE CHATBOT
// ============================================================

function toggleChatbot() {

    const windowElement =
        document.getElementById(
            "chatbot-window"
        );


    if (!windowElement) {

        console.error(
            "chatbot-window element not found."
        );

        return;
    }


    if (
        windowElement.classList.contains(
            "active"
        )
    ) {

        closeChatbot();

    } else {

        openChatbot();

    }
}


// ============================================================
// SUGGESTION BUTTON
// ============================================================

function sendSuggestion(
    message
) {

    const input =
        document.getElementById(
            "chatbot-input"
        );


    if (!input) {

        console.error(
            "chatbot-input element not found."
        );

        return;
    }


    input.value =
        message;


    sendMessage();
}


// ============================================================
// INITIALIZE CHATBOT
// ============================================================

function initializeChatbot() {

    if (chatbotInitialized) {
        return;
    }


    chatbotInitialized =
        true;


    console.log(
        "Initializing Ronald Javier Portfolio AI Chatbot..."
    );


    // --------------------------------------------------------
    // TOGGLE BUTTON
    // --------------------------------------------------------

    const openButton =
        document.getElementById(
            "chatbot-toggle"
        );


    if (openButton) {

        openButton.addEventListener(
            "click",
            toggleChatbot
        );


        console.log(
            "✓ Chatbot toggle connected."
        );

    } else {

        console.error(
            "✗ chatbot-toggle element not found."
        );

    }


    // --------------------------------------------------------
    // CLOSE BUTTON
    // --------------------------------------------------------

    const closeButton =
        document.getElementById(
            "chatbot-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeChatbot
        );


        console.log(
            "✓ Chatbot close connected."
        );

    } else {

        console.error(
            "✗ chatbot-close element not found."
        );

    }


    // --------------------------------------------------------
    // SEND BUTTON
    // --------------------------------------------------------

    const sendButton =
        document.getElementById(
            "chatbot-send"
        );


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendMessage
        );


        console.log(
            "✓ Chatbot send connected."
        );

    } else {

        console.error(
            "✗ chatbot-send element not found."
        );

    }


    // --------------------------------------------------------
    // INPUT
    // --------------------------------------------------------

    const input =
        document.getElementById(
            "chatbot-input"
        );


    if (input) {

        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );


        console.log(
            "✓ Chatbot input connected."
        );

    } else {

        console.error(
            "✗ chatbot-input element not found."
        );

    }


    // --------------------------------------------------------
    // SUGGESTION BUTTONS
    // --------------------------------------------------------

    const suggestions =
        document.querySelectorAll(
            ".suggestion-btn"
        );


    suggestions.forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    const message =
                        this.textContent.trim();


                    if (message) {

                        sendSuggestion(
                            message
                        );

                    }

                }
            );

        }
    );


    console.log(
        "✓ " +
        suggestions.length +
        " suggestion button(s) connected."
    );


    // --------------------------------------------------------
    // FINAL STATUS
    // --------------------------------------------------------

    console.log(
        "Ronald Javier Portfolio AI Chatbot initialized successfully."
    );
}


// ============================================================
// DOM READY
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChatbot
    );

} else {

    initializeChatbot();

}


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.openChatbot =
    openChatbot;

window.closeChatbot =
    closeChatbot;

window.toggleChatbot =
    toggleChatbot;

window.sendMessage =
    sendMessage;

window.sendSuggestion =
    sendSuggestion;

