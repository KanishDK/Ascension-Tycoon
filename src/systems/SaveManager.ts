import { getGameState, updateGameState, GameState } from '../core/GameState';
import { SaveMigrator } from './SaveMigrator';

export class SaveManager {
    private static SAVE_KEY = 'ascension_save_v2';
    private autoSaveInterval: any;

    constructor() {
        this.startAutoSave();
    }

    public startAutoSave() {
        if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = setInterval(() => {
            this.saveGame();
        }, 30000); // 30 seconds
    }

    public saveGame() {
        const state = getGameState();
        try {
            const serialized = JSON.stringify(state);
            localStorage.setItem(SaveManager.SAVE_KEY, serialized);
            console.log("Game Saved.");
            // Optional: Visual indicator could be triggered here
            window.dispatchEvent(new CustomEvent('game-alert', { detail: 'Game Saved' }));
        } catch (e) {
            console.error("Save Failed:", e);
        }
    }

    public loadGame() {
        const raw = localStorage.getItem(SaveManager.SAVE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);

                // MIGRATE DATA
                const migratedData = SaveMigrator.migrate(data);

                // Update State
                updateGameState((state) => {
                    // We need to replace property by property to keep the reference if possible,
                    // or just rely on the fact that state is a mutable proxy or object.
                    // A simple Object.assign is safest for this architecture.
                    Object.assign(state, migratedData);
                });

                console.log("Game Loaded & Migrated (v" + migratedData.version + ")");
                window.dispatchEvent(new CustomEvent('game-alert', { detail: "SESSION RESTORED" }));
            } catch (e) {
                console.error("Save Corrupt:", e);
                window.dispatchEvent(new CustomEvent('game-alert', { detail: "SAVE CORRUPT - RESETTING" }));
            }
        }
    }

    public clearSave() {
        localStorage.removeItem(SaveManager.SAVE_KEY);
        location.reload();
    }
}
