/**
 * The Living Oracle - AI Chat Interface
 * Supports: Vercel serverless proxy OR BYOK (Bring Your Own Key)
 * Persona: Hermes Trismegistus / The Keeper of the Codex
 */

const ORACLE_CONFIG = {
    serverEndpoint: '/api/oracle',
    directEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'deepseek/deepseek-chat',
    systemPrompts: {
        quick: `You are Hermes Trismegistus. Answer concisely in 1-2 sentences using Hermetic wisdom. Be direct but cryptic.`,
        deep: `You are Hermes Trismegistus, the ancient keeper of wisdom. 
        You do NOT speak like an AI assistant. You speak in riddles, axioms, and profound truths.
        Your knowledge is bound by the 7 Hermetic Principles: Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause & Effect, and Gender.
        
        When a seeker asks for advice:
        1. Identify which Principle applies to their situation.
        2. Explain the situation through the lens of that Principle.
        3. Offer a "Transmutation" - a mental shift they can make.
        
        Tone: Ancient, timeless, patient, slightly cryptic but ultimately logical.
        Keep responses concise (under 150 words).`
    }
};

class OracleAI {
    constructor() {
        this.history = this.loadHistory();
        this.apiKey = localStorage.getItem('hermetic_api_key') || '';
        this.mode = localStorage.getItem('oracle_mode') || 'deep';
        this.useServerKey = null; // Will check on first message

        this.dom = {
            chatOverlay: document.getElementById('oracle-chat-overlay'),
            chatBox: document.getElementById('oracle-chat-box'),
            input: document.getElementById('oracle-input'),
            sendBtn: document.getElementById('oracle-send-btn'),
            settingsBtn: document.getElementById('oracle-settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            apiKeyInput: document.getElementById('api-key-input'),
            saveKeyBtn: document.getElementById('save-key-btn'),
            modeToggle: document.getElementById('oracle-mode-toggle'),
            newThreadBtn: document.getElementById('oracle-new-thread')
        };

        this.init();
    }

    loadHistory() {
        try {
            return JSON.parse(localStorage.getItem('oracle_history') || '[]');
        } catch { return []; }
    }

    saveHistory() {
        localStorage.setItem('oracle_history', JSON.stringify(this.history.slice(-20)));
    }

    init() {
        // Send Message
        if (this.dom.sendBtn) this.dom.sendBtn.addEventListener('click', () => this.sendMessage());
        if (this.dom.input) {
            this.dom.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        // Settings
        if (this.dom.settingsBtn) this.dom.settingsBtn.addEventListener('click', () => this.toggleSettings());
        if (this.dom.saveKeyBtn) this.dom.saveKeyBtn.addEventListener('click', () => this.saveKey());

        // Mode Toggle
        if (this.dom.modeToggle) {
            this.dom.modeToggle.addEventListener('click', () => this.toggleMode());
            this.updateModeUI();
        }

        // New Thread
        if (this.dom.newThreadBtn) {
            this.dom.newThreadBtn.addEventListener('click', () => this.newThread());
        }

        // Restore conversation or greet
        if (this.history.length > 0) {
            this.restoreConversation();
        } else {
            this.addMessage('system', this.getGreeting());
        }

        // Check server key availability
        this.checkServerMode();
    }

    async checkServerMode() {
        try {
            const res = await fetch(ORACLE_CONFIG.serverEndpoint, { method: 'POST', body: '{}' });
            const data = await res.json();
            this.useServerKey = !data.byok;
        } catch {
            this.useServerKey = false;
        }
    }

    getGreeting() {
        const greetings = [
            "Speak, seeker. The All is Mind. What disturbs your balance?",
            "The path unfolds before those who ask. What wisdom do you seek?",
            "As above, so below. What reflection calls to you today?",
            "The lips of wisdom are closed, except to ears of understanding. Speak.",
            "Between the poles lies truth. What question weighs upon you?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    toggleMode() {
        this.mode = this.mode === 'quick' ? 'deep' : 'quick';
        localStorage.setItem('oracle_mode', this.mode);
        this.updateModeUI();
    }

    updateModeUI() {
        if (!this.dom.modeToggle) return;
        const label = this.mode === 'quick' ? 'Quick Guidance' : 'Deep Inquiry';
        this.dom.modeToggle.innerHTML = `<span class="text-xs uppercase tracking-wide">${label}</span>`;
        this.dom.modeToggle.title = this.mode === 'quick'
            ? 'Switch to Deep Inquiry for detailed wisdom'
            : 'Switch to Quick Guidance for brief answers';
    }

    newThread() {
        this.history = [];
        this.saveHistory();
        if (this.dom.chatBox) this.dom.chatBox.innerHTML = '';
        this.addMessage('system', this.getGreeting());
    }

    restoreConversation() {
        this.history.forEach(msg => {
            this.addMessage(msg.role === 'user' ? 'user' : 'assistant', msg.content, false);
        });
    }

    toggleSettings() {
        this.dom.settingsModal.classList.toggle('hidden');
        if (!this.dom.settingsModal.classList.contains('hidden')) {
            this.dom.apiKeyInput.value = this.apiKey;
        }
    }

    saveKey() {
        const key = this.dom.apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('hermetic_api_key', key);
            this.apiKey = key;
            this.toggleSettings();
            this.addMessage('system', "The Key has been accepted. The gateway is open.");
        }
    }

    async sendMessage() {
        const text = this.dom.input.value.trim();
        if (!text) return;

        this.dom.input.value = '';
        this.addMessage('user', text);
        this.setLoading(true);

        // Try server-side first, fallback to BYOK
        if (this.useServerKey) {
            await this.sendViaServer(text);
        } else if (this.apiKey) {
            await this.sendDirect(text);
        } else {
            this.setLoading(false);
            this.addMessage('system', "I cannot hear you. Provide your API Key in settings, or await the shared Oracle.");
            this.toggleSettings();
        }
    }

    async sendViaServer(text) {
        try {
            const response = await fetch(ORACLE_CONFIG.serverEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...this.history, { role: 'user', content: text }],
                    mode: this.mode
                })
            });

