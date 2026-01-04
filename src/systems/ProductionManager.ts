import { getGameState, updateGameState, grantXP, Genre } from '../core/GameState';
import { calculateQuality, calculateFanGrowth } from '../data/Formulas';

export class ProductionManager {

    public startProduction(genre: Genre) {
        updateGameState(state => {
            state.production.isProducing = true;
            state.production.targetGenre = genre;
            state.production.kick = 0;
            state.production.synth = 0;
            state.production.fx = 0;
        });
        window.dispatchEvent(new CustomEvent('production-updated'));
    }

    public produce(part: 'kick' | 'synth' | 'fx') {
        const state = getGameState();

        // Check Energy
        if (state.player.stats.energy < 2) {
            window.dispatchEvent(new CustomEvent('game-alert', { detail: 'Not enough energy!' }));
            return;
        }

        updateGameState(state => {
            state.player.stats.energy -= 2;

            // Calculate Progress
            let progress = 10 * state.player.stats.clickPower;

            // Analog Heat Bonus?
            if (state.player.inventory.includes('analog_heat')) {
                progress *= 1.10;
            }

            if (part === 'kick') state.production.kick = Math.min(100, state.production.kick + progress);
            if (part === 'synth') state.production.synth = Math.min(100, state.production.synth + progress);
            if (part === 'fx') state.production.fx = Math.min(100, state.production.fx + progress);
        });

        window.dispatchEvent(new CustomEvent('production-updated'));
    }

    public finishTrack(name: string, labelId: string) {
        const state = getGameState();
        const p = state.production;

        // Validation
        if (p.kick === 0 && p.synth === 0 && p.fx === 0) {
            // Cannot finish empty
            window.dispatchEvent(new CustomEvent('game-alert', { detail: 'Track is empty!' }));
            return;
        }

        // Calculate Quality
        const quality = calculateQuality(p.kick, p.synth, p.fx, state.player.inventory, p.targetGenre);

        import('../data/Labels').then(({ calculateLabelInterest }) => {
            // Check for low quality rejection first
            if (quality < 20) {
                const cooldown = state.world.day + 7;
                updateGameState(s => {
                    s.world.labelCooldowns[labelId] = cooldown;
                });
                window.dispatchEvent(new CustomEvent('game-alert', {
                    detail: `REJECTED by ${labelId}.\n"Quality too low."\nThey are ignoring you until Day ${cooldown}.`
                }));
                return;
            }

            // Check Cooldown
            if (state.world.labelCooldowns[labelId] && state.world.labelCooldowns[labelId] > state.world.day) {
                window.dispatchEvent(new CustomEvent('game-alert', {
                    detail: `IGNORED by ${labelId}.\nThey are still mad at you.`
                }));
                return;
            }

            const result = calculateLabelInterest(quality, p.targetGenre, labelId);

            if (!result.accepted) {
                // Rejection Penalty: 7 Days
                updateGameState(s => {
                    s.world.labelCooldowns[labelId] = s.world.day + 7;
                });
                window.dispatchEvent(new CustomEvent('game-alert', { detail: `${result.message} (Cooldown: 7 Days)` }));
                return;
            }

            // Accepted (or Self Release)
            // Calculate Fan Result
            import('../data/Formulas').then(({ calculateFanGrowth }) => {
                let fansGained = calculateFanGrowth(quality, state.player.stats.hype, p.targetGenre);

                // Label Bonus
                let cashBonus = quality * 5;
                if (labelId !== 'indie') {
                    fansGained *= 2; // Label exposure
                    cashBonus *= 2;  // Advance
                }

                updateGameState(state => {
                    state.tracks.push({
                        id: Date.now().toString(),
                        name: name || `Project ${state.tracks.length + 1} `,
                        quality: quality,
                        genre: p.targetGenre,
                        released: true,
                        releaseDay: state.world.day,
                        revenue: 0
                    });

                    state.player.stats.fans += fansGained;
                    state.player.stats.cash += cashBonus;

                    grantXP(100); // 100 XP per track

                    // Reset
                    state.production.isProducing = false;
                    state.production.kick = 0;
                    state.production.synth = 0;
                    state.production.fx = 0;
                });

                window.dispatchEvent(new CustomEvent('track-released', {
                    detail: {
                        name,
                        quality,
                        fansGained,
                        message: result.message,
                        labelId
                    }
                }));
            });
        });
    }
}
