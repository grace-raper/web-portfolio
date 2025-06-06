// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    // Function to set up the contact form event listeners and functionality
    function setupContactForm(form) {
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Validate form
            const nameInput = form.querySelector('input[name="name"]');
            const emailInput = form.querySelector('input[name="email"]');
            const messageInput = form.querySelector('textarea[name="message"]');

            let isValid = true;

            // Clear previous error states
            const errorLabels = form.querySelectorAll('.error-label');
            errorLabels.forEach(label => label.classList.add('hide'));

            // Validate name
            if (!nameInput.value.trim()) {
                nameInput.parentElement.querySelector('.error-label').classList.remove('hide');
                isValid = false;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                emailInput.parentElement.querySelector('.error-label').classList.remove('hide');
                isValid = false;
            }

            // Validate message
            if (!messageInput.value.trim()) {
                messageInput.parentElement.querySelector('.error-label').classList.remove('hide');
                isValid = false;
            }

            if (!isValid) return;

            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success state
                    submitButton.textContent = 'Sent!';
                    form.reset();
                    setTimeout(() => {
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
                submitButton.textContent = 'Error - Try Again';
                submitButton.disabled = false;
            }
        });

        // Add input event listeners to clear errors when typing
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const messageInput = form.querySelector('textarea[name="message"]');

        if (nameInput) nameInput.addEventListener('input', () => {
            const errorLabel = nameInput.parentElement.querySelector('.error-label');
            if (errorLabel) errorLabel.classList.add('hide');
        });

        if (emailInput) emailInput.addEventListener('input', () => {
            const errorLabel = emailInput.parentElement.querySelector('.error-label');
            if (errorLabel) errorLabel.classList.add('hide');
        });

        if (messageInput) messageInput.addEventListener('input', () => {
            const errorLabel = messageInput.parentElement.querySelector('.error-label');
            if (errorLabel) errorLabel.classList.add('hide');
        });
    }

    // Initialize both desktop and mobile contact forms
    function initContactForms() {
        // Setup fixed contact form
        const fixedContactForm = document.getElementById('contact-form');
        if (fixedContactForm) {
            setupContactForm(fixedContactForm);
        }

        // Setup mobile contact form
        const mobileContactForm = document.getElementById('mobile-contact-form');
        if (mobileContactForm) {
            setupContactForm(mobileContactForm);
        }
    }

    // Initialize the contact forms
    initContactForms();
});
