/**
 * Contact Form Enhancement Script
 * Comprehensive form validation, rate limiting, and security features
 */

class ContactFormManager {
    constructor() {
        this.form = document.getElementById('Portfolio-Form');
        this.submitBtn = document.getElementById('submitBtn');
        this.rateLimitWarning = document.getElementById('rateLimitWarning');
        this.rateLimitTimer = document.getElementById('rateLimitTimer');
        this.successModal = document.getElementById('successModal');
        
        // Rate limiting
        this.rateLimitKey = 'lastSubmission';
        this.rateLimitDuration = 60000; // 1 minute
        this.rateLimitInterval = null;
        
        // Captcha
        this.captchaAnswer = 0;
        
        // Initialize all components
        this.init();
    }

    init() {
        console.log('ContactFormManager: Initializing...');
        this.setupCountrySelector();
        this.setupFormValidation();
        this.setupCaptcha();
        this.setupRateLimit();
        this.setupCharCounter();
        this.setupModal();
        this.bindEvents();
        console.log('ContactFormManager: Initialization complete');
    }

    setupCountrySelector() {
        const countryDropdown = document.getElementById('countryDropdown');
        const countryList = document.getElementById('countryList');
        const phoneInput = document.getElementById('phone');

        // Wait for CountryCodes to be available
        if (!window.CountryCodes) {
            console.error('CountryCodes not loaded');
            return;
        }

        // Create instance and get countries
        const countryCodes = new CountryCodes();
        const countries = countryCodes.getCountries();

        // Populate country list with correct structure
        countryList.innerHTML = countries.map(country => `
            <div class="country-item" data-code="${country.code}" data-dial="${country.dialCode}">
                <span class="country-flag">${country.flag}</span>
                <span class="country-name">${country.name}</span>
                <span class="country-dial">${country.dialCode}</span>
            </div>
        `).join('');

        // Toggle dropdown
        countryDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            countryDropdown.classList.toggle('active');
            countryList.classList.toggle('show');
        });

        // Country selection
        countryList.addEventListener('click', (e) => {
            const countryItem = e.target.closest('.country-item');
            if (countryItem) {
                const code = countryItem.dataset.code;
                const dialCode = countryItem.dataset.dial;
                const country = countries.find(c => c.code === code);
                
                if (country) {
                    // Update display
                    document.getElementById('selectedFlag').textContent = country.flag;
                    document.getElementById('selectedCode').textContent = dialCode;
                    document.getElementById('selectedName').textContent = country.name;
                    
                    // Update phone placeholder
                    phoneInput.placeholder = country.placeholder || phoneInput.placeholder;
                    
                    // Close dropdown
                    countryDropdown.classList.remove('active');
                    countryList.classList.remove('show');
                    
                    // Store selected country
                    phoneInput.dataset.country = code;
                    phoneInput.dataset.dialCode = dialCode;
                }
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.country-selector')) {
                countryDropdown.classList.remove('active');
                countryList.classList.remove('show');
            }
        });
    }

    setupFormValidation() {
        const inputs = {
            name: document.getElementById('nameInput'),
            email: document.getElementById('emailInput'),
            phone: document.getElementById('phone'),
            subject: document.getElementById('subjectInput'),
            message: document.getElementById('messageInput')
        };

        Object.keys(inputs).forEach(key => {
            const input = inputs[key];
            if (input) {
                input.addEventListener('blur', () => this.validateField(key, input));
                input.addEventListener('input', () => this.clearError(key));
            }
        });
    }

    validateField(fieldName, input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!window.FormValidator.validateName(value)) {
                    isValid = false;
                    errorMessage = 'Le nom doit contenir au moins 2 caractères et uniquement des lettres.';
                }
                break;

            case 'email':
                const emailResult = window.FormValidator.validateEmail(value);
                if (!emailResult.isValid) {
                    isValid = false;
                    errorMessage = emailResult.message;
                }
                break;

            case 'phone':
                const country = input.dataset.country || 'FR';
                if (!window.CountryCodes.validatePhone(value, country)) {
                    isValid = false;
                    errorMessage = 'Format de téléphone invalide pour ce pays.';
                }
                break;

            case 'subject':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Le sujet doit contenir au moins 3 caractères.';
                }
                
                // Check for profanity
                const subjectCheck = window.ProfanityFilter.checkText(value);
                if (!subjectCheck.isClean) {
                    isValid = false;
                    errorMessage = `Contenu inapproprié détecté. Suggestion: "${subjectCheck.cleanedText}"`;
                }
                break;

            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Le message doit contenir au moins 10 caractères.';
                } else if (value.length > 1000) {
                    isValid = false;
                    errorMessage = 'Le message ne peut pas dépasser 1000 caractères.';
                }
                
                // Check for profanity
                const messageCheck = window.ProfanityFilter.checkText(value);
                if (!messageCheck.isClean) {
                    isValid = false;
                    errorMessage = `Contenu inapproprié détecté. Veuillez réviser votre message.`;
                }
                break;
        }

        if (!isValid) {
            this.showError(fieldName, errorMessage);
            input.classList.add('error');
        } else {
            this.clearError(fieldName);
            input.classList.remove('error');
            input.classList.add('valid');
        }

        return isValid;
    }

    showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    setupCaptcha() {
        const captchaQuestion = document.getElementById('captchaQuestion');
        const captchaInput = document.getElementById('captchaInput');
        const captchaRefresh = document.getElementById('captchaRefresh');

        this.generateCaptcha();

        captchaRefresh.addEventListener('click', () => {
            this.generateCaptcha();
            captchaInput.value = '';
        });
    }

    generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        this.captchaAnswer = num1 + num2;
        
        document.getElementById('captchaQuestion').textContent = `${num1} + ${num2} = ?`;
    }

    validateCaptcha() {
        const captchaInput = document.getElementById('captchaInput');
        return parseInt(captchaInput.value) === this.captchaAnswer;
    }

    setupRateLimit() {
        this.checkRateLimit();
    }

    checkRateLimit() {
        const lastSubmission = localStorage.getItem(this.rateLimitKey);
        if (lastSubmission) {
            const timeDiff = Date.now() - parseInt(lastSubmission);
            if (timeDiff < this.rateLimitDuration) {
                this.startRateLimitTimer(this.rateLimitDuration - timeDiff);
                return false;
            }
        }
        return true;
    }

    startRateLimitTimer(remainingTime) {
        this.rateLimitWarning.style.display = 'flex';
        this.submitBtn.disabled = true;
        
        let seconds = Math.ceil(remainingTime / 1000);
        this.rateLimitTimer.textContent = seconds;
        
        this.rateLimitInterval = setInterval(() => {
            seconds--;
            this.rateLimitTimer.textContent = seconds;
            
            if (seconds <= 0) {
                this.clearRateLimit();
            }
        }, 1000);
    }

    clearRateLimit() {
        if (this.rateLimitInterval) {
            clearInterval(this.rateLimitInterval);
        }
        this.rateLimitWarning.style.display = 'none';
        this.submitBtn.disabled = false;
    }

    setupCharCounter() {
        const messageInput = document.getElementById('messageInput');
        const charCount = document.getElementById('charCount');
        
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            charCount.textContent = count;
            
            if (count > 1000) {
                charCount.style.color = '#d63031';
            } else if (count > 800) {
                charCount.style.color = '#fdcb6e';
            } else {
                charCount.style.color = 'inherit';
            }
        });
    }

    setupModal() {
        const successClose = document.getElementById('successClose');
        
        successClose.addEventListener('click', () => {
            this.hideSuccessModal();
        });
        
        // Close modal when clicking outside
        this.successModal.addEventListener('click', (e) => {
            if (e.target === this.successModal) {
                this.hideSuccessModal();
            }
        });
    }

    showSuccessModal() {
        this.successModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideSuccessModal() {
        this.successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Check rate limit
        if (!this.checkRateLimit()) {
            return;
        }
        
        // Validate all fields
        const inputs = {
            name: document.getElementById('nameInput'),
            email: document.getElementById('emailInput'),
            phone: document.getElementById('phone'),
            subject: document.getElementById('subjectInput'),
            message: document.getElementById('messageInput')
        };
        
        let isFormValid = true;
        Object.keys(inputs).forEach(key => {
            if (!this.validateField(key, inputs[key])) {
                isFormValid = false;
            }
        });
        
        // Validate captcha
        if (!this.validateCaptcha()) {
            alert('Captcha incorrect. Veuillez réessayer.');
            this.generateCaptcha();
            return;
        }
        
        // Check honeypot
        const honeypot = document.querySelector('input[name="honeypot"]');
        if (honeypot && honeypot.value) {
            // Bot detected, silently reject
            return;
        }
        
        if (!isFormValid) {
            alert('Veuillez corriger les erreurs dans le formulaire.');
            return;
        }
        
        // Submit form
        try {
            this.submitBtn.disabled = true;
            this.submitBtn.value = 'Envoi en cours...';
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: new FormData(this.form)
            });
            
            if (response.ok) {
                // Set rate limit
                localStorage.setItem(this.rateLimitKey, Date.now().toString());
                
                // Show success modal
                this.showSuccessModal();
                
                // Reset form
                this.form.reset();
                this.generateCaptcha();
                
                // Clear validation classes
                Object.values(inputs).forEach(input => {
                    input.classList.remove('valid', 'error');
                });
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
            console.error('Form submission error:', error);
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.value = 'Envoyer';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormManager();
});
