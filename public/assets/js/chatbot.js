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

        appendMessage("user", "You", message);
        userInput.value = "";

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = "";

            appendMessage("bot", "Gemini ✨", ""); // Create empty bot message

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const textChunk = decoder.decode(value, { stream: true });
                botMessage += textChunk;

                updateLastMessage("bot", botMessage); // Stream update
            }
        } catch (error) {
            console.error("Streaming error:", error);
            appendMessage("error", "Error", "⚠️ AI service unavailable.");
        }
    }

    function appendMessage(type, sender, message) {
        const messageElement = document.createElement("div");
        messageElement.className = `${type}-message`;
        messageElement.innerHTML = `<b>${sender}:</b> <span class="message-content">${message}</span>`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function updateLastMessage(type, newText) {
        const lastMessage = chatBox.querySelector(`.${type}-message .message-content`);
        if (lastMessage) {
            lastMessage.textContent = newText; // Update message dynamically
        }
    }
});