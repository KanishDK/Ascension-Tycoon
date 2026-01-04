export interface Venue {
    id: string;
    name: string;
    description: string;
    minFans: number;
    capacity: number;
    basePay: number; // Base fee per gig
    hypeRequired: number; // Minimum hype to even book it
}

export const VENUES: Venue[] = [
    {
        id: 'basement',
        name: 'The Basement',
        description: 'Your friend\'s damp cellar. Smells like regret.',
        minFans: 0,
        capacity: 50,
        basePay: 50,
        hypeRequired: 0
    },
    {
        id: 'local_club',
        name: 'Neon Lounge',
        description: 'The local hotspot. Sticky floors, decent sound.',
        minFans: 1000,
        capacity: 500,
        basePay: 500,
        hypeRequired: 10
    },
    {
        id: 'warehouse',
        name: 'District 9 Warehouse',
        description: 'Illegal raves. High energy, police raids likely.',
        minFans: 10000,
        capacity: 2000,
        basePay: 2500,
        hypeRequired: 30
    },
    {
        id: 'superclub',
        name: 'Club Ether',
        description: 'Global superclub in Ibiza. VIPs only.',
        minFans: 100000,
        capacity: 5000,
        basePay: 10000,
        hypeRequired: 60
    },
    {
        id: 'festival',
        name: 'YesterdayWorld Mainstage',
        description: 'The biggest stage on Earth. Legends are made here.',
        minFans: 1000000,
        capacity: 100000,
        basePay: 500000,
        hypeRequired: 90
    }
];
