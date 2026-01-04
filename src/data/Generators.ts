import { Genre } from '../core/GameState';

const PREFIXES = ['Quantum', 'Dark', 'Cyber', 'Neon', 'Acid', 'Lunar', 'Solar', 'Void', 'Digital', 'Analog'];
const NOUNS = ['Dreams', 'System', 'Protocol', 'Vibes', 'Transmission', 'State', 'Dimension', 'Soul', 'Pulse', 'Glitch'];
const VERBS = ['Awakening', 'Rising', 'Falling', 'Breaking', 'Connecting', 'Scanning', 'Loading', 'Crashing'];

// Satire Comments (GDD Ch 9)
const HATER_COMMENTS = [
    "My toaster makes better beats than this. 🍞",
    "Did you produce this in a dumpster? 🗑️",
    "Another preset warrior. Boring. 😴",
    "I'd rather listen to dial-up internet. 📠",
    "Refund my bandwidth. 💸",
    "Is this noise art? Because it's just noise. 📢"
];

const FAN_COMMENTS = [
    "Absolute banger! 🔥🔥🔥",
    "Take my money! 💶",
    "This touches my soul. 😭",
    "Track of the year! 🏆",
    "Waiting for the drop... OH MY GOD! 🤯",
    "Adding this to my 'Existential Crisis' playlist. 🎧"
];

const TECH_COMMENTS = [
    "The mix is clean, but where is the soul? 🎚️",
    "Kick drum needs more compression. 📉",
    "Decent synthesis, but predictable arrangement. 🎹",
    "Sounds like you used Ozone AI on default settings. 🤖"
];

export const Generators = {
    generateTrackName: (genre: Genre): string => {
        const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
        const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        return `${p} ${n}`;
    },

    generateSocialComment: (quality: number, genre: Genre): { user: string, text: string } => {
        let pool = [];
        let userType = "User";

        // Logic based on quality
        if (quality < 20) {
            pool = HATER_COMMENTS;
            userType = "HaterBot9000";
        } else if (quality > 80) {
            pool = FAN_COMMENTS;
            userType = "TranceLover2026";
        } else {
            // Mid quality - mixed bag
            pool = Math.random() > 0.5 ? HATER_COMMENTS : TECH_COMMENTS;
            userType = "BedroomCritic";
        }

        // Genre specific spice
        const text = pool[Math.floor(Math.random() * pool.length)];
        const username = `${userType}_${Math.floor(Math.random() * 999)}`;

        return { user: `@${username}`, text };
    },

    generateRivalNews: (rivalName: string): string => {
        const ACTIONS = [
            "just bought a private island.",
            "is headlining YesterdayWorld.",
            "released a 10-hour ambient track.",
            "claims they invented Techno.",
            "was seen meeting with AI developers."
        ];
        return `${rivalName} ${ACTIONS[Math.floor(Math.random() * ACTIONS.length)]}`;
    }
};
