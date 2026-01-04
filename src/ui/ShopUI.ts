import { getGameState } from '../core/GameState';
import { ShopManager } from '../systems/ShopManager';
import { SHOP_ITEMS, ItemType } from '../data/ShopItems';

export class ShopUI {
    private container: HTMLElement;
    private manager: ShopManager;

    constructor(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.className = 'w-full h-full p-4 bg-dark-bg text-cyan-500 overflow-y-auto hidden'; // Hidden by default
        parent.appendChild(this.container);

        this.manager = new ShopManager();
        this.render(); // Initial structure

        window.addEventListener('shop-updated', () => this.update());
        window.addEventListener('game-tick', () => this.updateButtons()); // Update affordability
    }

    public show() {
        this.container.classList.remove('hidden');
        this.update();
    }

    public hide() {
        this.container.classList.add('hidden');
    }

    private render() {
        this.container.innerHTML = `
            <div class="mb-6 border-b border-neon-purple pb-2 opacity-90">
                <div class="text-2xl font-cyber uppercase tracking-widest text-white">Dark Web Marketplace <span class="text-xs text-neon-purple pl-2">ENCRYPTED</span></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Gear Section -->
                <div class="col-span-1">
                    <h3 class="text-neon-blue font-bold mb-4 uppercase border-l-4 border-neon-blue pl-2">Studio Gear</h3>
                    <div id="shop-list-gear" class="flex flex-col gap-4"></div>
                </div>

                <!-- Staff Section -->
                <div class="col-span-1">
                    <h3 class="text-neon-pink font-bold mb-4 uppercase border-l-4 border-neon-pink pl-2">Staff & Crew</h3>
                    <div id="shop-list-staff" class="flex flex-col gap-4"></div>
                </div>

                <!-- Lifestyle Section -->
                <div class="col-span-1">
                    <h3 class="text-neon-green font-bold mb-4 uppercase border-l-4 border-neon-green pl-2">Lifestyle</h3>
                    <div id="shop-list-lifestyle" class="flex flex-col gap-4"></div>
                </div>
            </div>
        `;
    }

    private update() {
        // Re-render items to update owned status
        this.renderItems('gear', document.getElementById('shop-list-gear'));
        this.renderItems('staff', document.getElementById('shop-list-staff'));
        this.renderItems('lifestyle', document.getElementById('shop-list-lifestyle'));
    }

    private renderItems(type: ItemType, parent: HTMLElement | null) {
        if (!parent) return;
        parent.innerHTML = '';
        const state = getGameState();

        SHOP_ITEMS.filter(i => i.type === type).forEach(item => {
            const isOwned = state.player.inventory.includes(item.id);
            const canAfford = state.player.stats.cash >= item.cost;
            const levelReq = item.minLevel || 0;
            const isLocked = state.player.stats.level < levelReq;

            const card = document.createElement('div');
            card.className = `p-4 border ${isOwned ? 'border-green-500 bg-green-900/20' : (isLocked ? 'border-red-900 bg-red-900/10' : 'border-gray-700 bg-gray-900')} flex justify-between items-center transition-all`;

            card.innerHTML = `
                <div>
                    <div class="font-bold ${isOwned ? 'text-green-400' : (isLocked ? 'text-red-500' : 'text-white')}">${item.name}</div>
                    <div class="text-xs text-gray-400">${item.description}</div>
                    ${isLocked ? `<div class="text-xs text-red-500 mt-1">LOCKED (Req Lvl ${levelReq})</div>` : ''}
                </div>
                <button 
                    class="px-3 py-1 text-sm font-bold border ${isOwned ? 'border-green-500 text-green-500 cursor-default' : (canAfford && !isLocked ? 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black' : 'border-gray-600 text-gray-600 cursor-not-allowed')}"
                    ${isOwned || !canAfford || isLocked ? 'disabled' : ''}
                    onclick="window.dispatchEvent(new CustomEvent('buy-item', { detail: '${item.id}' }))"
                >
                    ${isOwned ? 'OWNED' : `€${item.cost}`}
                </button>
            `;
            if (!owned) {
                const btn = card.querySelector('.btn-buy') as HTMLButtonElement;
                if (!canAfford) {
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                    // verification logic later
                }
                btn.addEventListener('click', () => {
                    const res = this.manager.buyItem(item.id);
                    if (res.success) {
                        alert(res.message);
                    } else {
                        alert(res.message);
                    }
                });
            }

            parent.appendChild(card);
        });
    }

    private updateButtons() {
        // Lightweight update for visual 'can afford' states without full redraw?
        // For now, full update on open is fine.
    }
}
