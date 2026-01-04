import { getGameState, updateGameState } from './GameState';

export class GameLoop {
    private intervalId: any;
    private readonly TICK_RATE = 1000; // 1 second ticks as per GDD 6.2

    public start() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.tick(), this.TICK_RATE);
        console.log("Game Loop Started");
    }

    public stop() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    private tick() {
        updateGameState((state) => {
            // 1. Advance Time
            state.world.day++;
            if (state.world.day > 365) {
                state.world.day = 1;
                state.world.year++;
            }

            // 2. Energy Regeneration (GDD 3.1)
            if (state.player.stats.energy < 100) {
                state.player.stats.energy = Math.min(100, state.player.stats.energy + 1);
            }

            // 3. Hype Decay (GDD 4.2)
            // "Fodre udyret" - constant decay
            if (state.player.stats.hype > 0) {
                let decay = 0.5;
                if (state.player.inventory.includes('pr_agent')) {
                    decay *= 0.5; // 50% reduction
                }

                state.player.stats.hype = Math.max(0, state.player.stats.hype - decay);
            }

            // 4. Passive Income (Streaming)
            if (state.tracks.length > 0) {
                // simple model: 1 cent per fan per day (divided by 100 maybe?)
                // GDD says "If tracks on Spotify, add cash based on fans"
                const dailyStreaming = Math.floor(state.player.stats.fans * 0.001); // 1000 fans = 1 euro/day
                if (dailyStreaming > 0) {
                    state.player.stats.cash += dailyStreaming;
                }
            }

            // 5. Rival Growth
            state.world.rivalScore += 5000; // Quantum Solar never sleeps
        });

        // Dispatch Tick Event for UI to refresh
        window.dispatchEvent(new CustomEvent('game-tick'));
    }
}
