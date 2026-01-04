import { GameLoop } from './core/GameLoop';
import { getGameState, resetGameState } from './core/GameState';
import { UIManager } from './ui/UIManager';
import { SocialEngine } from './systems/SocialEngine';

console.log("Ascension v2.0 Initializing...");

const loop = new GameLoop();
let ui: UIManager;

// Expose dev tools
(window as any).Game = {
    getState: getGameState,
    reset: resetGameState,
    loop: loop
};

// Start the heart
loop.start();

import { SaveManager } from './systems/SaveManager';
import { AudioManager } from './systems/AudioManager';
import { MissionManager } from './systems/MissionManager';
import { registerSW } from 'virtual:pwa-register';

// PWA: Auto-update SW
registerSW({ immediate: true });

// Initialize UI
window.addEventListener('load', () => {
    // Systems Init
    const saveMgr = new SaveManager();
    saveMgr.loadGame();

    const audioMgr = new AudioManager();
    new MissionManager(); // Start missions

    ui = new UIManager(saveMgr);
    new SocialEngine();

    // Audio Hook
    document.addEventListener('click', (e) => {
        // Any button click triggers a beep
        if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) {
            audioMgr.playUiBeep('click');
        }
    });

    // Test msg
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('social-feed-update', {
            detail: { user: '@System', text: 'Welcome to Ascension v2.0', timestamp: 'NOW' }
        }));
    }, 1000);
});
