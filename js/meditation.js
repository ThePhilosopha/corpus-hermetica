/**
 * Meditation Feature Logic
 * Handles state, timer, animations for the Divine Alignment meditation
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    const state = {
        duration: 300, // seconds (default 5m)
        theme: 'alignment', // alignment, present, unity
        currentPhase: 'setup', // setup, active, completed
        timer: null,
        timeLeft: 0,
        breathInterval: null
    };

    // --- DOM Elements ---
    const dom = {
        setupView: document.getElementById('setup-view'),
        activeView: document.getElementById('active-view'),
        completionView: document.getElementById('completion-view'),
        guideText: document.getElementById('guide-text'),
        startBtn: document.getElementById('start-btn'),
        stopBtn: document.getElementById('stop-btn'),
        durationBtns: document.querySelectorAll('.duration-btn'),
        themeBtns: document.querySelectorAll('.theme-btn'),
        progressBar: document.getElementById('progress-bar'),
        timeElapsed: document.getElementById('time-elapsed'),
        timeTotal: document.getElementById('time-total'),
        rings: [
            document.getElementById('breath-circle-1'),
            document.getElementById('breath-circle-2'),
            document.getElementById('breath-circle-3')
        ],
        canvas: document.getElementById('particles'),
        // Audio Player
        audioPlayerContainer: document.getElementById('audio-player-container'),
        youtubePlayer: document.getElementById('youtube-audio-player'),
        toggleAudioBtn: document.getElementById('toggle-audio-btn'),
        audioIconOn: document.getElementById('audio-icon-on'),
        audioIconOff: document.getElementById('audio-icon-off')
    };

    // YouTube Video URL (autoplay, start at 1418s)
    const YOUTUBE_URL = 'https://www.youtube.com/embed/pXamE8E8JZw?start=1418&autoplay=1&mute=0';

    // --- Meditation Scripts (Theme-based) ---
    const scripts = {
        alignment: [
            { pct: 0, text: "Sit comfortably. Close your eyes. Take a deep breath." },
            { pct: 0.05, text: "Inhale peace... Exhale tension." },
            { pct: 0.15, text: "Feel the ground beneath you. You are supported. You are safe." },
            { pct: 0.25, text: "Visualize a soft, golden light in the center of your chest." },
            { pct: 0.35, text: "This is your goodness. Your kindness. Let it grow." },
            { pct: 0.45, text: "Extend this light to those you love." },
            { pct: 0.55, text: "Extend this light to those who challenge you. Seek understanding." },
            { pct: 0.65, text: "Feel your connection to the Infinite. A pillar of light aligning you upwards." },
            { pct: 0.75, text: "You are a vessel of peace. You are aligned with the Higher Power." },
            { pct: 0.85, text: "Slowly bring your awareness back to this moment." },
            { pct: 0.95, text: "When you are ready, open your eyes." }
        ],
        present: [
            { pct: 0, text: "There is nowhere to go. There is only now." },
            { pct: 0.08, text: "Let go of the past. It is already gone." },
            { pct: 0.16, text: "Let go of the future. It has not yet arrived." },
            { pct: 0.24, text: "The meaning of life is to just be alive." },
            { pct: 0.32, text: "It is so plain and obvious, yet everybody rushes around..." },
            { pct: 0.40, text: "...as if it were necessary to achieve something beyond themselves." },
            { pct: 0.48, text: "Listen to the sounds around you. They are part of the music." },
            { pct: 0.56, text: "Watch your thoughts. They are just noise, like birds singing." },
            { pct: 0.64, text: "You cannot smooth rough water with a flat iron." },
            { pct: 0.72, text: "Simply observe. Simply be." },
            { pct: 0.80, text: "The point of life is always in the immediate moment." },
            { pct: 0.90, text: "You have arrived. You were always here." },
            { pct: 0.97, text: "Open your eyes. The journey continues." }
        ],
        unity: [
            { pct: 0, text: "Close your eyes. Breathe deeply." },
            { pct: 0.08, text: "Feel the air fill your lungs. The same air breathed by all living things." },
            { pct: 0.16, text: "Your skin is not a barrier. It is a bridge." },
            { pct: 0.24, text: "The atoms in your body were forged in ancient stars." },
            { pct: 0.32, text: "You are the universe experiencing itself." },
            { pct: 0.40, text: "There is no separation between you and the world." },
            { pct: 0.48, text: "Like a wave, you are distinct, yet inseparable from the ocean." },
            { pct: 0.56, text: "Every being you meet is another form of yourself." },
            { pct: 0.64, text: "Feel this connection. Let it expand." },
            { pct: 0.72, text: "The boundaries dissolve. There is only One." },
            { pct: 0.82, text: "Gently return to the sense of your own body." },
            { pct: 0.92, text: "But remember: you carry the whole universe within you." },
            { pct: 0.98, text: "Open your eyes." }
        ]
    };

    // --- Event Listeners ---

    // Theme Selection
    dom.themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active styles from all
            dom.themeBtns.forEach(b => {
                b.classList.remove('active', 'border-gold-500/50', 'bg-gold-500/10');
                b.classList.add('border-stone-700');
                b.querySelector('.text-gold-400')?.classList.replace('text-gold-400', 'text-stone-300');
            });
            // Add active styles to clicked
            btn.classList.add('active', 'border-gold-500/50', 'bg-gold-500/10');
            btn.classList.remove('border-stone-700');
            btn.querySelector('.text-stone-300')?.classList.replace('text-stone-300', 'text-gold-400');

            state.theme = btn.dataset.theme;
        });
    });

    // Duration Selection
    dom.durationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dom.durationBtns.forEach(b => {
                b.classList.remove('active', 'border-gold-500/50', 'bg-gold-500/10', 'text-gold-400');
                b.classList.add('border-stone-700', 'text-stone-500');
            });
            btn.classList.add('active', 'border-gold-500/50', 'bg-gold-500/10', 'text-gold-400');
            btn.classList.remove('border-stone-700', 'text-stone-500');

            state.duration = parseInt(btn.dataset.time);
        });
    });

    // Start
    dom.startBtn.addEventListener('click', startSession);

    // Stop
    dom.stopBtn.addEventListener('click', endSession);

    // --- Core Functions ---

    // --- Helper: Format time as M:SS ---
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function startSession() {
        state.currentPhase = 'active';
        state.timeLeft = state.duration;

        // Set initial time display
        if (dom.timeElapsed) dom.timeElapsed.textContent = '0:00';
        if (dom.timeTotal) dom.timeTotal.textContent = formatTime(state.duration);

        // Start YouTube audio
        if (dom.youtubePlayer) {
            dom.youtubePlayer.src = YOUTUBE_URL;
        }
        if (dom.audioPlayerContainer) {
            dom.audioPlayerContainer.classList.remove('hidden');
        }

        // UI Transition
        dom.setupView.classList.add('hidden');
        dom.activeView.classList.remove('hidden');
        dom.activeView.classList.add('fade-enter-active');

        // Start Loops
        runTimer();
        startBreathingAnimation();
        updateGuideText(); // Initial text
    }

    function endSession() {
        state.currentPhase = 'completed';
        clearInterval(state.timer);
        clearInterval(state.breathInterval);

        // Stop YouTube audio
        if (dom.youtubePlayer) {
            dom.youtubePlayer.src = '';
        }
        if (dom.audioPlayerContainer) {
            dom.audioPlayerContainer.classList.add('hidden');
        }

        // UI Transition
        dom.activeView.classList.add('hidden');
        dom.completionView.classList.remove('hidden');

        // Trigger generic fade in for completion
        setTimeout(() => {
            dom.completionView.classList.remove('opacity-0', 'translate-y-4');
        }, 100);
    }

    function runTimer() {
        state.timer = setInterval(() => {
            state.timeLeft--;
            const elapsed = state.duration - state.timeLeft;
            const progress = (elapsed / state.duration) * 100;

            // Update Progress Bar
            dom.progressBar.style.width = `${progress}%`;

            // Update Time Display
            if (dom.timeElapsed) dom.timeElapsed.textContent = formatTime(elapsed);

            // Update Text based on percentage
            const currentPct = elapsed / state.duration;
            updateGuideText(currentPct);

            if (state.timeLeft <= 0) {
                endSession();
            }
        }, 1000);
    }

    function updateGuideText(currentPct) {
        // Get the script for the current theme
        const currentScript = scripts[state.theme] || scripts.alignment;
        // Find the latest script step that matches current percentage
        const step = currentScript.slice().reverse().find(s => currentPct >= s.pct);

        if (step && dom.guideText.innerText !== step.text) {
            // Fade out
            dom.guideText.style.opacity = '0';
            dom.guideText.style.transform = 'translateY(10px)';

            setTimeout(() => {
                dom.guideText.innerText = step.text;
                // Fade in
                dom.guideText.style.opacity = '1';
                dom.guideText.style.transform = 'translateY(0)';
            }, 600);
        }
    }

    // --- Visual Effects ---

    function startBreathingAnimation() {
        // CSS animations are smoother for this than JS
        // We will just toggle classes to start the "breathing" cycle visual

        let exhaling = false;

        const breathe = () => {
            const scale = exhaling ? 1 : 1.5;
            const opacity = exhaling ? 0.3 : 0.1;

            dom.rings.forEach((ring, i) => {
                setTimeout(() => {
                    ring.style.transform = `scale(${scale - (i * 0.1)})`; // Staggered scale
                    ring.style.opacity = opacity;
                    ring.style.borderColor = exhaling ? 'rgba(214, 158, 46, 0.1)' : 'rgba(214, 158, 46, 0.4)';
                }, i * 200); // Stagger delay
            });

            exhaling = !exhaling;
        };

        breathe(); // Initial
        state.breathInterval = setInterval(breathe, 4000); // 4s in, 4s out = 8s cycle is slow & calming
    }

    // --- Particle System (Simple & lightweight) ---
    function initParticles() {
        const ctx = dom.canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            dom.canvas.width = width;
            dom.canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = Math.random() * 0.5 + 0.1;
                this.opacity = Math.random() * 0.5;
                this.fadeDir = Math.random() > 0.5 ? 0.01 : -0.01;
            }

            update() {
                this.y -= this.speedY; // Float up
                this.opacity += this.fadeDir;

                if (this.opacity <= 0 || this.opacity >= 0.5) {
                    this.fadeDir = -this.fadeDir;
                }

                if (this.y < 0) {
                    this.reset();
                    this.y = height + 10;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(214, 158, 46, ${Math.max(0, this.opacity)})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Init
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();
    }

    initParticles();
});
