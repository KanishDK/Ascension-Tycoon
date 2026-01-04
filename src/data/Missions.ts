export interface Mission {
    id: string;
    type: 'story' | 'daily';
    title: string;
    description: string;
    trigger: string;
    condition: (detail: any, state: any) => boolean;
    reward: { cash?: number; fans?: number; hype?: number; xp?: number; unlock?: string };
    storyText?: string;
    nextMissionId?: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    condition: (state: any) => boolean;
}

// ACT 1: BEDROOM PRODUCER (Levels 1-3)
const ACT_1: Mission[] = [
    {
        id: 'story_001',
        type: 'story',
        title: 'First Contact',
        description: 'Release your first track.',
        trigger: 'track-released',
        condition: () => true,
        reward: { cash: 100, fans: 10, xp: 50 },
        storyText: "You uploaded the track. It's just a blip in the ocean of noise, but someone is listening. A cryptic message appears: 'POTENTIAL DETECTED. INITIATE UPLOAD.'",
        nextMissionId: 'story_002'
    },
    {
        id: 'story_002',
        type: 'story',
        title: 'The Glitch',
        description: 'Reach 100 Fans.',
        trigger: 'game-tick',
        condition: (d, state) => state.player.stats.fans >= 100,
        reward: { cash: 200, xp: 100 },
        storyText: "Your numbers are growing. The Algorithm has flagged you as a 'Micro-Influencer'. Keep pushing.",
        nextMissionId: 'story_003'
    },
    {
        id: 'story_003',
        type: 'story',
        title: 'Hardware Upgrade',
        description: 'Buy "Studio Monitors" from the Shop.',
        trigger: 'item-bought',
        condition: (d) => d.itemId === 'monitors_basic',
        reward: { fans: 50, xp: 150 },
        storyText: "You can finally hear the bass. The mix is cleaner. The signal is clearer.",
        nextMissionId: 'story_004'
    },
    {
        id: 'story_004',
        type: 'story',
        title: 'Genre Mastery',
        description: 'Release a "Tech" track with > 50 Quality.',
        trigger: 'track-released',
        condition: (d) => d.genre === 'Tech' && d.quality > 50,
        reward: { cash: 500, xp: 200 },
        storyText: "The subreddit is buzzing. 'Finally, real Tech Trance.' You are on the map.",
        nextMissionId: 'story_005'
    },
    {
        id: 'story_005',
        type: 'story',
        title: 'Level Up',
        description: 'Reach Producer Level 2.',
        trigger: 'game-tick',
        condition: (d, state) => state.player.stats.level >= 2,
        reward: { cash: 1000, hype: 10 },
        storyText: "ACT 1 COMPLETE. You are no longer ignorable. The local clubs are asking for your availability.",
        nextMissionId: 'story_006'
    }
];

// ACT 2: THE SCENE (Levels 4-7)
const ACT_2: Mission[] = [
    {
        id: 'story_006',
        type: 'story',
        title: 'Local Hero',
        description: 'Play a Gig at the "Local Club".',
        trigger: 'gig-complete',
        condition: (d) => d.venueId === 'local_club',
        reward: { fans: 200, xp: 300 },
        storyText: "The crowd actually danced. The adrenaline is real.",
        nextMissionId: 'story_007'
    },
    {
        id: 'story_007',
        type: 'story',
        title: 'Signed',
        description: 'Release a track on a Label (Any).',
        trigger: 'track-released',
        condition: (d) => d.label !== 'Independent',
        // Note: verify logic for checking label in track event
        reward: { cash: 2000, xp: 400 },
        storyText: "A real label. A real contract. Corporate machinery is now involved.",
        nextMissionId: 'story_008'
    },
    {
        id: 'story_008',
        type: 'story',
        title: 'Hired Gun',
        description: 'Hire a "Manager" from the Shop.',
        trigger: 'item-bought',
        condition: (d) => d.itemId === 'manager_bob',
        reward: { hype: 20, xp: 400 },
        storyText: "Bob says he can get you on the radio. He smells like cheap cologne and success.",
        nextMissionId: 'story_009'
    },
    {
        id: 'story_009',
        type: 'story',
        title: 'Viral Moment',
        description: 'Reach 50 Hype.',
        trigger: 'game-tick',
        condition: (d, state) => state.player.stats.hype >= 50,
        reward: { fans: 1000, xp: 500 },
        storyText: "You are trending. But fame has a cost. The haters are arriving.",
        nextMissionId: 'story_010'
    },
    {
        id: 'story_010',
        type: 'story',
        title: 'The Warehouse',
        description: 'Play a Gig at the "Warehouse".',
        trigger: 'gig-complete',
        condition: (d) => d.venueId === 'warehouse',
        reward: { cash: 5000, xp: 600 },
        storyText: "ACT 2 COMPLETE. The underground is yours. But the main stage awaits.",
        nextMissionId: 'story_011'
    }
];

