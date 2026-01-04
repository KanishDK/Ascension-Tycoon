import { ModLoader } from '../src/systems/ModLoader';
import { SaveManager, GameState } from '../src/systems/SaveManager';
import { VST_CATALOG } from '../src/data/VSTData';

// Mock LocalStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Systems', () => {
    describe('ModLoader', () => {
        it('should load valid JSON mod', () => {
            const modJson = JSON.stringify({
                vsts: [{ id: 'test_vst', name: 'Test VST', type: 'Test', boost: 0.9, unlockLevel: 1 }]
            });

            const result = ModLoader.loadMod(modJson);
            expect(result.success).toBe(true);

            const loadedVst = VST_CATALOG.find(v => v.id === 'test_vst');
            expect(loadedVst).toBeDefined();
            expect(loadedVst?.boost).toBe(0.9);
        });

        it('should fail on invalid JSON', () => {
            const result = ModLoader.loadMod('{ invalid: json ');
            expect(result.success).toBe(false);
        });
    });

    describe('SaveManager', () => {
        beforeEach(() => {
            SaveManager.clearSave();
        });

        it('should save and load game state', () => {
            const state: GameState = {
                xp: 1000,
                money: 500,
                hype: 50,
                energy: 100,
                unlockedVSTs: ['nexus5']
            };

            const saveResult = SaveManager.saveGame(state);
            expect(saveResult).toBe(true);

            const loadedState = SaveManager.loadGame();
            expect(loadedState).toEqual(state);
        });

        it('should return null if no save exists', () => {
            const loadedState = SaveManager.loadGame();
            expect(loadedState).toBeNull();
        });
    });
});
