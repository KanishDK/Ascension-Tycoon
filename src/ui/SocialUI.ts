export class SocialUI {
    private container: HTMLElement;
    private feed: HTMLElement;

    constructor(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.className = 'w-full md:w-64 h-32 md:h-full bg-black border-t md:border-t-0 md:border-l border-gray-800 flex flex-col order-1 md:order-2'; // Stacked bottom/top on mobile? 
        // Let's make it Order 1 (Top) on mobile so you see reactions immediately? Or Bottom?
        // Usually feed is secondary. Order 2 (Bottom).
        // Height on mobile limited to 32 (128px) to not kill screen space.

        this.container.innerHTML = `
            <div class="h-12 border-b border-gray-800 flex items-center px-4 bg-gray-900">
                <span class="text-neon-blue font-cyber tracking-widest text-sm">NET.FEED</span>
                <div class="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div id="social-feed-list" class="flex-1 overflow-y-auto p-2 flex flex-col gap-2 font-mono text-xs">
                <!-- Items go here -->
            </div>
        `;

        parent.appendChild(this.container);
        this.feed = this.container.querySelector('#social-feed-list') as HTMLElement;

        this.setupListeners();
    }

    private setupListeners() {
        window.addEventListener('social-feed-update', (e: any) => {
            this.addPost(e.detail);
        });
    }

    private addPost(data: { user: string, text: string, timestamp: string }) {
        const el = document.createElement('div');
        el.className = 'p-2 border-b border-gray-900 animate-slide-in';
        el.innerHTML = `
            <div class="flex justify-between text-gray-500 mb-1">
                <span class="text-neon-pink font-bold">${data.user}</span>
                <span class="text-[10px]">${data.timestamp}</span>
            </div>
            <div class="text-gray-300">${data.text}</div>
        `;

        this.feed.prepend(el); // Newest top

        // Limit history
        if (this.feed.children.length > 50) {
            this.feed.lastElementChild?.remove();
        }
    }
}
