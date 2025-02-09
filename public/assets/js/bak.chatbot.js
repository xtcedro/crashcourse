document.addEventListener("DOMContentLoaded", async () => {
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-box");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // Fetch AI introduction on page load
    async function fetchIntroduction() {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}) // Trigger AI introduction
            });

            const data = await response.json();
            appendMessage("bot", "Dominguez Tech Solutions AI Assistant 🤖", data.reply, true);
        } catch (error) {
            console.error("Error fetching AI introduction:", error);
        }
    }

    // Append messages to chatbox with typing effect
    function appendMessage(type, sender, message, isTypingEffect = false) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add(`${type}-message`);

        const senderLabel = document.createElement("span");
        senderLabel.classList.add(`${type}-label`);
        senderLabel.textContent = `${sender}:`;

        const messageText = document.createElement("div");
        messageText.classList.add(`${type}-text`);

        messageContainer.appendChild(senderLabel);
        messageContainer.appendChild(messageText);
        chatBox.appendChild(messageContainer);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll

        // Apply typing effect if enabled
        if (isTypingEffect) {
            simulateTypingEffect(message, messageText);
        } else {
            messageText.innerHTML = message;
        }
    }

    // Simulate typing effect for AI responses
    function simulateTypingEffect(message, element) {
        let index = 0;
        function typeCharacter() {
            if (index < message.length) {
                element.innerHTML += message.charAt(index);
                index++;
                setTimeout(typeCharacter, 30); // Adjust typing speed here
            }
        }
        typeCharacter();
    }

    // User sends a message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage("user", "You", message);
        userInput.value = "";

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            appendMessage("bot", "Dominguez Tech Solutions AI Assistant 🤖", data.reply, true);
        } catch (error) {
            appendMessage("error", "Error", "AI service is currently unavailable.");
        }
    }

    fetchIntroduction(); // Trigger AI introduction on chatbot load
});