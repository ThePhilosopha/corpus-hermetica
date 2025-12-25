/**
 * WordAnalyzer - Analyze word frequency in sacred texts
 */
class WordAnalyzer {
    constructor() {
        // Common words to filter out (stopwords)
        this.stopwords = new Set([
            'the', 'and', 'that', 'this', 'with', 'from', 'have', 'been',
            'were', 'they', 'their', 'what', 'when', 'where', 'which',
            'who', 'whom', 'will', 'would', 'could', 'should', 'there',
            'these', 'those', 'then', 'than', 'them', 'into', 'upon',
            'unto', 'also', 'only', 'even', 'such', 'more', 'most',
            'other', 'some', 'your', 'just', 'but', 'not', 'are', 'was',
            'for', 'all', 'can', 'had', 'her', 'him', 'his', 'how',
            'its', 'may', 'our', 'out', 'own', 'she', 'too', 'you',
            'hath', 'thou', 'thee', 'thy', 'doth', 'art', 'hast', 'shalt',
            'being', 'said', 'saith', 'unto', 'thereof', 'wherein', 'whereby'
        ]);
    }

    /**
     * Analyze word frequency in text
     * @param {string} text - The text to analyze
     * @param {boolean} includeStopwords - Whether to include common words
     * @returns {Object} Analysis results
     */
    analyze(text, includeStopwords = false) {
        if (!text) return { frequency: {}, totalWords: 0, uniqueWords: 0 };

        // Tokenize: lowercase, remove punctuation, split on whitespace
        const words = text.toLowerCase()
            .replace(/[^\w\s'-]/g, ' ')  // Keep apostrophes and hyphens within words
            .split(/\s+/)
            .filter(word => word.length > 2)  // Skip very short words
            .filter(word => !/^\d+$/.test(word));  // Skip pure numbers

        // Count frequencies
        const frequency = {};
        let totalWords = 0;

        words.forEach(word => {
            // Clean up word edges
            word = word.replace(/^['-]+|['-]+$/g, '');

            if (word.length < 3) return;
            if (!includeStopwords && this.stopwords.has(word)) return;

            frequency[word] = (frequency[word] || 0) + 1;
            totalWords++;
        });

        return {
            frequency,
            totalWords,
            uniqueWords: Object.keys(frequency).length,
            rawWordCount: words.length
        };
    }

    /**
     * Get the top N most frequent words
     * @param {Object} frequency - Word frequency object
     * @param {number} n - Number of top words to return
     * @returns {Array} Array of [word, count] pairs
     */
    getTopWords(frequency, n = 10) {
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, n);
    }

    /**
     * Count occurrences of a specific word
     * @param {Object} frequency - Word frequency object
     * @param {string} word - The word to count
     * @returns {number} Count of the word
     */
    countWord(frequency, word) {
        return frequency[word.toLowerCase()] || 0;
    }

    /**
     * Generate a word cloud data structure
     * @param {Object} frequency - Word frequency object
     * @param {number} maxWords - Maximum words to include
     * @returns {Array} Array of {word, count, size} objects
     */
    getWordCloudData(frequency, maxWords = 30) {
        const topWords = this.getTopWords(frequency, maxWords);
        if (topWords.length === 0) return [];

        const maxCount = topWords[0][1];
        const minCount = topWords[topWords.length - 1][1];
        const range = maxCount - minCount || 1;

        return topWords.map(([word, count]) => ({
            word,
            count,
            // Size from 1-5 based on relative frequency
            size: Math.ceil(((count - minCount) / range) * 4) + 1
        }));
    }

    /**
     * Get statistics about the text
     * @param {string} text - The text to analyze
     * @returns {Object} Text statistics
     */
    getStats(text) {
        if (!text) return { characters: 0, words: 0, sentences: 0, paragraphs: 0 };

        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

        return {
            characters: text.length,
            words: words.length,
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
            readingTimeMinutes: Math.ceil(words.length / 200) // ~200 words per minute
        };
    }

    /**
     * Render top words as HTML
     * @param {Array} topWords - Array from getTopWords
     * @returns {string} HTML string
     */
    renderTopWordsHtml(topWords) {
        if (!topWords || topWords.length === 0) {
            return '<p class="text-themed-muted">No significant words found.</p>';
        }

        return `
            <div class="word-frequency-list">
                ${topWords.map(([word, count], index) => `
                    <div class="word-freq-item flex justify-between items-center py-2 border-b border-themed/30">
                        <span class="word-rank text-themed-muted text-sm">${index + 1}.</span>
                        <span class="word-text font-medium">${word}</span>
                        <span class="word-count text-accent-gold font-bold">${count}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render stats as HTML
     * @param {Object} stats - Stats from getStats
     * @returns {string} HTML string
     */
    renderStatsHtml(stats) {
        return `
            <div class="text-stats grid grid-cols-2 gap-4">
                <div class="stat-item text-center p-3 bg-themed-tertiary rounded-lg">
                    <div class="stat-value text-2xl font-bold text-accent-gold">${stats.words.toLocaleString()}</div>
                    <div class="stat-label text-xs text-themed-muted uppercase">Words</div>
                </div>
                <div class="stat-item text-center p-3 bg-themed-tertiary rounded-lg">
                    <div class="stat-value text-2xl font-bold text-accent-gold">${stats.paragraphs}</div>
                    <div class="stat-label text-xs text-themed-muted uppercase">Paragraphs</div>
                </div>
                <div class="stat-item text-center p-3 bg-themed-tertiary rounded-lg">
                    <div class="stat-value text-2xl font-bold text-accent-gold">${stats.sentences}</div>
                    <div class="stat-label text-xs text-themed-muted uppercase">Sentences</div>
                </div>
                <div class="stat-item text-center p-3 bg-themed-tertiary rounded-lg">
                    <div class="stat-value text-2xl font-bold text-accent-gold">${stats.readingTimeMinutes} min</div>
                    <div class="stat-label text-xs text-themed-muted uppercase">Reading Time</div>
                </div>
            </div>
        `;
    }
}

// Export for use
window.WordAnalyzer = WordAnalyzer;
