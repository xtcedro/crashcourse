import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initializeChatbot } from './chatbot.js'; // ✅ Import chatbot module
import { fetchAppointments } from './public-appointments.js';
import { submitAppointments } from './appointment-booker.js';
import { initializeStripe, handleDonation } from './stripeHandler.js'; // ✅ Import Stripe module

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    setupNavigation();
    initAnimations();
    initializeChatbot(); // ✅ Initialize chatbot functionality
    fetchAppointments();
    submitAppointments();

    // ✅ Initialize Stripe Payment Flow
    const stripeConfig = initializeStripe(
        "pk_live_51QsBMaB2ZF7d2k3EpiLM1QRwI3s2RL2PJl57Ctkl0tAxouh6kcP9F580Iyo3eW6qVTGix5f6eQdXNHmMgOxyO2Td00KiYFudmT",
        "#card-element",
        "donation-amount",
        "donate-button",
        "payment-message"
    );

    handleDonation(stripeConfig);
});