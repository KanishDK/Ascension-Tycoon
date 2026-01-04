# Ascension: Trance Tycoon 2026 (v2.0)

> "The Underground is waiting. The Algorithm is watching."

**Ascension** is a satirical, cyberpunk-themed idle tycoon game where you rise from a bedroom producer to a global EDM icon. Manage your energy, produce tracks, sign to labels, tour the world, and battle rival DJs in a fight for the soul of the scene.

![Status](https://img.shields.io/badge/Status-Galactic_Master-neon--blue)
![Tech](https://img.shields.io/badge/Tech-Vite_PWA_TypeScript-ff00ff)

## 🎮 Play Now
* **Web**: [Deployment URL]
* **Install**: Click the "Install App" or (+) button in your browser address bar to install as a native app on Desktop or Mobile.

## ✨ Key Features
- **The Studio**: Deep production mechanics. Balance Kick, Synth, and FX to hit the perfect "Quality" score.
- **The Scene**: 5 unlockable genres (Tech, Psy, Uplifting, etc.) and dynamic Labels with acceptance criteria.
- **The World**: A living social feed that reacts to your music.
- **Rivals**: Battle against Charlotte de Witte (Bot), Armin van Buuren (Bot), and the evil Quantum Solar Corp.
- **Progression**: 
    - **20-Mission Story Campaign**: "The Signal".
    - **Producer Levels (1-20)**: Earn XP to unlock pro gear (Analog Synths, Yachts).
    - **Achievements**: Become an "Underground God" or a "Corporate Shill".
- **Tech Stack**: Built with **Vite**, **TypeScript**, and **PWA** technologies for instant loading and offline support.

## 🛠️ Installation (Developer)

### Prerequisites
- Node.js (v18+)

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure
```
src/
├── core/           # Game Loop, State Management (GameState.ts)
├── data/           # Static Data (Missions, Items, Rivals, Formulas)
├── systems/        # Logic (Production, Shop, Touring, Social, SaveSystem)
├── ui/             # UI Components (StudioUI, ShopUI, MissionUI, SettingsUI)
└── index.ts        # Entry Point
```

## 🕹️ Controls
- **Click**: Produce music, navigate menus.
- **Save**: The game auto-saves every 30 seconds. Manual save available in Settings.
- **Reset**: Hard Reset available in Settings (The "Danger Zone").

## 🏆 Credits
- **Concept & Code**: Antigravity AI (Google Deepmind)
- **Lead Designer**: [User Name]
- **Engine**: Custom TypeScript State Engine (No external game engines used)

---
*Ascension © 2026. Do not feed the Algorithm.*
