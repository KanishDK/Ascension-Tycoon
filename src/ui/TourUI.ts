import { getGameState } from '../core/GameState';
import { TourManager, RIDER_OPTIONS } from '../systems/TourManager';
import { RankingSystem } from '../systems/RankingSystem';

export class TourUI {
    private container: HTMLElement;
    private manager: TourManager;
    private ranking: RankingSystem;

    constructor(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.className = 'w-full h-full p-4 bg-dark-bg text-cyan-500 overflow-y-auto hidden';
        parent.appendChild(this.container);

        this.manager = new TourManager();
        this.ranking = new RankingSystem();

        this.render();

        window.addEventListener('game-tick', () => this.updateStatus());
    }

    public show() {
        this.container.classList.remove('hidden');
        this.render(); // Refresh list
    }

    public hide() {
        this.container.classList.add('hidden');
    }

    private render() {
        this.container.innerHTML = `
             <div class="mb-6 border-b border-neon-green pb-2 opacity-90 flex justify-between">
                <div class="text-2xl font-cyber uppercase tracking-widest text-white">World Tour</div>
                <div id="tour-status" class="text-neon-green font-mono"></div>
            </div>

            <div class="flex gap-6">
                <!-- Venues List -->
                <div class="w-2/3">
                    <h3 class="text-white font-bold mb-4 uppercase">Available Venues</h3>
                    <div id="venue-list" class="flex flex-col gap-4"></div>
                </div>

                <!-- Side Panel: Stats & Rider -->
                <div class="w-1/3 flex flex-col gap-6">
                    
                    <!-- Top 100 Projection -->
                    <div class="p-4 border border-neon-pink bg-black">
                        <h3 class="text-neon-pink font-bold mb-2 uppercase">DJ Mag Projection</h3>
                        <div id="rank-projection" class="text-3xl font-mono text-white mb-2">#-</div>
                        <div class="text-xs text-gray-400">Rankings updated daily.</div>
                    </div>

                    <!-- Rider Configuration -->
                    <div class="p-4 border border-neon-blue bg-black">
                        <h3 class="text-neon-blue font-bold mb-2 uppercase">The Rider</h3>
                        <div id="rider-options" class="flex flex-col gap-2 text-sm">
                            <!-- Checkboxes generated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderVenues();
        this.renderRider();
        this.updateStatus();
    }

    private renderVenues() {
        const list = this.container.querySelector('#venue-list');
        if (!list) return;

        list.innerHTML = '';
        const state = getGameState();

        this.manager.getVenues().forEach(venue => {
            const unlocked = state.player.stats.fans >= venue.minFans;

            const card = document.createElement('div');
            card.className = `p-4 border ${unlocked ? 'border-gray-600 hover:border-neon-green bg-panel-bg' : 'border-gray-800 bg-black opacity-50'} transition-all relative`;

            card.innerHTML = `
                <div class="flex justify-between items-start mb-1">
                    <div class="font-bold text-white text-lg">${venue.name}</div>
                    <div class="text-neon-green font-mono">€${venue.basePay}</div>
                </div>
                <div class="text-sm text-gray-400 mb-2">${venue.description}</div>
                
                <div class="flex gap-4 text-xs font-mono mb-4 text-gray-500">
                    <span class="${state.player.stats.fans >= venue.minFans ? 'text-green-500' : 'text-red-500'}">Fans: ${venue.minFans}</span>
                    <span class="${state.player.stats.hype >= venue.hypeRequired ? 'text-green-500' : 'text-red-500'}">Hype: ${venue.hypeRequired}</span>
                    <span>Cap: ${venue.capacity}</span>
                </div>

                ${unlocked ? `<button class="btn-gig w-full py-2 bg-neon-green text-black font-bold uppercase hover:bg-white" data-id="${venue.id}">PERFORM GIG</button>` : '<div class="text-center text-red-900 font-bold uppercase">LOCKED</div>'}
            `;

            if (unlocked) {
                card.querySelector('.btn-gig')?.addEventListener('click', () => {
                    const riderIds = Array.from(this.container.querySelectorAll('input[name="rider"]:checked')).map((el: any) => el.value);
                    const res = this.manager.performGig(venue.id, riderIds);
                    if (res.success) {
                        alert(`${res.message}\nEarned: €${res.report.earned}\nFans: +${res.report.fans}`);
                    } else {
                        alert(res.message);
                    }
                    this.render(); // Refresh state
                });
            }

            list.appendChild(card);
        });
    }

    private renderRider() {
        const list = this.container.querySelector('#rider-options');
        if (!list) return;
        list.innerHTML = '';

        RIDER_OPTIONS.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-2';
            div.innerHTML = `
                <input type="checkbox" name="rider" value="${opt.id}" id="r-${opt.id}">
                <label for="r-${opt.id}" class="cursor-pointer hover:text-white text-gray-300">
                    ${opt.name} <span class="text-gray-500">(€${opt.cost})</span>
                </label>
            `;
            list.appendChild(div);
        });
    }

    private updateStatus() {
        const stats = this.ranking.calculateRank();
        const rankEl = this.container.querySelector('#rank-projection');
        if (rankEl) rankEl.innerHTML = `#${stats.rank}`;
    }
}
