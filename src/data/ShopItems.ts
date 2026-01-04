export interface ShopItem {
    id: string;
    name: string;
    type: 'gear' | 'staff' | 'lifestyle';
    cost: number;
    description: string;
    effect: (state: any) => void;
    minLevel?: number; // New Requirement
}

export const SHOP_ITEMS: ShopItem[] = [
    // GEAR
    {
        id: 'laptop_basic',
        name: 'Potato Laptop',
        type: 'gear',
        cost: 0,
        description: 'It runs... mostly.',
        effect: (s) => s.player.stats.clickPower += 0,
        minLevel: 0
    },
    {
        id: 'monitors_basic',
        name: 'Studio Monitors',
        type: 'gear',
        cost: 500,
        description: '+2 Click Power. Actually hear the bass.',
        effect: (s) => s.player.stats.clickPower += 2,
        minLevel: 1
    },
    {
        id: 'synth_analog',
        name: 'Analog Synth',
        type: 'gear',
        cost: 2000,
        description: '+5 Click Power. Warmth included.',
        effect: (s) => s.player.stats.clickPower += 5,
        minLevel: 5
    },
    {
        id: 'studio_pro',
        name: 'Pro Studio Upgrade',
        type: 'gear',
        cost: 10000,
        description: '+10 Click Power. Sound treatment is key.',
        effect: (s) => s.player.stats.clickPower += 10,
        minLevel: 8
    },

    // STAFF
    {
        id: 'manager_bob',
        name: 'Manager Bob',
        type: 'staff',
        cost: 1000, // Monthly? For now one off logic
        description: 'Auto-generates 1 Hype/day.',
        effect: (s) => { }, // Logic handled in GameLoop for staff
        minLevel: 4
    },
    {
        id: 'pr_agent',
        name: 'PR Agent',
        type: 'staff',
        cost: 5000,
        description: 'Reduces Hype Decay by 50%.',
        effect: (s) => { },
        minLevel: 7
    },

    // LIFESTYLE
    {
        id: 'coffee',
        name: 'Espresso Machine',
        type: 'lifestyle',
        cost: 200,
        description: '+10 Max Energy.',
        effect: (s) => s.player.stats.maxEnergy += 10,
        minLevel: 1
    },
    {
        id: 'yacht',
        name: 'Super Yacht',
        type: 'lifestyle',
        cost: 1000000,
        description: 'The ultimate flex. +100 Hype.',
        effect: (s) => s.player.stats.hype += 100,
        minLevel: 15
    }
];
