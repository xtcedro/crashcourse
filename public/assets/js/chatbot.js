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

            const data = await response.json();
            const formattedReply = renderMarkdown(data.reply); // Convert Markdown

            // Append bot response
            appendMessage("bot", "Gemini ✨", formattedReply);
        } catch (error) {
            appendMessage("error", "Error", "AI service is unavailable.");
        }
    }

    // Function to append messages dynamically
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

    // Convert Markdown to HTML (Enhanced Support)
    function renderMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold **text**
            .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic *text*
            .replace(/__(.*?)__/g, "<b>$1</b>") // Bold (Alt) __text__
            .replace(/_(.*?)_/g, "<i>$1</i>") // Italic (Alt) _text_
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<pre><code class="${lang || ''}">${escapeHTML(code.trim())}</code></pre>`;
            }) // Multi-line Code Blocks
            .replace(/`([^`]+)`/g, "<code>$1</code>") // Inline Code `text`
            .replace(/\n/g, "<br>"); // Line breaks
    }

    // Function to prevent HTML injection in code blocks
    function escapeHTML(text) {
        return text.replace(/[&<>"']/g, (char) => {
            const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
            return entities[char] || char;
        });
    }
});
