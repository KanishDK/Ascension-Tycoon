import { getGameState, updateGameState } from '../core/GameState';
import { SHOP_ITEMS } from '../data/ShopItems';

export class ShopManager {

    public buyItem(itemId: string): { success: boolean, message: string } {
        const state = getGameState();
        const item = SHOP_ITEMS.find(i => i.id === itemId);

        if (!item) return { success: false, message: "Item not found." };
        if (state.player.inventory.includes(itemId)) return { success: false, message: "Already owned." };
        if (state.player.stats.cash < item.cost) return { success: false, message: "Not enough cash." };

        updateGameState(state => {
            state.player.stats.cash -= item.cost;
            state.player.inventory.push(itemId);

            // Immediate Stat Effects
            if (item.id === 'analog_heat') {
                // This is handled in ProductionManager by checking inventory
            }
            if (item.id === 'modular_wall') {
                state.player.stats.integrity = Math.min(100, state.player.stats.integrity + 20);
            }
        });

        window.dispatchEvent(new CustomEvent('shop-updated')); // Refresh UI
        return { success: true, message: `Purchased ${item.name}!` };
    }
}
