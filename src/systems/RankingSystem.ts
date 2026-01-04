import { getGameState } from '../core/GameState';
import { RIVALS } from '../data/Rivals';

export class RankingSystem {

    public calculateRank(): { rank: number, score: number, nearby: any[] } {
        const state = getGameState();

        // Formula: (Fans + (Cash / 10)) * (Integrity / 100) -> Actually Integrity might barely matter for DJ Mag
        // GDD Ch 8.2: "Visuals > Audio". "Marketing > Soul".
        // Let's use: Score = Fans + (Hype * 1000) + (Cash / 10)

        const score = state.player.stats.fans + (state.player.stats.hype * 1000) + (state.player.stats.cash / 10);

        // Create leaderboard
        const leaderboard = [
            { name: "You", score: score, id: 'player' },
            ...RIVALS.map(r => ({ name: r.name, score: r.baseScore + (state.world.rivalScore * (r.baseScore / 10000000)), id: r.id }))
        ];

        // Fill with dummies
        for (let i = 0; i < 96; i++) {
            leaderboard.push({ name: `DJ Generic #${i}`, score: Math.random() * 500000, id: `cpu_${i}` });
        }

        leaderboard.sort((a, b) => b.score - a.score);

        const rank = leaderboard.findIndex(x => x.id === 'player') + 1;

        // Get nearby rivals
        const nearby = leaderboard.slice(Math.max(0, rank - 3), Math.min(100, rank + 2));

        return { rank, score, nearby };
    }
}
