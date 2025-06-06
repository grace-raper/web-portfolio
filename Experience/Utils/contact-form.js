// Contact form functionality
document.addEventListener('DOMContentLoaded', () => {
    // Function to initialize the contact form
    function initContactForm() {
        console.log('Initializing contact form...');
        // Use the static contact container
        const contactContainer = document.getElementById('fixed-contact-container');
        console.log('Contact container found:', contactContainer);
        if (contactContainer) {
            setupContactForm(contactContainer);
            console.log('Contact form setup complete');
        } else {
            console.error('Contact container not found!');
        }
    }

    // Function to set up the contact form event listeners and functionality
    function setupContactForm(container) {
        // Get form elements
        const nameInput = container.querySelector('#contact-name-input-field');
        const emailInput = container.querySelector('#contact-email-input-field');
        const messageInput = container.querySelector('#contact-message-input-field');
        const submitButton = container.querySelector('#contact-submit-button');
        
        // Social icons are already in the HTML
        
        // Form validation
        function validateForm() {
            let isValid = true;
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput.parentElement, true);
                isValid = false;
            } else {
                showError(nameInput.parentElement, false);
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                showError(emailInput.parentElement, true);
                isValid = false;
            } else {
                showError(emailInput.parentElement, false);
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput.parentElement, true);
                isValid = false;
            } else {
                showError(messageInput.parentElement, false);
            }
            
            return isValid;
        }
        
        // Show or hide error message
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
