# Master Instruction til IDE Agent: Ascension (Project Blueprint)
**Rolle:** Du er en Senior Game Architect og Lead Developer med speciale i WebGL, React og PWA-udvikling.

**Opgave:** Vi skal bygge spillet "Ascension: Trance Tycoon 2026". Det er en hybrid mellem et idle/tycoon-spil og en rytme-simulator. Spillet skal køre i browseren (mobile-first) som en PWA (Progressive Web App).

## Core Tech Stack (Strict):

*   **Framework:** React 19 (Vite) + TypeScript.
*   **State Management (Game Logic):** Zustand (fordi vi har brug for transient updates uden re-renders ved hver frame).
*   **Visuals (3D/Crowd):** React Three Fiber (R3F) + Drei. Vi bruger InstancedMesh til crowd-rendering for performance.
*   **Audio Engine:** Web Audio API (Native). Ingen tunge biblioteker, vi bygger noderne selv (Gain, BiquadFilter, Analyser) for at minimere latency.
*   **UI/Styling:** Tailwind CSS + ShadCN/UI (til menuer/tycoon lag). Farvepaletten er "Neon Noir" (Deep Navy Backgrounds, Cyan/Magenta Accents).
*   **Persistence:** Dexie.js (IndexedDB wrapper) til save-data og offline progression.

## 1. Arkitektur-Plan (Hvad du skal bygge)
Du skal implementere spillet i 4 distinkte lag. Start med lag 1.

### Lag 1: The Idle Engine (Logic Core)
Dette er "hjernen". Den kører uafhængigt af grafikken.

*   **The Game Loop:** Implementer en `useGameLoop` hook, der bruger `requestAnimationFrame`.
*   **Tick System:** Spillet skal have en global `tick()` funktion, der opdaterer ressourcer (Hype, Penge, Energi) baseret på `deltaTime`.
*   **Offline Calculation:** Når spillet indlæses, skal det sammenligne `Date.now()` med `lastSaveTime`.
    *   *Formel:* `(CurrentTime - LastSaveTime) * (PassiveIncomeRate * EfficiencyModifier)`.

### Lag 2: The Studio (Audio Graph)
Dette er produktions-delen.

*   Byg en **AudioContext Manager**.
*   **Nodes:** Vi skal bruge `OscillatorNode` (til synth lyde) og `BufferSource` (til samples).
*   **Mixing Chain:** Opret en kæde: `Source -> BiquadFilter (LowPass) -> DynamicsCompressor (Sidechain) -> Master Gain -> Destination`.
*   **Loudness War Mechanic:** Implementer en "Limiter", hvor brugeren kan skrue op for 'Input Gain'. Hvis værdien overstiger en tærskel, skal du introducere 'Distortion' (waveshaper curve) og sænke 'Audio Quality' scoren i state.

### Lag 3: The Visuals (React Three Fiber)
Dette er "festival" delen. Må ikke bruge DOM-elementer til crowd.

*   **Crowd System:** Brug `InstancedMesh` til at rendere 10.000+ publikummer (simple cubes eller low-poly modeller).
*   **Shader Material:** Skriv en custom shader til publikum, der reagerer på AudioAnalyser data.
    *   *Input:* Audio Frequency Data (Bass).
    *   *Effect:* Når bassen slår (low freq > threshold), skal partiklerne hoppe (Y-axis offset) og skifte farve til Neon Cyan.

### Lag 4: UI & PWA (The Interface)
*   **Layout:** Brug et "Glassmorphism" design ovenpå 3D canvas.
*   **Thumb Zone:** Al navigation (Studio, Live, Office) skal ligge i bunden af skærmen (mobile UX pattern).
*   **Service Worker:** Opsæt caching strategi for lydfiler, så spillet virker 100% offline.

## 🔍 Specifikke Implementerings-Detaljer (Til din kode-generering)

### 1. Omkring "Mixing" Minigame
Brug ikke rigtige VST-plugins. Simuler det matematisk i koden:
*   Vis et canvas med to cirkler (Kick og Bass).
*   Når de overlapper, skal spilleren justere en "Release" slider.
*   *Korrekt værdi = (BPM / 60) * 1000 (ms).* Hvis de rammer dette, er mixet "Clean".

### 2. Omkring "Idle" økonomien
Brug BigInt eller et bibliotek som `break_infinity.js` hvis tallene bliver for store, men start med standard `number`. Strukturer save-data sådan:

```typescript
interface GameState {
  resources: { cash: number; hype: number; integrity: number };
  studio: { equipmentLevel: number; acousticTreatment: boolean };
  artist: { class: 'Virtuoso' | 'Plant' | 'AI'; sobriety: number };
  lastLogin: number;
}
```

### 3. Visuel Stil (Tailwind Config)
Udvid Tailwind config med vores farver:
*   `neon-cyan`: #59f0ff
*   `neon-magenta`: #e7305d
*   `void-navy`: #01162b
*   `acid-lime`: #bbd440

## Start nu
Begynd med at opsætte **Lag 1 (Idle Engine)**. Opret et tomt React projekt med Vite, installer Zustand, og lav det første "Tick" loop, der genererer €1 i sekundet. Vis det i en simpel UI.

### Hvorfor denne tilgang virker for AI Agenten:
*   **Modularitet:** Jeg har bedt den om at bygge i "Lag". AI'er fejler ofte, hvis de skal bygge hele spillet på én gang. Ved at starte med "The Idle Engine" sikrer du, at matematikken virker, før den begynder at rode med 3D-grafik.
*   **Specifik Tech-Stack:** Ved at tvinge den til at bruge Zustand i stedet for Redux Context, undgår du de performance-problemer, der typisk dræber idle-spil i React (unødvendige re-renders hvert millisekund).
*   **WebGL Optimering:** Instruktionen om at bruge InstancedMesh er kritisk. Hvis AI'en bare laver 10.000 `<div>` eller `<mesh>` elementer til din crowd, vil spillet crashe på en telefon med det samme. Instancing gør det muligt at rendere millioner af partikler flydende.
*   **Audio Realisme:** Ved at bede den bruge Web Audio API direkte i stedet for en lydafspiller, kan du lave rigtige filtre og effekter (som din Loudness War mekanik), hvilket gør spillet unikt.
