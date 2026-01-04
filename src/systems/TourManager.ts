import { getGameState, updateGameState } from '../core/GameState';
import { VENUES } from '../data/Venues';

export interface RiderOption {
    id: string;
    name: string;
    effect: string;
    divaScore: number; // +Hype, -Integrity often
    cost: number;
}

export const RIDER_OPTIONS: RiderOption[] = [
    { id: 'water', name: 'Bottled Water', effect: 'No Effect', divaScore: 0, cost: 0 },
    { id: 'sushi', name: 'Sushi Platter', effect: '+5 Hype', divaScore: 5, cost: 100 },
    { id: 'champagne', name: 'Case of Champagne', effect: '+10 Hype, -5 Integrity', divaScore: 10, cost: 500 },
    { id: 'pyro', name: 'CO2 & Pyro', effect: '+20 Hype, +10 Energy cost', divaScore: 20, cost: 2000 },
    { id: 'cake', name: 'Throw Cake at Crowd', effect: '+50 Hype, -20 Integrity', divaScore: 50, cost: 500 }
];

export class TourManager {

    public getVenues() {
        return VENUES;
    }

    public performGig(venueId: string, riderIds: string[]): { success: boolean, message: string, report?: any } {
        const state = getGameState();
        const venue = VENUES.find(v => v.id === venueId);

        if (!venue) return { success: false, message: "Venue not found." };
        if (state.player.stats.fans < venue.minFans) return { success: false, message: "Not enough fans." };
        if (state.player.stats.hype < venue.hypeRequired) return { success: false, message: "Not enough hype." };
        if (state.player.stats.energy < 20) return { success: false, message: "Not enough energy (Need 20)." };

        // Process Rider
        let hypeGain = 0;
        let integrityLoss = 0;
        let cost = 0;

        riderIds.forEach(rid => {
            const opt = RIDER_OPTIONS.find(r => r.id === rid);
            if (opt) {
                hypeGain += opt.divaScore;
                if (opt.divaScore > 0) integrityLoss += (opt.divaScore / 2); // Rule of thumb
                cost += opt.cost;
            }
        });

        if (state.player.stats.cash < cost) return { success: false, message: "Cannot afford Rider." };

        // Execute Gig
        updateGameState(state => {
            state.player.stats.energy -= 20;
            state.player.stats.cash -= cost;
            state.player.stats.cash += venue.basePay;

            state.player.stats.hype = Math.min(100, state.player.stats.hype + 10 + hypeGain);
            state.player.stats.integrity = Math.max(0, state.player.stats.integrity - integrityLoss);

            // Fan Growth from Gig (Exposure)
            const exposure = venue.capacity * 0.1; // 10% conversion?
            state.player.stats.fans += Math.floor(exposure);
        });

        return {
            success: true,
            message: `Gig at ${venue.name} rocks!`,
            report: {
                earned: venue.basePay,
                fans: Math.floor(venue.capacity * 0.1),
                hype: 10 + hypeGain
            }
        };
    }
}
