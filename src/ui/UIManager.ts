import { StudioUI } from './StudioUI';
import { ShopUI } from './ShopUI';
import { TourUI } from './TourUI';
import { SocialUI } from './SocialUI';
import { TutorialUI } from './TutorialUI';
import { SettingsUI } from './SettingsUI';
import { MissionUI } from './MissionUI';
import { SaveManager } from '../systems/SaveManager';
// import { DashboardUI } from './DashboardUI'; // Future

export class UIManager {
    private container: HTMLElement;
    private mainArea: HTMLElement; // Wrapper for left side
    private contentContainer: HTMLElement;
    private studioUI: StudioUI;
    private shopUI: ShopUI;
    private tourUI: TourUI;
    private socialUI: SocialUI;
    private saveManager: SaveManager;
    private currentTab: 'studio' | 'shop' | 'tour' = 'studio';

    constructor(saveManager: SaveManager) {
        this.saveManager = saveManager;
        this.container = document.getElementById('game-root') as HTMLElement;
        if (!this.container) throw new Error("Root #game-root not found");

        // UI Setup
        this.setupLayout();
        this.setupNavigation();

        // Start Render Loop (Decoupled from Logic Tick)
        this.startRenderLoop();
    }

    private setupLayout() {
        this.container.innerHTML = ''; // Clear loading screen
        this.container.className = 'w-full h-full max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row'; // Responsive Flex

        // LEFT SIDE (Main Game)
        this.mainArea = document.createElement('div');
        this.mainArea.className = 'flex-1 flex flex-col h-full relative order-2 md:order-1'; // Social first on mobile? Or last? Order-2 means Studio is below Social? 
        // Better: Studio first (order-1), Social second (order-2). Default is fine.
        // Let's keep it simple: Flex-col means they stack. Studio on top, Social on bottom.
        this.container.appendChild(this.mainArea);

        // 1. Navigation Bar (In Main Area)
        const nav = document.createElement('div');
        nav.className = 'w-full h-16 bg-black border-b border-gray-800 flex items-center justify-center gap-8 mb-4';
        nav.innerHTML = `
            <button id="nav-studio" class="text-neon-blue font-bold tracking-widest hover:text-white uppercase">Studio</button>
            <button id="nav-shop" class="text-gray-500 font-bold tracking-widest hover:text-white uppercase transition-colors">Marketplace</button>
            <button id="nav-tour" class="text-gray-500 font-bold tracking-widest hover:text-white uppercase transition-colors">Tour</button>
            <div class="ml-auto flex gap-4 mr-4">
                <button id="nav-missions" class="text-gray-500 hover:text-neon-pink text-xl" title="Missions"><i class="fas fa-list-check"></i></button>
                <button id="nav-settings" class="text-gray-500 hover:text-white text-xl" title="Settings"><i class="fas fa-cog"></i></button>
            </div>
        `;
        this.mainArea.appendChild(nav);

        // 2. Content Area (In Main Area)
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'flex-1 overflow-hidden relative';
        this.mainArea.appendChild(this.contentContainer);

        this.studioUI = new StudioUI(this.contentContainer);
        this.shopUI = new ShopUI(this.contentContainer);
        this.tourUI = new TourUI(this.contentContainer);

        // Global Overlays
        new TutorialUI(this.container);
        new SettingsUI(this.container, this.saveManager);
        new MissionUI(this.container);

        // RIGHT SIDE (Social Feed)
        this.socialUI = new SocialUI(this.container); // Appends itself

        this.setupNavigation();
        this.renderInitial();
    }

    private setupNavigation() {
        document.getElementById('nav-studio')?.addEventListener('click', () => this.switchTab('studio'));
        document.getElementById('nav-shop')?.addEventListener('click', () => this.switchTab('shop'));
        document.getElementById('nav-tour')?.addEventListener('click', () => this.switchTab('tour')); // Added event listener for Tour
        document.getElementById('nav-settings')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('open-settings'));
        });
        document.getElementById('nav-missions')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('open-missions'));
        });
    }

    private switchTab(tab: 'studio' | 'shop' | 'tour') { // Updated tab type
        const resetNav = () => {
            document.getElementById('nav-studio')?.classList.add('text-gray-500');
            document.getElementById('nav-shop')?.classList.add('text-gray-500');
            document.getElementById('nav-tour')?.classList.add('text-gray-500'); // Added nav-tour to reset

            document.getElementById('nav-studio')?.classList.remove('text-neon-blue');
            document.getElementById('nav-shop')?.classList.remove('text-neon-purple');
            document.getElementById('nav-tour')?.classList.remove('text-neon-green'); // Added nav-tour to reset
        };
        resetNav();

        this.studioUI.hide();
        this.shopUI.hide();
        this.tourUI.hide(); // Added hide for tourUI

        if (tab === 'studio') {
            this.studioUI.show();
            document.getElementById('nav-studio')?.classList.remove('text-gray-500');
            document.getElementById('nav-studio')?.classList.add('text-neon-blue');
        } else if (tab === 'shop') {
            this.shopUI.show();
            document.getElementById('nav-shop')?.classList.remove('text-gray-500');
            document.getElementById('nav-shop')?.classList.add('text-neon-purple');
        } else if (tab === 'tour') { // Added logic for 'tour' tab
            this.tourUI.show();
            document.getElementById('nav-tour')?.classList.remove('text-gray-500');
            document.getElementById('nav-tour')?.classList.add('text-neon-green');
        }
    }

    public renderInitial() {
        this.switchTab('studio'); // Default to studio on initial render
    }
}
