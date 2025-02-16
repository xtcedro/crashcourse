export function initializeStripe(publicKey, formSelector, amountSelector, buttonSelector, messageSelector) {
    const stripe = Stripe(publicKey);
    const elements = stripe.elements();
    const cardElement = elements.create("card");
    cardElement.mount(formSelector);

    return { stripe, cardElement, amountSelector, buttonSelector, messageSelector };
}

export async function handleDonation({ stripe, cardElement, amountSelector, buttonSelector, messageSelector }) {
    const donationForm = document.getElementById(amountSelector);
    const donateButton = document.getElementById(buttonSelector);
    const paymentMessage = document.getElementById(messageSelector);

    donationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const amount = parseFloat(donationForm.value) * 100; // Convert to cents

        if (isNaN(amount) || amount <= 0) {
            paymentMessage.textContent = "❌ Please enter a valid donation amount.";
            return;
        }

        donateButton.disabled = true;
        paymentMessage.textContent = "Processing donation...";

        try {
            const response = await fetch("/api/stripe/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount })
            });

            const { clientSecret } = await response.json();

            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            });

            if (error) {
                paymentMessage.textContent = `❌ Payment failed: ${error.message}`;
                donateButton.disabled = false;
            } else if (paymentIntent.status === "succeeded") {
                paymentMessage.textContent = "✅ Thank you for your support!";
            }
        } catch (err) {
            paymentMessage.textContent = `❌ Error: ${err.message}`;
            donateButton.disabled = false;
        }
    });
}