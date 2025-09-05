/**
 * Profanity Filter Module
 * Filtre anti-profanité pour français et anglais
 */

class ProfanityFilter {
    constructor() {
        // Mots interdits en français (liste partielle)
        this.frenchBadWords = [
            'merde', 'putain', 'connard', 'salaud', 'ordure', 'crétin',
            'imbécile', 'idiot', 'débile', 'abruti', 'con', 'conne',
            'salope', 'pute', 'bordel', 'foutre', 'chier', 'enculé'
        ];

        // Mots interdits en anglais (liste partielle)
        this.englishBadWords = [
            'damn', 'hell', 'crap', 'stupid', 'idiot', 'moron',
            'jerk', 'asshole', 'bitch', 'bastard', 'fuck', 'shit'
        ];

        // Variants leet speak
        this.leetSpeak = {
            '4': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's',
            '@': 'a', '€': 'e', '!': 'i', '$': 's', '7': 't'
        };

        // Caractères de remplacement
        this.replacementChars = ['*', '-', '_', '.', ' '];
    }

    // Normaliser le texte (supprimer leet speak et caractères spéciaux)
    normalizeText(text) {
        let normalized = text.toLowerCase();
        
        // Remplacer leet speak
        Object.keys(this.leetSpeak).forEach(leet => {
            const regex = new RegExp(leet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            normalized = normalized.replace(regex, this.leetSpeak[leet]);
        });

        // Supprimer caractères de remplacement
        this.replacementChars.forEach(char => {
            const regex = new RegExp('\\' + char, 'g');
            normalized = normalized.replace(regex, '');
        });

        return normalized;
    }

    // Vérifier si un mot est inapproprié
    isBadWord(word) {
        const normalizedWord = this.normalizeText(word);
        
        // Vérifier contre les listes française et anglaise
        const allBadWords = [...this.frenchBadWords, ...this.englishBadWords];
        
        return allBadWords.some(badWord => {
            // Correspondance exacte
            if (normalizedWord === badWord) return true;
            
            // Correspondance avec le mot contenu dans le text
            if (normalizedWord.includes(badWord) && badWord.length > 3) return true;
            
            return false;
        });
    }

    // Analyser un texte complet
    analyzeText(text) {
        const words = text.split(/\s+/);
        const badWords = [];
        const suggestions = [];

        words.forEach(word => {
            if (this.isBadWord(word)) {
                badWords.push(word);
                suggestions.push(this.getSuggestion(word));
            }
        });

        return {
            hasProfanity: badWords.length > 0,
            badWordsCount: badWords.length,
            badWords: badWords,
            suggestions: suggestions,
            severity: this.getSeverity(badWords.length)
        };
    }

    // Obtenir des suggestions de remplacement
    getSuggestion(badWord) {
        const suggestions = {
            // Français
            'merde': 'zut',
            'putain': 'bon sang',
            'connard': 'personne désagréable',
            'salaud': 'personne peu recommandable',
            'crétin': 'personne peu intelligente',
            'imbécile': 'personne peu réfléchie',
            'idiot': 'personne peu futée',
            'débile': 'personne peu judicieuse',
            'con': 'personne peu maligne',
            'bordel': 'désordre',
            
            // Anglais
            'damn': 'darn',
            'hell': 'heck',
            'crap': 'nonsense',
            'stupid': 'unwise',
            'idiot': 'unthinking person',
            'moron': 'foolish person',
            'jerk': 'unpleasant person'
        };

        const normalizedWord = this.normalizeText(badWord);
        return suggestions[normalizedWord] || 'terme plus approprié';
    }

    // Déterminer la sévérité
    getSeverity(badWordsCount) {
        if (badWordsCount === 0) return 'clean';
        if (badWordsCount === 1) return 'mild';
        if (badWordsCount <= 3) return 'moderate';
        return 'severe';
    }

    // Nettoyer le texte (remplacer les mots inappropriés)
    cleanText(text) {
        let cleanedText = text;
        const analysis = this.analyzeText(text);
        
        analysis.badWords.forEach((badWord, index) => {
            const suggestion = analysis.suggestions[index];
            const regex = new RegExp(badWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            cleanedText = cleanedText.replace(regex, `[${suggestion}]`);
        });

        return cleanedText;
    }

    // Vérifier si le texte est acceptable (moins de 2 mots inappropriés)
    isTextAcceptable(text) {
        const analysis = this.analyzeText(text);
        return analysis.badWordsCount < 2;
    }

    // Obtenir un message d'erreur personnalisé
    getErrorMessage(text) {
        const analysis = this.analyzeText(text);
        
        if (!analysis.hasProfanity) return null;

        switch (analysis.severity) {
            case 'mild':
                return `Veuillez reformuler votre message. Mot détecté: "${analysis.badWords[0]}"`;
            case 'moderate':
                return `Plusieurs termes inappropriés détectés (${analysis.badWordsCount}). Veuillez utiliser un langage plus respectueux.`;
            case 'severe':
                return `Trop de termes inappropriés détectés (${analysis.badWordsCount}). Veuillez réécrire votre message de manière professionnelle.`;
            default:
                return "Veuillez utiliser un langage approprié dans votre message.";
        }
    }

    // Obtenir des statistiques sur le texte
    getTextStats(text) {
        const analysis = this.analyzeText(text);
        const wordCount = text.split(/\s+/).length;
        const profanityRate = (analysis.badWordsCount / wordCount) * 100;

        return {
            wordCount: wordCount,
            profanityCount: analysis.badWordsCount,
            profanityRate: profanityRate.toFixed(2),
            severity: analysis.severity,
            isAcceptable: this.isTextAcceptable(text)
        };
    }
}

// Export de la classe
window.ProfanityFilter = ProfanityFilter;
