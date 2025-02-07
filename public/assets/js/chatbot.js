document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-box");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Append user message
        appendMessage("user", "You", message);
        userInput.value = "";

        try {
            // Open a streaming connection
            const eventSource = new EventSource("/api/chat");

            let botMessage = "";
            appendMessage("bot", "Gemini ✨", ""); // Empty message placeholder

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                botMessage += data.text; // Append received chunks
                updateLastMessage("bot", botMessage);
            };

            eventSource.onerror = () => {
                eventSource.close();
                console.error("Streaming error");
            };
        } catch (error) {
            appendMessage("error", "Error", "AI service is unavailable.");
        }
    }

    function appendMessage(type, sender, message) {
        const messageHTML = `
            <div class="${type}-message">
                <span class="${type}-label">${sender}:</span>
                <div class="${type}-text">${message}</div>
            </div>
        `;
        chatBox.innerHTML += messageHTML;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function updateLastMessage(type, message) {
        const lastMessage = document.querySelector(`.${type}-message:last-child .${type}-text`);
        if (lastMessage) {
            lastMessage.innerHTML = message;
        }
    }
});