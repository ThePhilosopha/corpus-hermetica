/**
 * TextSearchEngine - Search within sacred texts with highlighting
 */
class TextSearchEngine {
    constructor() {
        this.currentResults = [];
        this.currentIndex = -1;
    }

    /**
     * Search for a query in the given text content
     * @param {string} text - The full text to search
     * @param {string} query - The search query
     * @returns {Array} Array of match objects with context
     */
    search(text, query) {
        if (!query || query.length < 2) return [];

        this.currentResults = [];
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const contextSize = 60; // Characters of context around match

        let startIndex = 0;
        let matchIndex;

        while ((matchIndex = lowerText.indexOf(lowerQuery, startIndex)) !== -1) {
            // Get context around the match
            const contextStart = Math.max(0, matchIndex - contextSize);
            const contextEnd = Math.min(text.length, matchIndex + query.length + contextSize);

            const prefix = contextStart > 0 ? '...' : '';
            const suffix = contextEnd < text.length ? '...' : '';

            const before = text.slice(contextStart, matchIndex);
            const match = text.slice(matchIndex, matchIndex + query.length);
            const after = text.slice(matchIndex + query.length, contextEnd);

            this.currentResults.push({
                index: matchIndex,
                match: match,
                context: prefix + before + match + after + suffix,
                contextHtml: `${prefix}${this.escapeHtml(before)}<mark class="search-highlight">${this.escapeHtml(match)}</mark>${this.escapeHtml(after)}${suffix}`
            });

            startIndex = matchIndex + 1;
        }

        this.currentIndex = this.currentResults.length > 0 ? 0 : -1;
        return this.currentResults;
    }

    /**
     * Get the count of matches
     */
    getMatchCount() {
        return this.currentResults.length;
    }

    /**
     * Navigate to next result
     */
    nextResult() {
        if (this.currentResults.length === 0) return null;
        this.currentIndex = (this.currentIndex + 1) % this.currentResults.length;
        return this.currentResults[this.currentIndex];
    }

    /**
     * Navigate to previous result
     */
    prevResult() {
        if (this.currentResults.length === 0) return null;
        this.currentIndex = (this.currentIndex - 1 + this.currentResults.length) % this.currentResults.length;
        return this.currentResults[this.currentIndex];
    }

    /**
     * Highlight all occurrences in an HTML string
     * @param {string} html - The HTML content
     * @param {string} query - The search query
     * @returns {string} HTML with highlighted matches
     */
    highlightInHtml(html, query) {
        if (!query || query.length < 2) return html;

        // Use regex for case-insensitive replacement
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');

        return html.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Clear search state
     */
    clear() {
        this.currentResults = [];
        this.currentIndex = -1;
    }
}

// Export for use
window.TextSearchEngine = TextSearchEngine;
