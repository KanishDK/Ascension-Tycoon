import { getGameState } from '../core/GameState';
import { STORY_MISSIONS, DAILY_MISSIONS, ACHIEVEMENTS } from '../data/Missions';

export class MissionUI {
    private container: HTMLElement;

    constructor(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.id = 'mission-panel';
        this.container.className = 'fixed top-20 right-4 w-64 bg-black border border-gray-800 p-4 opacity-90 hidden md:block pointer-events-none';
        // Always visible on desktop? Or toggleable?
        // Let's make it togglable via Nav button, but default hidden.
        this.container.classList.add('hidden');

        parent.appendChild(this.container);

        window.addEventListener('open-missions', () => {
            this.container.classList.toggle('hidden');
            this.render();
        });

        window.addEventListener('game-tick', () => {
            if (!this.container.classList.contains('hidden')) this.render();
        });
    }

    private render() {
        const state = getGameState();
        const activeMissions = state.missions.active.map(id => {
            return [...STORY_MISSIONS, ...DAILY_MISSIONS].find(m => m.id === id);
        }).filter(m => m !== undefined);

        this.container.innerHTML = `
            <div class="border-b border-neon-blue mb-2 pb-1 flex justify-between">
                <span class="text-neon-blue font-bold tracking-widest">OBJECTIVES</span>
                <span class="text-xs text-gray-500 font-mono">DAY ${state.world.day}</span>
            </div>
            
            <div class="space-y-3">
                ${activeMissions.length === 0 ? '<div class="text-gray-500 text-sm">No active missions.</div>' : ''}
                ${activeMissions.map(m => `
                    <div class="bg-gray-900 p-2 border-l-2 ${m?.type === 'story' ? 'border-neon-pink' : 'border-green-500'}">
                        <div class="text-white text-xs font-bold uppercase mb-1">${m?.title}</div>
                        <div class="text-gray-400 text-[10px] leading-tight">${m?.description}</div>
                        <div class="mt-1 text-right text-[10px] text-neon-blue">
                            ${m?.reward.cash ? `€${m.reward.cash} ` : ''}
                            ${m?.reward.fans ? `+${m.reward.fans} Fans` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="mt-4 pt-2 border-t border-gray-800">
                <div class="text-xs text-gray-500 mb-2 uppercase">Recent Achievements</div>
                 <div class="space-y-1">
                    ${state.achievements.slice(-3).map(id => {
            const ach = ACHIEVEMENTS.find(a => a.id === id);
            return `<div class="text-[10px] text-yellow-500">🏆 ${ach?.title}</div>`;
        }).join('')}
                 </div>
            </div>
        `;
    }
}
