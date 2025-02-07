document.addEventListener("DOMContentLoaded", function () {
    const fadeElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 }); // Triggers when 50% of the element is in view

    fadeElements.forEach(el => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", function () {
    const heroBanner = document.querySelector(".hero-banner");

    if (heroBanner) {
        heroBanner.classList.add("visible");
    }
});