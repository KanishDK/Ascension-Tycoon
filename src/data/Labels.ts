import { Genre } from '../core/GameState';

export interface Label {
    id: string;
    name: string;
    description: string;
    preferredGenres: Genre[];
    minQuality: number; // Minimum Q to even be considered
    rejectionMsg: string;
    acceptanceMsg: string;
}

export const LABELS: Label[] = [
    {
        id: 'indie',
        name: 'Self Release (SoundCloud)',
        description: 'Upload directly to the cloud. No gatekeepers, but lower reach.',
        preferredGenres: ['Uplifting', 'Tech', 'Psy', 'Techno', 'BigRoom'],
        minQuality: 0,
        rejectionMsg: "", // Always accepted
        acceptanceMsg: "Uploaded to SoundCloud. The bots are listening."
    },
    {
        id: 'navy',
        name: 'Navy Records',
        description: 'Kig efter det næste store mainstream hit.',
        preferredGenres: ['BigRoom', 'Uplifting'],
        minQuality: 70,
        rejectionMsg: "Not enough mass appeal. We need hits, not experiments.",
        acceptanceMsg: "Welcome to the family! We've booked you a slot on A State of Commerce."
    },
    {
        id: 'dark_void',
        name: 'Dark Void',
        description: 'Only the hardest, darkest techno.',
        preferredGenres: ['Techno', 'Tech'],
        minQuality: 80,
        rejectionMsg: "Too happy. Too melodic. Get out.",
        acceptanceMsg: "The void stares back. Welcome to the underground."
    },
    {
        id: 'som',
        name: 'State of Mind',
        description: 'Pure Trance perfection.',
        preferredGenres: ['Uplifting', 'Tech', 'Psy'],
        minQuality: 90,
        rejectionMsg: "The production isn't pristine enough. Armin is disappointed.",
        acceptanceMsg: "You have found the State of Mind. A masterpiece."
    }
];

export const calculateLabelInterest = (quality: number, genre: Genre, labelId: string): { accepted: boolean, message: string } => {
    const label = LABELS.find(l => l.id === labelId);
    if (!label) return { accepted: false, message: "Label not found." };

    if (!label.preferredGenres.includes(genre)) {
        return { accepted: false, message: `Rejection: ${label.name} does not sign ${genre}.` };
    }

    if (quality < label.minQuality) {
        return { accepted: false, message: `Rejection: '${label.rejectionMsg}' (Quality: ${quality}/${label.minQuality})` };
    }

    return { accepted: true, message: `Signed! ${label.acceptanceMsg}` };
};
