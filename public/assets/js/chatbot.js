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
                body: JSON.stringify({}) // Send an empty request to trigger AI introduction
            });

            const data = await response.json();
            appendMessage("bot", "Dominguez Tech Solutions AI Assistant 🤖", data.reply);
        } catch (error) {
            console.error("Error fetching AI introduction:", error);
        }
    }

    // Append message to chatbox
    function appendMessage(type, sender, message) {
        const messageHTML = `
            <div class="${type}-message">
                <span class="${type}-label">${sender}:</span>
                <div class="${type}-text">${message}</div>
            </div>
        `;
        chatBox.innerHTML += messageHTML;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    }

    // User sends message
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
            appendMessage("bot", "Dominguez Tech Solutions AI Assistant 🤖", data.reply);
        } catch (error) {
            appendMessage("error", "Error", "AI service is unavailable.");
        }
    }

    fetchIntroduction(); // Trigger AI introduction when the chatbot loads
});