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

            if (!response.ok) throw new Error("Failed to connect to AI service.");

            // Read streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = "";

            const botMessageElement = appendMessage("bot", "Gemini ✨", "");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (let line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.replace("data: ", ""));
                            if (data.text) {
                                botMessage += data.text;
                                botMessageElement.querySelector(".bot-text").innerHTML = botMessage;
                            }
                        } catch (jsonError) {
                            console.warn("Skipping invalid JSON chunk:", line);
                        }
                    }
                }
            }

            // Ensure no error message is shown if response is successful
            document.querySelectorAll(".error-message").forEach(el => el.remove());

        } catch (error) {
            console.error("AI Streaming Error:", error);
            appendMessage("error", "Error", "AI service is unavailable.");
        }
    }

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