// ACT 3: NATIONAL THREAT (Levels 8-12)
const ACT_3: Mission[] = [
    {
        id: 'story_011',
        type: 'story',
        title: 'New Gear',
        description: 'Buy the "Analog Synth" (Requires Lvl 5).',
        trigger: 'item-bought',
        condition: (d) => d.itemId === 'synth_analog',
        reward: { fans: 500, xp: 700 },
        storyText: "Warmth. Saturation. Pure analog power.",
        nextMissionId: 'story_012'
    },
    {
        id: 'story_012',
        type: 'story',
        title: 'Chart Topper',
        description: 'Reach Rank 500 or better.',
        trigger: 'game-tick',
        condition: (d, state) => state.player.stats.fans >= 10000, // Approx rank proxy
        reward: { cash: 10000, xp: 800 },
        storyText: "Top 500. You are now officially a 'B-Lister'.",
        nextMissionId: 'story_013'
    },
    {
        id: 'story_013',
        type: 'story',
        title: 'The Rival',
        description: 'Beat Charlotte to a Venue (Coming Soon). For now, get 20k Fans.',
        trigger: 'game-tick',
        condition: (d, state) => state.player.stats.fans >= 20000,
        reward: { hype: 50, xp: 900 },
        storyText: "She noticed you. 'Cute track,' she tweeted. It was an insult.",
        nextMissionId: 'story_014'
    },
    {
        id: 'story_014',
        type: 'story',
        title: 'Sell Out?',
        description: 'Reach €50,000 Cash.',
        trigger: 'game-tick',
        condition: (d, state) => state.player.stats.cash >= 50000,
        reward: { xp: 1000 },
        storyText: "Money changes everything. Do you buy a yacht, or better plugins?",
        nextMissionId: 'story_015'
    },
    {
        id: 'story_015',
        type: 'story',
        title: 'Festival Season',
        description: 'Play a Gig at the "Festival".',
        trigger: 'gig-complete',
        condition: (d) => d.venueId === 'festival',
        reward: { fans: 10000, xp: 1500 },
        storyText: "ACT 3 COMPLETE. Main stage. Pyrotechnics. The roar of the crowd is deafening.",
        nextMissionId: 'story_016'
    }
];

// ACT 4: GLOBAL ICON
const ACT_4: Mission[] = [
    { id: 'story_016', type: 'story', title: 'Global Tour', description: 'Reach 100k Fans.', trigger: 'game-tick', condition: (d, s) => s.player.stats.fans >= 100000, reward: { cash: 100000, xp: 2000 }, storyText: "World Tour confirmed.", nextMissionId: 'story_017' },
    { id: 'story_017', type: 'story', title: 'No More Limits', description: 'Reach Level 10.', trigger: 'game-tick', condition: (d, s) => s.player.stats.level >= 10, reward: { hype: 100, xp: 2500 }, storyText: "You are a machine.", nextMissionId: 'story_018' },
    { id: 'story_018', type: 'story', title: 'Millionaire', description: 'Earn €1,000,000.', trigger: 'game-tick', condition: (d, s) => s.player.stats.cash >= 1000000, reward: { fans: 50000, xp: 3000 }, storyText: "The 1%.", nextMissionId: 'story_019' },
    { id: 'story_019', type: 'story', title: 'The Throne', description: 'Reach Rank #1 (Approx 1M Fans).', trigger: 'game-tick', condition: (d, s) => s.player.stats.fans >= 1000000, reward: { cash: 5000000, xp: 5000 }, storyText: "You are the King of Trance.", nextMissionId: 'story_020' },
    { id: 'story_020', type: 'story', title: 'Ascension', description: 'Prestige (Reset the Game).', trigger: 'prestige', condition: () => false, reward: { xp: 10000 }, storyText: "The Simulation Ends. Reboot?", nextMissionId: undefined }
];


export const STORY_MISSIONS: Mission[] = [...ACT_1, ...ACT_2, ...ACT_3, ...ACT_4];

export const DAILY_MISSIONS: Mission[] = [
    { id: 'daily_prod_kick', type: 'daily', title: 'Daily Grind: Kicks', description: 'Produce Kicks 50 times.', trigger: 'game-tick', condition: () => false, reward: { cash: 100 } }, // Placeholder for complex logic
    { id: 'daily_release_tech', type: 'daily', title: 'Market Demand: Tech', description: 'Release a Tech genre track.', trigger: 'track-released', condition: (d) => d.genre === 'Tech', reward: { cash: 300, xp: 50 } },
    { id: 'daily_earn_cash', type: 'daily', title: 'Hustle', description: 'Have > €1,000 cash on hand.', trigger: 'game-tick', condition: (d, state) => state.player.stats.cash >= 1000, reward: { fans: 50, xp: 50 } }
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'ach_first_k', title: 'Kilo-Fan', description: 'Reach 1,000 Fans', condition: (s) => s.player.stats.fans >= 1000 },
    { id: 'ach_millionaire', title: 'Millionaire', description: 'Hold €1,000,000', condition: (s) => s.player.stats.cash >= 1000000 },
    { id: 'ach_sellout', title: 'Corporate Shill', description: 'Reach 0 Integrity', condition: (s) => s.player.stats.integrity <= 0 },
    { id: 'ach_purist', title: 'Underground God', description: 'Reach 100 Integrity & 500k Fans', condition: (s) => s.player.stats.integrity >= 100 && s.player.stats.fans >= 500000 }
];
