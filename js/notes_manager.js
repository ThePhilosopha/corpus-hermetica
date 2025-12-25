/**
 * NotesManager - Manage notes for sacred texts with localStorage persistence
 */
class NotesManager {
    constructor() {
        this.storageKey = 'corpus-hermetica-notes';
        this.notes = this.loadAllNotes();
    }

    /**
     * Load all notes from localStorage
     * @returns {Object} Notes object keyed by textId
     */
    loadAllNotes() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error loading notes:', e);
            return {};
        }
    }

    /**
     * Save all notes to localStorage
     */
    saveAllNotes() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
        } catch (e) {
            console.error('Error saving notes:', e);
        }
    }

    /**
     * Get notes for a specific text
     * @param {string} textId - The text identifier
     * @returns {Array} Array of note objects
     */
    getNotesForText(textId) {
        return this.notes[textId] || [];
    }

    /**
     * Add a new note for a text
     * @param {string} textId - The text identifier
     * @param {string} content - The note content
     * @param {string} chapterTitle - Optional chapter reference
     * @returns {Object} The created note
     */
    addNote(textId, content, chapterTitle = null) {
        if (!content || !content.trim()) return null;

        if (!this.notes[textId]) {
            this.notes[textId] = [];
        }

        const note = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            content: content.trim(),
            chapterTitle: chapterTitle,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes[textId].unshift(note); // Add to beginning
        this.saveAllNotes();
        return note;
    }

    /**
     * Update an existing note
     * @param {string} textId - The text identifier
     * @param {string} noteId - The note ID
     * @param {string} newContent - The updated content
     * @returns {Object|null} The updated note or null
     */
    updateNote(textId, noteId, newContent) {
        if (!this.notes[textId]) return null;

        const note = this.notes[textId].find(n => n.id === noteId);
        if (!note) return null;

        note.content = newContent.trim();
        note.updatedAt = new Date().toISOString();
        this.saveAllNotes();
        return note;
    }

    /**
     * Delete a note
     * @param {string} textId - The text identifier
     * @param {string} noteId - The note ID
     * @returns {boolean} Whether deletion was successful
     */
    deleteNote(textId, noteId) {
        if (!this.notes[textId]) return false;

        const index = this.notes[textId].findIndex(n => n.id === noteId);
        if (index === -1) return false;

        this.notes[textId].splice(index, 1);
        this.saveAllNotes();
        return true;
    }

    /**
     * Get total note count for a text
     * @param {string} textId - The text identifier
     * @returns {number} Number of notes
     */
    getNoteCount(textId) {
        return this.notes[textId]?.length || 0;
    }

    /**
     * Get total note count across all texts
     * @returns {number} Total notes
     */
    getTotalNoteCount() {
        return Object.values(this.notes).reduce((sum, notes) => sum + notes.length, 0);
    }

    /**
     * Export all notes as JSON
     * @returns {string} JSON string
     */
    exportNotes() {
        return JSON.stringify(this.notes, null, 2);
    }

    /**
     * Import notes from JSON
     * @param {string} json - JSON string of notes
     * @param {boolean} merge - Whether to merge with existing or replace
     * @returns {boolean} Whether import was successful
     */
    importNotes(json, merge = true) {
        try {
            const imported = JSON.parse(json);

            if (merge) {
                Object.keys(imported).forEach(textId => {
                    if (!this.notes[textId]) {
                        this.notes[textId] = [];
                    }
                    this.notes[textId] = [...this.notes[textId], ...imported[textId]];
                });
            } else {
                this.notes = imported;
            }

            this.saveAllNotes();
            return true;
        } catch (e) {
            console.error('Error importing notes:', e);
            return false;
        }
    }

    /**
     * Clear all notes for a text
     * @param {string} textId - The text identifier
     */
    clearNotesForText(textId) {
        delete this.notes[textId];
        this.saveAllNotes();
    }

    /**
     * Format a date for display
     * @param {string} isoDate - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(isoDate) {
        const date = new Date(isoDate);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    /**
     * Render notes as HTML
     * @param {string} textId - The text identifier
     * @returns {string} HTML string
     */
    renderNotesHtml(textId) {
        const notes = this.getNotesForText(textId);

        if (notes.length === 0) {
            return `
                <div class="notes-empty text-center py-8 text-themed-muted">
                    <p class="text-lg mb-2">📝</p>
                    <p>No notes yet.</p>
                    <p class="text-sm mt-1">Add your first note below.</p>
                </div>
            `;
        }

        return `
            <div class="notes-list space-y-4">
                ${notes.map(note => `
                    <div class="note-item p-4 bg-themed-tertiary rounded-lg group" data-note-id="${note.id}">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs text-themed-muted">${this.formatDate(note.createdAt)}</span>
                            <button 
                                onclick="window.notesManager.deleteNoteWithConfirm('${textId}', '${note.id}')"
                                class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs transition-opacity"
                            >
                                Delete
                            </button>
                        </div>
                        ${note.chapterTitle ? `<p class="text-xs text-accent-gold mb-2">${note.chapterTitle}</p>` : ''}
                        <p class="text-themed-secondary text-sm leading-relaxed">${this.escapeHtml(note.content)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Delete note with confirmation
     * @param {string} textId - The text identifier
     * @param {string} noteId - The note ID
     */
    deleteNoteWithConfirm(textId, noteId) {
        if (confirm('Delete this note?')) {
            this.deleteNote(textId, noteId);
            // Dispatch event for UI update
            window.dispatchEvent(new CustomEvent('notes-updated', { detail: { textId } }));
        }
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
window.notesManager = new NotesManager();
