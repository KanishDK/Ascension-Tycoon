import { TutorialManager } from '../systems/TutorialManager';

export class TutorialUI {
    private container: HTMLElement;
    private manager: TutorialManager;

    constructor(parent: HTMLElement) {
        this.manager = new TutorialManager();
        this.container = document.createElement('div');
        this.container.id = 'tutorial-overlay';
        this.container.className = 'absolute inset-0 z-50 pointer-events-none hidden'; // High z-index but let clicks pass initially? No, we want to block interaction except Next.
        // Actually, for a "Spotlight" tutorial, we usually block everything.

        parent.appendChild(this.container);

        window.addEventListener('tutorial-updated', () => this.render());

        // Initial check
        if (this.manager.isActive()) {
            this.render();
        }
    }

    private render() {
        if (!this.manager.isActive()) {
            this.container.classList.add('hidden');
            this.container.innerHTML = '';
            return;
        }

        const step = this.manager.getCurrentStep();
        if (!step) return;

        this.container.classList.remove('hidden');
        this.container.className = 'absolute inset-0 z-50 pointer-events-auto bg-black bg-opacity-80 flex items-center justify-center';

        // Spotlight Logic (Simple version: just point at it, don't clip path for now to save time)
        // Advanced: We could use a massive border-width on a div to create a "hole"

        this.container.innerHTML = `
            <div class="bg-gray-900 border border-neon-blue p-6 w-96 max-w-full text-center shadow-[0_0_20px_#00f3ff]">
                <h2 class="text-neon-blue font-bold text-xl mb-4 tracking-widest">TUTORIAL</h2>
                <p class="text-white mb-6 font-mono leading-relaxed">${step.text}</p>
                <button id="tut-next" class="px-6 py-2 bg-neon-blue text-black font-bold uppercase hover:bg-white transition-colors">
                    ${step.nextLabel}
                </button>
            </div>
        `;

        // Highlight Target if exists
        // Clean up old highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight', 'relative', 'z-[60]'));

        if (step.targetId) {
            const target = document.getElementById(step.targetId);
            if (target) {
                target.classList.add('relative', 'z-[60]', 'tutorial-highlight');
                // Optional: Add a pulsating border to target
                // We rely on the z-index popping it above the overlay? 
                // Wait, if overlay is z-50 and bg-opacity-80, putting target at z-60 makes it visible/clickable.
                // But our overlay is "pointer-events-auto" so it blocks clicks elsewhere.
            }
        }

        this.container.querySelector('#tut-next')?.addEventListener('click', () => {
            this.manager.advance();
        });
    }
}
