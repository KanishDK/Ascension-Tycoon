import { getGameState, updateGameState } from '../core/GameState';

export interface TutorialStep {
    id: number;
    text: string;
    targetId?: string; // DOM ID to highlight
    nextLabel: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
    { id: 0, text: "Welcome to Ascension v2.0. Your goal is to become the #1 DJ in the world.", nextLabel: "Let's Go" },
    { id: 1, text: "This is the STUDIO. Use Energy (⚡) to produce Track Elements.", targetId: 'btn-kick', nextLabel: "Got it" },
    { id: 2, text: "Watch your ENERGY. It regenerates over time.", targetId: 'stat-energy', nextLabel: "Understood" },
    { id: 3, text: "When Quality is high enough, RELEASE the track to earn Cash & Fans.", targetId: 'btn-finish', nextLabel: "Next" },
    { id: 4, text: "Use the MARKETPLACE to buy better gear and staff.", targetId: 'nav-shop', nextLabel: "Okay" },
    { id: 5, text: "Check the FEED. The world is watching you.", targetId: 'social-feed-list', nextLabel: "Start Career" }
];

export class TutorialManager {
    public isActive(): boolean {
        const state = getGameState();
        return state.player.tutorialStep < TUTORIAL_STEPS.length;
    }

    public getCurrentStep(): TutorialStep | null {
        const state = getGameState();
        const step = TUTORIAL_STEPS.find(s => s.id === state.player.tutorialStep);
        return step || null;
    }

    public advance() {
        updateGameState(state => {
            state.player.tutorialStep++;
        });
        window.dispatchEvent(new CustomEvent('tutorial-updated'));
    }
}
