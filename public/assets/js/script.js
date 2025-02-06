import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';

// Initialize the components and navigation bar
document.addEventListener("DOMContentLoaded", () => {
    loadHeader(); // Dynamically load the header
    loadFooter(); // Dynamically load the footer
    setupNavigation(); // Set up the navigation bar
});
