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
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botReply = "";

            const botMessageElement = appendMessage("bot", "Gemini ✨", "⌛ Generating response...");

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                botReply += decoder.decode(value, { stream: true });
                botMessageElement.innerHTML = `<b>Gemini ✨:</b> ${botReply}`;
            }

            if (!botReply.trim()) {
                botMessageElement.innerHTML = `<b>Gemini ✨:</b> ⚠️ No response received.`;
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            appendMessage("error", "Error", "⚠️ AI service is unavailable.");
        }
    }

    function appendMessage(type, sender, message) {
        const messageElement = document.createElement("div");
        messageElement.className = `${type}-message`;
        messageElement.innerHTML = `<b>${sender}:</b> ${message}`;

        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        return messageElement; // Return reference for updating the bot message
    }
});