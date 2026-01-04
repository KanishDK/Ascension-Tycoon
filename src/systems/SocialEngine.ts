import { Generators } from '../data/Generators';

export class SocialEngine {
    constructor() {
        this.setupListeners();
    }

    private setupListeners() {
        // Listen for internal game events
        window.addEventListener('track-released', (e: any) => {
            this.handleTrackRelease(e.detail);
        });

        window.addEventListener('gig-complete', (e: any) => {
            this.handleGigComplete(e.detail);
        });

        // Random banter every now and then
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every check
                this.postToFeed("@System", "Remember to drink water. The AI needs you hydrated.");
            }
        }, 10000); // Check every 10s
    }

    private handleTrackRelease(detail: any) {
        const { name, quality, fansGained } = detail;

        // System announcement
        this.postToFeed("@System", `New Release detected: ${name} [Quality: ${quality}]`);

        // Generate Reactions
        // 3 comments
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const comment = Generators.generateSocialComment(quality, 'Tech'); // Genre passed loosely
                this.postToFeed(comment.user, comment.text);
            }, i * 1500 + 500); // Staggered
        }
    }

    private handleGigComplete(detail: any) {
        this.postToFeed("@FanScanner", `Spotted you performing!`);
    }

    private postToFeed(user: string, text: string) {
        window.dispatchEvent(new CustomEvent('social-feed-update', {
            detail: { user, text, timestamp: new Date().toLocaleTimeString() }
        }));
    }
}
