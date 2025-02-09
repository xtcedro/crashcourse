import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { initAnimations } from './animations.js'; 
import { initializeChatbot } from './chatbot.js'; // ✅ Import chatbot module

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    setupNavigation();
    initAnimations();
    initializeChatbot(); // ✅ Initialize chatbot functionality
});