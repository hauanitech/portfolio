/**
 * Country Codes Database
 * Base de données des indicatifs téléphoniques et pays
 */

class CountryCodes {
    constructor() {
        this.countries = [
            {
                name: "France",
                code: "FR",
                dialCode: "+33",
                flag: "🇫🇷",
                placeholder: "01 23 45 67 89",
                format: "## ## ## ## ##"
            },
            {
                name: "United States",
                code: "US",
                dialCode: "+1",
                flag: "🇺🇸",
                placeholder: "(555) 123-4567",
                format: "(###) ###-####"
            },
            {
                name: "Canada",
                code: "CA",
                dialCode: "+1",
                flag: "🇨🇦",
                placeholder: "(555) 123-4567",
                format: "(###) ###-####"
            },
            {
                name: "United Kingdom",
                code: "GB",
                dialCode: "+44",
                flag: "🇬🇧",
                placeholder: "07123 456789",
                format: "##### ######"
            },
            {
                name: "Germany",
                code: "DE",
                dialCode: "+49",
                flag: "🇩🇪",
                placeholder: "0123 4567890",
                format: "#### #######"
            },
            {
                name: "Spain",
                code: "ES",
                dialCode: "+34",
                flag: "🇪🇸",
                placeholder: "612 34 56 78",
                format: "### ## ## ##"
            },
            {
                name: "Italy",
                code: "IT",
                dialCode: "+39",
                flag: "🇮🇹",
                placeholder: "312 345 6789",
                format: "### ### ####"
            },
            {
                name: "Switzerland",
                code: "CH",
                dialCode: "+41",
                flag: "🇨🇭",
                placeholder: "078 123 45 67",
                format: "### ### ## ##"
            },
            {
                name: "Belgium",
                code: "BE",
                dialCode: "+32",
                flag: "🇧🇪",
                placeholder: "0123 45 67 89",
                format: "#### ## ## ##"
            },
            {
                name: "Netherlands",
                code: "NL",
                dialCode: "+31",
                flag: "🇳🇱",
                placeholder: "06 12345678",
                format: "## ########"
            },
            {
                name: "Portugal",
                code: "PT",
                dialCode: "+351",
                flag: "🇵🇹",
                placeholder: "912 345 678",
                format: "### ### ###"
            },
            {
                name: "Austria",
                code: "AT",
                dialCode: "+43",
                flag: "🇦🇹",
                placeholder: "0664 123456",
                format: "#### ######"
            },
            {
                name: "Luxembourg",
                code: "LU",
                dialCode: "+352",
                flag: "🇱🇺",
                placeholder: "621 123 456",
                format: "### ### ###"
            },
            {
                name: "Monaco",
                code: "MC",
                dialCode: "+377",
                flag: "🇲🇨",
                placeholder: "06 12 34 56 78",
                format: "## ## ## ## ##"
            },
            {
                name: "Australia",
                code: "AU",
                dialCode: "+61",
                flag: "🇦🇺",
                placeholder: "0412 345 678",
                format: "#### ### ###"
            },
            {
                name: "Japan",
                code: "JP",
                dialCode: "+81",
                flag: "🇯🇵",
                placeholder: "090-1234-5678",
                format: "###-####-####"
            },
            {
                name: "South Korea",
                code: "KR",
                dialCode: "+82",
                flag: "🇰🇷",
                placeholder: "010-1234-5678",
                format: "###-####-####"
            },
            {
                name: "Brazil",
                code: "BR",
                dialCode: "+55",
                flag: "🇧🇷",
                placeholder: "(11) 99999-9999",
                format: "(##) #####-####"
            },
            {
                name: "Mexico",
                code: "MX",
                dialCode: "+52",
                flag: "🇲🇽",
                placeholder: "55 1234 5678",
                format: "## #### ####"
            },
            {
                name: "Argentina",
                code: "AR",
                dialCode: "+54",
                flag: "🇦🇷",
                placeholder: "11 1234-5678",
                format: "## ####-####"
            }
        ];
    }

    // Obtenir tous les pays
    getAllCountries() {
        return this.countries;
    }

    // Obtenir un pays par code
    getCountryByCode(code) {
        return this.countries.find(country => country.code === code);
    }

    // Obtenir un pays par indicatif
    getCountryByDialCode(dialCode) {
        return this.countries.find(country => country.dialCode === dialCode);
    }

    // Obtenir tous les pays
    getCountries() {
        return this.countries;
    }

    // Obtenir les pays par ordre alphabétique
    getCountriesAlphabetical() {
        return [...this.countries].sort((a, b) => a.name.localeCompare(b.name));
    }

    // Obtenir les pays les plus utilisés (France en premier)
    getPopularCountries() {
        const popular = ['+33', '+1', '+44', '+49', '+34', '+39'];
        const popularCountries = [];
        const otherCountries = [];

        this.countries.forEach(country => {
            if (popular.includes(country.dialCode)) {
                popularCountries.push(country);
            } else {
                otherCountries.push(country);
            }
        });

        // Trier les populaires selon l'ordre défini
        popularCountries.sort((a, b) => {
            return popular.indexOf(a.dialCode) - popular.indexOf(b.dialCode);
        });

        return [...popularCountries, ...otherCountries.sort((a, b) => a.name.localeCompare(b.name))];
    }

    // Formater un numéro selon le pays
    formatPhoneNumber(phoneNumber, countryCode) {
        const country = this.getCountryByCode(countryCode);
        if (!country) return phoneNumber;

        const cleanNumber = phoneNumber.replace(/\D/g, '');
        const format = country.format;
        let formatted = '';
        let numberIndex = 0;

        for (let i = 0; i < format.length && numberIndex < cleanNumber.length; i++) {
            if (format[i] === '#') {
                formatted += cleanNumber[numberIndex];
                numberIndex++;
            } else {
                formatted += format[i];
            }
        }

        return formatted;
    }

    // Valider un numéro selon le pays
    validatePhoneFormat(phoneNumber, dialCode) {
        const country = this.getCountryByDialCode(dialCode);
        if (!country) return false;

        const cleanNumber = phoneNumber.replace(/\D/g, '');
        const expectedLength = country.format.split('#').length - 1;
        
        return cleanNumber.length === expectedLength;
    }

    // Obtenir le placeholder selon le pays
    getPlaceholder(countryCode) {
        const country = this.getCountryByCode(countryCode);
        return country ? country.placeholder : "Numéro de téléphone";
    }
}

// Export de la classe
window.CountryCodes = CountryCodes;
