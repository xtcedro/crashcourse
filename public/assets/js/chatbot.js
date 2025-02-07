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
            // Open a streaming connection to the server
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            // Handle response stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = "";

            // Append an empty bot message container
            const botMessageElement = appendMessage("bot", "Gemini ✨", "");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode chunk and process
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (let line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = JSON.parse(line.replace("data: ", ""));
                        if (data.text) {
                            botMessage += data.text;
                            botMessageElement.querySelector(".bot-text").innerHTML = botMessage;
                        }
                    }
                }
            }
        } catch (error) {
            appendMessage("error", "Error", "AI service is unavailable.");
        }
    }

    // Function to append messages dynamically
    function appendMessage(type, sender, message) {
        const messageHTML = document.createElement("div");
        messageHTML.className = `${type}-message`;
        messageHTML.innerHTML = `
            <span class="${type}-label">${sender}:</span>
            <div class="${type}-text">${message}</div>
        `;
        chatBox.appendChild(messageHTML);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageHTML;
    }
});