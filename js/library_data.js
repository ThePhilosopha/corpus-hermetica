window.libraryData = [
    {
        id: "emerald-tablets",
        title: "The Emerald Tablets of Thoth",
        author: "Thoth the Atlantean (trans. Doreal)",
        category: "hermetic",
        description: "Ancient Atlantean wisdom recording the mysteries of life, death, and the cosmos.",
        content: [
            {
                title: "Tablet I: The History of Thoth, The Atlantean",
                text: "I, Thoth, the Atlantean, master of mysteries, keeper of records, mighty king, magician, living from generation to generation, being about to pass from this life into the halls of Amenti, set down for the guidance of those that are to come after me, these records of the mighty wisdom of ancient Atlantis.\n\nIn the great city of Keor, on the island of Undal, in a time far past, I began this incarnation. Not as the little men of the present age, did the mighty men of Atlantis live and die, but rather from aeon to aeon did they renew their life in the Halls of Amenti, where the river of life flows eternally onward.\n\nA hundred times ten have I descended the dark way that led into Light, and as many times have I ascended to the light from the darkness. My strength and power are from the Light, from the Wisdom that dwelleth in me, and from the knowledge that flows from the heart of the great ONE."
            },
            {
                title: "Tablet II: The Halls of Amenti",
                text: "Deep in the heart of the Earth lie the Halls of Amenti, far 'neath the islands of sunken Atlantis, Halls of the Dead and halls of the living, bathed in the fire of the infinite ALL. Far in a past time, lost in the mists of time, the Children of Light looked down on the world.\n\nSeeing the children of men in their bondage, bound by the force that came down from the outer, came they, the great ones, with the Word of the Power. Deep in the Earth's heart are they dwelling, the Flowers of Fire, the Life and the Light."
            },
            {
                title: "Tablet III: The Key of Wisdom",
                text: "Listen, O Man, to the deep wisdom I give, so that by it, ye too may live and be free. For there are many paths to the Light, and many ways to the wisdom, but only one path leads to the heart of the ALL.\n\nKnow ye, O Man, that all that exists is but a manifestation of the ALL, and that the ALL is in all, and all is in the ALL. For the ALL is the source of all, and all returns to the ALL."
            },
            {
                title: "Tablet IV: The Space Born",
                text: "Listen, O Man, to the voice of wisdom, listen to the voice of Thoth, the Atlantean. I tell you of the Space Born, the Lords of the cycles, the ones who came from the stars.\n\nIn the far past, when Atlantis was yet in its prime, there came to us beings from beyond the stars, beings of light and of wisdom, beings of power and of might."
            },
            {
                title: "Tablet V: The Key of Magic",
                text: "Listen, O Man, to the voice of magic, the voice of Thoth, the Atlantean. I tell you of the power that lies within, the power that can change the world.\n\nFor magic is not a thing of spells and of charms, but a power of the will, a power of the mind, a power of the spirit. It is the power to manifest, the power to create, the power to transform."
            }
        ]
    },
    {
        id: "kybalion",
        title: "The Kybalion",
        author: "The Three Initiates (1908)",
        category: "hermetic",
        source: "sacred-texts.com",
        description: "A study of the Hermetic Philosophy of Ancient Egypt and Greece, presenting the Seven Hermetic Principles that form the foundation of all occult teachings.",
        dataFile: "js/texts/kybalion.js",
        get content() {
            return window.textData?.['kybalion']?.content || [];
        }
    },
    {
        id: "corpus-hermeticum",
        title: "Corpus Hermeticum",
        author: "Hermes Trismegistus",
        category: "hermetic",
        description: "The core documents of the Hermetic tradition.",
        content: [
            {
                title: "Book I: Poemandres, the Shepherd of Men",
                text: "1. It chanced once on a time my mind was meditating on the things that are, my thought was raised to a great height, the senses of my body being held back.\n\nMethought a Being more than vast, in size beyond all bounds, called out my name and saith: \"What wouldst thou hear and see, and what hast thou in mind to learn and know?\"\n\n2. And I do say: \"Who art thou?\" He saith: \"I am Man-Shepherd (Poemandres), Mind of all-masterhood; I know what thou desirest and I'm with thee everywhere.\"\n\n3. I reply: \"I long to learn the things that are, and comprehend their nature, and know God.\" He answered: \"Hold in thy mind all thou wouldst know, and I will teach thee.\"\n\n4. E'en with these words His aspect changed, and straightway, in the twinkling of an eye, all things were opened to me, and I see a Vision limitless, all things turned into Light - sweet, joyous Light. And I became transported as I gazed."
            }
        ]
    },
    // New Sacred Texts - loaded from external files
    {
        id: "divine-pymander",
        title: "The Divine Pymander",
        author: "Hermes Mercurius Trismegistus (trans. John Everard, 1650)",
        category: "hermetic",
        source: "sacred-texts.com",
        description: "The foundational Hermetic text, comprising dialogues between Hermes and the Divine Mind, revealing the nature of God, creation, and the path to immortality.",
        dataFile: "js/texts/divine_pymander.js",
        get content() {
            return window.textData?.['divine-pymander']?.content || [];
        }
    },
    {
        id: "teachings-zoroaster",
        title: "The Teachings of Zoroaster",
        author: "Zoroaster (compiled by S.A. Kapadia, 1905)",
        category: "zoroastrian",
        source: "sacred-texts.com",
        description: "Essential teachings from the Prophet Zoroaster, including prayers, hymns, and wisdom from the Avesta. The religion of Good Thoughts, Good Words, and Good Deeds.",
        dataFile: "js/texts/teachings_zoroaster.js",
        get content() {
            return window.textData?.['teachings-zoroaster']?.content || [];
        }
    },
    {
        id: "unkulunkulu",
        title: "Unkulunkulu: Traditions of the Amazulu",
        author: "Collected by Henry Callaway (1870)",
        category: "african",
        source: "sacred-texts.com",
        description: "The creation traditions of the Amazulu people of South Africa, featuring Unkulunkulu (the First Ancestor), the Amatongo (ancestor spirits), and the origin of death.",
        dataFile: "js/texts/unkulunkulu.js",
        get content() {
            return window.textData?.['unkulunkulu']?.content || [];
        }
    },
    {
        id: "eternalised-hermeticism",
        title: "Hermeticism: The Ancient Wisdom of Hermes Trismegistus",
        author: "Eternalised",
        category: "hermetic",
        source: "eternalisedofficial.com",
        description: "A comprehensive exploration of Hermetic teachings, covering the legendary figure of Hermes Trismegistus, the Corpus Hermeticum, gnosis, the Hermetic universe, and the spiritual path to divine union.",
        dataFile: "js/texts/eternalised_hermeticism.js",
        get content() {
            return window.textData?.['eternalised-hermeticism']?.content || [];
        }
    }
];

// Category metadata for UI
window.libraryCategories = {
    all: { name: "All Texts", icon: "📚" },
    hermetic: { name: "Hermetic", icon: "⚗️", color: "#d69e2e" },
    gnostic: { name: "Gnostic", icon: "✨", color: "#9f7aea" },
    zoroastrian: { name: "Zoroastrian", icon: "🔥", color: "#ed8936" },
    african: { name: "African Wisdom", icon: "🌍", color: "#48bb78" }
};
