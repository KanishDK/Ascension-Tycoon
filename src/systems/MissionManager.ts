import { getGameState, updateGameState } from '../core/GameState';
import { STORY_MISSIONS, DAILY_MISSIONS, ACHIEVEMENTS, Mission } from '../data/Missions';

export class MissionManager {
    constructor() {
        this.setupListeners();
    }

    private setupListeners() {
        // Broad list of evenst to listen to
        const events = ['track-released', 'gig-complete', 'game-tick'];

        events.forEach(evt => {
            window.addEventListener(evt, (e: any) => {
                this.checkProgress(evt, e.detail);
            });
        });

        // Daily Refresh Check
        window.addEventListener('game-tick', () => {
            const state = getGameState();
            if (state.world.day > state.missions.dailyRefreshDay) {
                this.refreshDailies(state.world.day);
            }
            this.checkAchievements();
        });
    }

    private checkProgress(trigger: string, detail: any) {
        const state = getGameState();
        const activeIds = state.missions.active;

        activeIds.forEach(id => {
            const mission = [...STORY_MISSIONS, ...DAILY_MISSIONS].find(m => m.id === id);
            if (!mission) return;

            if (mission.trigger === trigger || (mission.trigger === 'game-tick' && trigger === 'game-tick')) {
                if (mission.condition(detail, state)) {
                    this.completeMission(mission);
                }
            }
        });
    }

    private completeMission(mission: Mission) {
        updateGameState(state => {
            // Remove from active
            state.missions.active = state.missions.active.filter(id => id !== mission.id);
            // Add to completed
            state.missions.completed.push(mission.id);

            // Grant Reward
            if (mission.reward.cash) state.player.stats.cash += mission.reward.cash;
            if (mission.reward.fans) state.player.stats.fans += mission.reward.fans;
            if (mission.reward.hype) state.player.stats.hype += mission.reward.hype;

            // Trigger Next Story Mission
            if (mission.nextMissionId) {
                state.missions.active.push(mission.nextMissionId);
            }
        });

        // Notify UI
        window.dispatchEvent(new CustomEvent('mission-complete', { detail: mission }));

        // Show Story Modal if applicable
        if (mission.storyText) {
            window.dispatchEvent(new CustomEvent('game-alert', {
                detail: `MISSION COMPLETE: ${mission.title}\n\n${mission.storyText}`
            }));
        } else {
            window.dispatchEvent(new CustomEvent('game-alert', { detail: `MISSION COMPLETE: ${mission.title}` }));
        }
    }

    private refreshDailies(day: number) {
        updateGameState(state => {
            state.missions.dailyRefreshDay = day;
            // Remove old dailies? Or keep them? Usually clear them.
            // Filter out old dailies from active
            state.missions.active = state.missions.active.filter(id => !id.startsWith('daily_'));

            // Pick 2 random new ones
            const pool = DAILY_MISSIONS.sort(() => 0.5 - Math.random()).slice(0, 2);
            pool.forEach(m => state.missions.active.push(m.id));
        });
        console.log("Dailies Refreshed");
    }

    private checkAchievements() {
        const state = getGameState();
        ACHIEVEMENTS.forEach(ach => {
            if (!state.achievements.includes(ach.id)) {
                if (ach.condition(state)) {
                    updateGameState(s => {
                        s.achievements.push(ach.id);
                    });
                    window.dispatchEvent(new CustomEvent('game-alert', { detail: `🏆 ACHIEVEMENT UNLOCKED: ${ach.title}\n${ach.description}` }));
                }
            }
        });
    }
}
