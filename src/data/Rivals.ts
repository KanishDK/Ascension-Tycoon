import { Genre } from '../core/GameState';

export interface Rival {
    id: string;
    name: string;
    title: string; // The Underground Queen, etc.
    description: string;
    unlockDay: number;
    requiredGenre?: Genre; // If they only care about one genre
    baseScore: number;
}

export const RIVALS: Rival[] = [
    {
        id: 'charlotte',
        name: 'Charlotte de Witte',
        title: 'The Techno Queen',
        description: 'Hersker over den mørke undergrund. Respekterer kun hård techno.',
        unlockDay: 0,
        requiredGenre: 'Techno',
        baseScore: 1000000
    },
    {
        id: 'armin',
        name: 'Armin van Buuren',
        title: 'The Fallen King',
        description: 'Lederen af "The Resistance". Holder fast i Trance-rødderne.',
        unlockDay: 90,
        requiredGenre: 'Uplifting',
        baseScore: 5000000
    },
    {
        id: 'quantum',
        name: 'Quantum Solar',
        title: 'The AI Overlord',
        description: 'En algoritme designet til at dominere hitlisterne. Din ultimative fjende.',
        unlockDay: 200, // Reveal day? Or encounter day
        baseScore: 10000000
    }
];
