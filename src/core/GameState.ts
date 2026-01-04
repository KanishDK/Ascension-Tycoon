export type Archetype = 'virtuoso' | 'plant';
export type Genre = 'Uplifting' | 'Tech' | 'Psy' | 'Techno' | 'BigRoom';

export interface PlayerStats {
    cash: number;
    fans: number;
    energy: number;
    hype: number; // 0-100
    integrity: number; // 0-100
    clickPower: number; // Base 1
    xp: number;
    level: number;
}

export interface Track {
    id: string;
    name: string;
    quality: number; // 0-100
    genre: Genre;
    released: boolean;
    releaseDay: number;
    revenue: number;
}

export interface GameState {
    player: {
        archetype: Archetype;
        name: string;
        tutorialStep: number; // 0 = start, 99 = done
        stats: PlayerStats;
        inventory: string[]; // IDs of gear
        prestige: {
            legacyPoints: number;
            generation: number;
        };
    };
    world: {
        day: number;
        year: number;
        rivalScore: number; // Quantum Solar's score
        labelCooldowns: Record<string, number>; // Label ID -> Day they will listen again
    };
    missions: {
        active: string[]; // IDs of currently active missions (Story + Dailies)
        completed: string[]; // IDs
        dailyRefreshDay: number; // Last day dailies were refreshed
    };
    achievements: string[]; // IDs of unlocked achievements
    rivals: Record<string, { status: 'unknown' | 'neutral' | 'enemy' | 'ally', score: number }>;
    version: number;
    production: {
        isProducing: boolean;
        kick: number; // 0-100
        synth: number; // 0-100
        fx: number; // 0-100
        targetGenre: Genre;
    };
    tracks: Track[];
    settings: {
        musicVolume: number;
        sfxVolume: number;
    };
}

export const INITIAL_STATE: GameState = {
    player: {
        archetype: 'virtuoso',
        name: 'Bedroom Producer',
        tutorialStep: 0,
        stats: {
            cash: 100, // Virtuoso start
            fans: 0,
            energy: 100,
            hype: 0,
            integrity: 100,
            clickPower: 10,
            xp: 0,
            level: 1
        },
        inventory: ['cracked_daw'],
        prestige: {
            legacyPoints: 0,
            generation: 1
        }
    },
    world: {
        day: 1,
        year: 2026,
        rivalScore: 10000000,
        labelCooldowns: {}
    },
    missions: {
        active: ['story_001'], // Start with first mission
        completed: [],
        dailyRefreshDay: 0
    },
    achievements: [],
    rivals: {
        'charlotte': { status: 'neutral', score: 1000000 },
        'armin': { status: 'neutral', score: 5000000 },
        'quantum': { status: 'enemy', score: 10000000 }
    },
    production: {
        isProducing: false,
        kick: 0,
        synth: 0,
        fx: 0,
        targetGenre: 'Tech'
    },
    tracks: [],
    settings: {
        musicVolume: 0.5,
        sfxVolume: 0.5
    }
};

let currentState = JSON.parse(JSON.stringify(INITIAL_STATE));

export const getGameState = (): GameState => currentState;
export const updateGameState = (updater: (state: GameState) => void) => {
    updater(currentState);
    // Simple state change listener trigger could go here
    window.dispatchEvent(new CustomEvent('state-updated'));
    window.dispatchEvent(new CustomEvent('state-updated'));
};

export const grantXP = (amount: number) => {
    updateGameState(state => {
        state.player.stats.xp += amount;
        const xpNeeded = state.player.stats.level * 1000;
        if (state.player.stats.xp >= xpNeeded) {
            state.player.stats.level++;
            state.player.stats.xp -= xpNeeded;
            window.dispatchEvent(new CustomEvent('game-alert', {
                detail: `LEVEL UP! \nProducer Level ${state.player.stats.level}\nNew Gear Unlocked!`
            }));
            // Ideally play a distinct sound here
        }
    });
};

export const resetGameState = (archetype: Archetype) => {
    currentState = JSON.parse(JSON.stringify(INITIAL_STATE));
    currentState.player.archetype = archetype;
    if (archetype === 'plant') {
        currentState.player.stats.cash = 10000;
        currentState.player.stats.fans = 5000;
        currentState.player.stats.integrity = 10;
        currentState.player.inventory.push('dad_credit_card');
    }
    updateGameState(() => { });
};
