import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { initAnimations } from './animations.js'; // ✅ Import animations

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    setupNavigation();
    initAnimations(); // ✅ Initialize animations
});