// Contact form functionality
document.addEventListener('DOMContentLoaded', () => {
    // Function to initialize the contact form
    function initContactForm() {
        const contactContainer = document.getElementById('fixed-contact-container');
        if (contactContainer) {
            setupContactForm(contactContainer);
        }
    }

    // Function to set up the contact form event listeners and functionality
    function setupContactForm(container) {
        const form = container.querySelector('#contact-form');
        const nameInput = container.querySelector('#contact-name-input-field');
        const emailInput = container.querySelector('#contact-email-input-field');
        const messageInput = container.querySelector('#contact-message-input-field');
        const submitButton = container.querySelector('#contact-submit-button');

        if (!form) {
            console.error('Contact form not found');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset error states
            nameInput.parentElement.querySelector('.error-label').classList.add('hide');
            emailInput.parentElement.querySelector('.error-label').classList.add('hide');
            messageInput.parentElement.querySelector('.error-label').classList.add('hide');

            let isValid = true;

            // Validate name
            if (!nameInput.value.trim()) {
                nameInput.parentElement.querySelector('.error-label').classList.remove('hide');
                isValid = false;
            }

            // Validate email
            if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                emailInput.parentElement.querySelector('.error-label').classList.remove('hide');
                isValid = false;
            }

            // Validate message
            if (!messageInput.value.trim()) {
                messageInput.parentElement.querySelector('.error-label').classList.remove('hide');
                isValid = false;
            }

            if (isValid) {
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
                        // Clear form
                        form.reset();
                        submitButton.textContent = 'Sent!';
                        setTimeout(() => {
                            submitButton.textContent = 'Submit';
                            submitButton.disabled = false;
                        }, 3000);
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    submitButton.textContent = 'Error';
                    setTimeout(() => {
                        submitButton.textContent = 'Submit';
                        submitButton.disabled = false;
                    }, 3000);
                }
            }
        });

        function showError(container, show) {
            const errorLabel = container.querySelector('.error-label');
            if (errorLabel) {
                if (show) {
                    errorLabel.classList.remove('hide');
                } else {
                    errorLabel.classList.add('hide');
                }
            }
        }

        // Handle form submission
        submitButton.addEventListener('click', () => {
            if (validateForm()) {
                // Prepare email data
                const formData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim()
                };
                
                // Send email using mailto link (fallback method)
                const subject = `Portfolio Contact from ${formData.name}`;
                const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
                const mailtoLink = `mailto:graceraper@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                // Open email client
                window.open(mailtoLink, '_blank');
                
                // Show success message
                submitButton.textContent = 'Sent!';
                submitButton.style.backgroundColor = '#4CAF50';
                
                // Reset form after delay
                setTimeout(() => {
                    nameInput.value = '';
                    emailInput.value = '';
                    messageInput.value = '';
                    submitButton.textContent = 'Submit';
                    submitButton.style.backgroundColor = '';
                }, 3000);
            }
        });
        
        // Add input event listeners to clear errors when typing
        nameInput.addEventListener('input', () => showError(nameInput.parentElement, false));
        emailInput.addEventListener('input', () => showError(emailInput.parentElement, false));
        messageInput.addEventListener('input', () => showError(messageInput.parentElement, false));
    }
    
    // Initialize the contact form
    initContactForm();
});
