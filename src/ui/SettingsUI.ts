import { SaveManager } from '../systems/SaveManager';
import { getGameState, updateGameState } from '../core/GameState';

export class SettingsUI {
    private container: HTMLElement;
    private saveManager: SaveManager;

    constructor(parent: HTMLElement, saveManager: SaveManager) {
        this.saveManager = saveManager;
        this.container = document.createElement('div');
        this.container.id = 'settings-modal';
        this.container.className = 'fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center hidden';

        parent.appendChild(this.container);
        this.render();

        // Listen for open event
        window.addEventListener('open-settings', () => this.show());
    }

    public show() {
        this.container.classList.remove('hidden');
        this.render(); // Refresh state
    }

    public hide() {
        this.container.classList.add('hidden');
    }

    private render() {
        const state = getGameState();

        this.container.innerHTML = `
            <div class="w-[800px] max-w-full h-[600px] bg-gray-900 border border-gray-700 flex flex-col shadow-2xl">
                <!-- Header -->
                <div class="h-16 border-b border-gray-700 flex items-center justify-between px-6 bg-black">
                    <h2 class="text-2xl text-white font-cyber tracking-widest">SYSTEM_CONFIG</h2>
                    <button id="close-settings" class="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
                </div>

                <!-- Tabs -->
                <div class="flex border-b border-gray-700 bg-gray-800">
                    <button class="flex-1 py-3 text-white font-bold hover:bg-gray-700 bg-gray-700" id="tab-settings">SETTINGS</button>
                    <button class="flex-1 py-3 text-gray-400 font-bold hover:bg-gray-700" id="tab-help">MANUAL</button>
                    <button class="flex-1 py-3 text-gray-400 font-bold hover:bg-gray-700" id="tab-credits">CREDITS</button>
                </div>

                <!-- Content -->
                <div id="settings-content" class="flex-1 p-6 overflow-y-auto">
                    <!-- Default: Settings -->
                    <div class="space-y-8">
                        <div>
                            <h3 class="text-neon-blue font-bold mb-4 uppercase border-b border-gray-700 pb-2">Audio</h3>
                            <div class="flex items-center justify-between">
                                <label class="text-white">Master Volume</label>
                                <input type="range" min="0" max="1" step="0.1" value="${state.settings.sfxVolume}" class="w-48 accent-neon-blue" id="vol-slider">
                            </div>
                        </div>

                        <div>
                            <h3 class="text-red-500 font-bold mb-4 uppercase border-b border-gray-700 pb-2">Danger Zone</h3>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400">Clear all progress and restart.</span>
                                <button id="btn-reset" class="px-4 py-2 bg-red-900 text-red-200 border border-red-500 hover:bg-red-700">HARD RESET</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEvents();
    }

    private setupEvents() {
        this.container.querySelector('#close-settings')?.addEventListener('click', () => this.hide());

        // Tab Switching Logic (Simple DOM swap for speed)
        const content = this.container.querySelector('#settings-content');

        this.container.querySelector('#tab-settings')?.addEventListener('click', (e) => {
            this.setActiveTab(e.target as HTMLElement);
            if (content) content.innerHTML = this.getSettingsHTML();
            this.setupEvents(); // Re-bind dynamic inputs
        });

        this.container.querySelector('#tab-help')?.addEventListener('click', (e) => {
            this.setActiveTab(e.target as HTMLElement);
            if (content) content.innerHTML = this.getHelpHTML();
        });

        this.container.querySelector('#tab-credits')?.addEventListener('click', (e) => {
            this.setActiveTab(e.target as HTMLElement);
            if (content) content.innerHTML = this.getCreditsHTML();
        });

        // Settings Inputs
        this.container.querySelector('#vol-slider')?.addEventListener('input', (e: any) => {
            const val = parseFloat(e.target.value);
            updateGameState(s => {
                s.settings.musicVolume = val;
                s.settings.sfxVolume = val;
            });
            // TODO: Update Audio Manager volume (needs Ref in Future)
        });

        this.container.querySelector('#btn-reset')?.addEventListener('click', () => {
            if (confirm("ARE YOU SURE? THIS CANNOT BE UNDONE.")) {
                this.saveManager.clearSave();
            }
        });
    }

    private setActiveTab(el: HTMLElement) {
        this.container.querySelectorAll('div > button').forEach(b => {
            b.classList.remove('bg-gray-700', 'text-white');
            b.classList.add('text-gray-400');
        });
        el.classList.add('bg-gray-700', 'text-white');
        el.classList.remove('text-gray-400');
    }

    private getSettingsHTML() {
        const state = getGameState();
        return `
            <div class="space-y-8">
                <div>
                    <h3 class="text-neon-blue font-bold mb-4 uppercase border-b border-gray-700 pb-2">Audio</h3>
                    <div class="flex items-center justify-between">
                        <label class="text-white">Master Volume (Wait for reload)</label>
                        <input type="range" min="0" max="1" step="0.1" value="${state.settings.sfxVolume}" class="w-48 accent-neon-blue" id="vol-slider">
                    </div>
                </div>

                <div>
                    <h3 class="text-red-500 font-bold mb-4 uppercase border-b border-gray-700 pb-2">Danger Zone</h3>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-400">Clear all progress and restart.</span>
                        <button id="btn-reset" class="px-4 py-2 bg-red-900 text-red-200 border border-red-500 hover:bg-red-700">HARD RESET</button>
                    </div>
                </div>
            </div>`;
    }

    private getHelpHTML() {
        return `
            <div class="prose prose-invert max-w-none font-mono text-sm">
                <h3 class="text-neon-green">How to Ascend</h3>
                <ul class="list-disc pl-5 space-y-2 text-gray-300">
                    <li><strong>Produce</strong>: Spend Energy to create Track Elements (Kick, Synth, FX).</li>
                    <li><strong>Quality</strong>: Higher Quality = More Fans & Cash. Gear improves Quality.</li>
                    <li><strong>Releases</strong>: Labels have specific tastes. Match their Genre requirements.</li>
                    <li><strong>Marketplace</strong>: Buy Gear to boost production, Staff to automate, and Lifestyle to flex.</li>
                    <li><strong>Touring</strong>: Unlock venues by gaining Fans. Perform to earn Hype.</li>
                    <li><strong>Ranking</strong>: The DJ Mag Top 100 is calculated every Year (Day 365). Formula: Fans + Hype.</li>
                </ul>
                <h3 class="text-neon-green mt-6">Tips</h3>
                <ul class="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Don't spam releases. Quality over Quantity.</li>
                    <li>The PR Agent cuts Hype Decay in half. Crucial for touring.</li>
                    <li>If a Label rejects you, you are blacklisted for 7 days.</li>
                </ul>
            </div>
        `;
    }

    private getCreditsHTML() {
        return `
            <div class="text-center pt-10">
                <h1 class="text-3xl font-cyber text-neon-pink mb-4">ASCENSION v2.1</h1>
                <p class="text-gray-400 mb-8">Developed by Antigravity (Google DeepMind) & User</p>
                <div class="animate-pulse text-neon-blue text-sm">THANKS FOR PLAYING</div>
            </div>
        `;
    }
}
