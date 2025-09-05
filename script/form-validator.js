/**
 * Form Validator Module
 * Système de validation avancée pour formulaire de contact
 */

class FormValidator {
    constructor() {
        this.errors = {};
        this.isValid = false;
    }

    // Validation email avancée
    validateEmail(email) {
        const errors = [];
        
        // Format de base
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.push("Format d'email invalide");
            return { isValid: false, errors };
        }

        // Domaines autorisés
        const allowedDomains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
            'icloud.com', 'protonmail.com', 'orange.fr', 'free.fr', 'sfr.fr',
            'wanadoo.fr', 'laposte.net', 'edu', 'org', 'gov'
        ];

        const domain = email.split('@')[1].toLowerCase();
        const isAllowedDomain = allowedDomains.some(allowed => 
            domain === allowed || domain.endsWith('.' + allowed)
        );

        if (!isAllowedDomain) {
            errors.push("Domaine email non autorisé");
        }

        // Emails temporaires/jetables (liste partielle)
        const tempDomains = [
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'mailinator.com', 'yopmail.com', 'throwaway.email'
        ];

        if (tempDomains.includes(domain)) {
            errors.push("Les emails temporaires ne sont pas autorisés");
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Validation nom/prénom
    validateName(name) {
        const errors = [];
        
        if (name.length < 2) {
            errors.push("Le nom doit contenir au moins 2 caractères");
        }

        if (name.length > 50) {
            errors.push("Le nom ne peut pas dépasser 50 caractères");
        }

        // Caractères autorisés : lettres, espaces, traits d'union, apostrophes
        const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
        if (!nameRegex.test(name)) {
            errors.push("Le nom ne peut contenir que des lettres, espaces, traits d'union et apostrophes");
        }

        // Pas de chiffres
        if (/\d/.test(name)) {
            errors.push("Le nom ne peut pas contenir de chiffres");
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Validation sujet
    validateSubject(subject) {
        const errors = [];
        
        if (subject.length < 5) {
            errors.push("Le sujet doit contenir au moins 5 caractères");
        }

        if (subject.length > 100) {
            errors.push("Le sujet ne peut pas dépasser 100 caractères");
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Validation message
    validateMessage(message) {
        const errors = [];
        
        if (message.length < 10) {
            errors.push("Le message doit contenir au moins 10 caractères");
        }

        if (message.length > 1000) {
            errors.push("Le message ne peut pas dépasser 1000 caractères");
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            charCount: message.length
        };
    }

    // Validation numéro de téléphone par pays
    validatePhone(phone, countryCode) {
        const errors = [];
        const cleanPhone = phone.replace(/\s+/g, '');

        const phoneRules = {
            '+33': { minLength: 10, maxLength: 10, format: /^0[1-9](\d{8})$/ }, // France
            '+1': { minLength: 10, maxLength: 10, format: /^\d{10}$/ }, // USA/Canada
            '+44': { minLength: 10, maxLength: 11, format: /^0\d{9,10}$/ }, // UK
            '+49': { minLength: 10, maxLength: 12, format: /^0\d{9,11}$/ }, // Germany
            '+34': { minLength: 9, maxLength: 9, format: /^[67]\d{8}$/ }, // Spain
            '+39': { minLength: 9, maxLength: 11, format: /^\d{9,11}$/ }, // Italy
        };

        const rule = phoneRules[countryCode];
        if (!rule) {
            errors.push("Indicatif pays non supporté");
            return { isValid: false, errors };
        }

        if (cleanPhone.length < rule.minLength || cleanPhone.length > rule.maxLength) {
            errors.push(`Le numéro doit contenir entre ${rule.minLength} et ${rule.maxLength} chiffres`);
        }

        if (!rule.format.test(cleanPhone)) {
            errors.push("Format de numéro invalide pour ce pays");
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Validation complète du formulaire
    validateForm(formData) {
        this.errors = {};
        let allValid = true;

        // Validation de chaque champ
        const emailValidation = this.validateEmail(formData.email);
        if (!emailValidation.isValid) {
            this.errors.email = emailValidation.errors;
            allValid = false;
        }

        const nameValidation = this.validateName(formData.name);
        if (!nameValidation.isValid) {
            this.errors.name = nameValidation.errors;
            allValid = false;
        }

        const subjectValidation = this.validateSubject(formData.subject);
        if (!subjectValidation.isValid) {
            this.errors.subject = subjectValidation.errors;
            allValid = false;
        }

        const messageValidation = this.validateMessage(formData.message);
        if (!messageValidation.isValid) {
            this.errors.message = messageValidation.errors;
            allValid = false;
        }

        const phoneValidation = this.validatePhone(formData.phone, formData.countryCode);
        if (!phoneValidation.isValid) {
            this.errors.phone = phoneValidation.errors;
            allValid = false;
        }

        this.isValid = allValid;
        return {
            isValid: allValid,
            errors: this.errors,
            messageCharCount: messageValidation.charCount
        };
    }

    // Obtenir les erreurs pour un champ spécifique
    getFieldErrors(fieldName) {
        return this.errors[fieldName] || [];
    }

    // Nettoyer les erreurs
    clearErrors() {
        this.errors = {};
        this.isValid = false;
    }
}

// Export de la classe
window.FormValidator = FormValidator;
