import { getGameState, Genre } from '../core/GameState';
import { ProductionManager } from '../systems/ProductionManager';

export class StudioUI {
    private container: HTMLElement;
    private manager: ProductionManager;

    constructor(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.className = 'w-full h-full flex flex-col p-4 bg-dark-bg text-cyan-500';
        parent.appendChild(this.container);

        this.manager = new ProductionManager();
        this.manager.startProduction('Tech'); // Default for now

        this.setupListeners();
    }

    public show() {
        this.container.classList.remove('hidden');
    }

    public hide() {
        this.container.classList.add('hidden');
    }

    public render() {
        this.update();
    }

    private update() {
        const state = getGameState();
        const p = state.production;

        this.container.innerHTML = `
            <!-- Top Bar -->
            <div class="flex justify-between items-center mb-6 border-b border-neon-blue pb-2 opacity-90">
                <div class="text-2xl font-cyber uppercase tracking-widest text-white">Studio Terminal <span class="text-xs text-neon-blue animate-pulse pl-2">ONLINE</span></div>
                <div class="flex gap-4 font-mono text-neon-green">
                    <div>ENERGY: ${state.player.stats.energy}%</div>
                    <div>CASH: €${state.player.stats.cash}</div>
                    <div>FANS: ${state.player.stats.fans}</div>
                </div>
            </div>

            <!-- Main Production Area -->
            <div class="flex-1 flex gap-4">
                
                <!-- Left: Controls -->
                <div class="w-1/3 flex flex-col gap-4">
                    <div class="p-4 border border-neon-blue bg-panel-bg rounded shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                        <h3 class="text-neon-pink font-bold mb-2 uppercase">Core Modules</h3>
                        
                        <button id="btn-kick" class="w-full mb-2 py-4 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all font-bold tracking-wider relative group overflow-hidden">
                            <span class="relative z-10">KICK & BASS</span>
                            <div class="absolute inset-0 bg-neon-blue opacity-10 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                        
                        <button id="btn-synth" class="w-full mb-2 py-4 border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all font-bold tracking-wider relative group">
                            <span class="relative z-10">SYNTH & LEADS</span>
                        </button>
                        
                        <button id="btn-fx" class="w-full mb-2 py-4 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-all font-bold tracking-wider relative group">
                            <span class="relative z-10">FX & ATMOSPHERE</span>
                        </button>
                    </div>

                    <div class="p-4 border border-gray-700 bg-panel-bg mt-auto">
                         <input type="text" id="track-name" placeholder="Track Name..." class="w-full bg-black border border-gray-600 p-2 text-white mb-2 font-mono focus:border-neon-blue outline-none" value="Project One">
                         
                         <label class="block text-xs text-gray-400 mb-1">Select Label:</label>
                         <select id="label-select" class="w-full bg-black border border-gray-600 p-2 text-white mb-2 font-mono focus:border-neon-blue outline-none">
                            <option value="indie">Self Release (SoundCloud)</option>
                            <option value="navy">Navy Records (Pop/BigRoom)</option>
                            <option value="dark_void">Dark Void (Techno)</option>
                            <option value="som">State of Mind (Trance)</option>
                         </select>

                         <button id="btn-finish" class="w-full py-3 bg-neon-blue text-black font-bold uppercase hover:bg-white transition-colors">RELEASE TRACK</button>
                    </div>
                </div>

                <!-- Right: Visualization (Text based for now) -->
                <div class="w-2/3 border border-gray-800 bg-black p-6 relative">
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    
                    <h2 class="text-xl text-white mb-6">Current Project: <span class="text-neon-blue">${p.targetGenre}</span></h2>

                    <!-- Bars -->
                    <div class="mb-6">
                        <div class="flex justify-between text-sm text-neon-blue mb-1"><span>KICK</span> <span>${Math.floor(p.kick)}%</span></div>
                        <div class="h-4 w-full bg-gray-900 border border-gray-700">
                            <div class="h-full bg-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all duration-200" style="width: ${p.kick}%"></div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex justify-between text-sm text-neon-purple mb-1"><span>SYNTH</span> <span>${Math.floor(p.synth)}%</span></div>
                        <div class="h-4 w-full bg-gray-900 border border-gray-700">
                            <div class="h-full bg-neon-purple shadow-[0_0_15px_rgba(189,0,255,0.5)] transition-all duration-200" style="width: ${p.synth}%"></div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex justify-between text-sm text-neon-green mb-1"><span>FX</span> <span>${Math.floor(p.fx)}%</span></div>
                        <div class="h-4 w-full bg-gray-900 border border-gray-700">
                            <div class="h-full bg-neon-green shadow-[0_0_15px_rgba(0,255,65,0.5)] transition-all duration-200" style="width: ${p.fx}%"></div>
                        </div>
                    </div>

                    <!-- Console Log -->
                    <div class="mt-8 border-t border-gray-800 pt-4 font-mono text-xs text-gray-500 h-32 overflow-y-auto" id="console-log">
                        > System Ready...
                        > Loaded cracked_daw.exe...
                    </div>
                </div>
            </div>
        `;

        // Re-attach listeners after render (simple approach for now)
        this.attachDOMListeners();
    }

    private attachDOMListeners() {
        document.getElementById('btn-kick')?.addEventListener('click', () => this.manager.produce('kick'));
        document.getElementById('btn-synth')?.addEventListener('click', () => this.manager.produce('synth'));
        document.getElementById('btn-fx')?.addEventListener('click', () => this.manager.produce('fx'));

        document.getElementById('btn-finish')?.addEventListener('click', () => {
            const name = (document.getElementById('track-name') as HTMLInputElement).value;
            const labelId = (document.getElementById('label-select') as HTMLSelectElement).value;
            this.manager.finishTrack(name, labelId);
        });
    }

    private setupListeners() {
        window.addEventListener('production-updated', () => this.update());
        window.addEventListener('game-tick', () => this.update()); // Update for energy regen
        window.addEventListener('track-released', (e: any) => {
            alert(`RELEASED: ${e.detail.name}\nLabel Message: ${e.detail.message}\nQuality: ${e.detail.quality}\nFans: +${e.detail.fansGained}`);
        });
        window.addEventListener('game-alert', (e: any) => alert(e.detail));
    }
}