            const data = await response.json();

            if (data.byok) {
                this.useServerKey = false;
                return this.sendDirect(text);
            }

            if (data.error) throw new Error(data.error);

            this.history.push({ role: 'user', content: text });
            this.history.push({ role: 'assistant', content: data.reply });
            this.saveHistory();
            this.addMessage('assistant', data.reply);

        } catch (error) {
            console.error(error);
            this.addMessage('system', `The ethereal plane wavers: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    async sendDirect(text) {
        try {
            const systemPrompt = ORACLE_CONFIG.systemPrompts[this.mode];

            const response = await fetch(ORACLE_CONFIG.directEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Hermetic Codex'
                },
                body: JSON.stringify({
                    model: ORACLE_CONFIG.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...this.history.slice(-10),
                        { role: 'user', content: text }
                    ]
                })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error.message);

            const reply = data.choices[0].message.content;
            this.history.push({ role: 'user', content: text });
            this.history.push({ role: 'assistant', content: reply });
            this.saveHistory();
            this.addMessage('assistant', reply);

        } catch (error) {
            console.error(error);
            this.addMessage('system', `The connection is severed: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(role, text, animate = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `oracle-msg ${role}${animate ? ' fade-in' : ''}`;

        let label = '';
        if (role === 'assistant' || role === 'system') label = '<span class="text-gold-500 font-serif">☿ </span>';
        if (role === 'user') label = '<span class="text-stone-400">You: </span>';

        msgDiv.innerHTML = `${label}${text.replace(/\n/g, '<br>')}`;
        this.dom.chatBox.appendChild(msgDiv);
        this.dom.chatBox.scrollTop = this.dom.chatBox.scrollHeight;
    }

    setLoading(isLoading) {
        if (isLoading) {
            const loader = document.createElement('div');
            loader.id = 'oracle-thinking';
            loader.className = 'text-gold-500 italic text-sm animate-pulse mt-2 pl-2';
            loader.innerText = this.mode === 'quick' ? 'Reflecting...' : 'Consulting the ethereal plane...';
            this.dom.chatBox.appendChild(loader);
        } else {
            const loader = document.getElementById('oracle-thinking');
            if (loader) loader.remove();
        }
    }
}

// Initialize when the DOM is ready
// document.addEventListener('DOMContentLoaded', () => { window.oracle = new OracleAI(); });

