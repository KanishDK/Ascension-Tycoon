import { Genre, PlayerStats } from '../core/GameState';

/**
 * GDD 4.1: Quality Formula
 * Q = ((Kick + Synth + FX) / 3) * GearMod + GenreBonus + RNG
 */
export const calculateQuality = (
    kick: number,
    synth: number,
    fx: number,
    inventory: string[],
    genre: Genre
): number => {
    const base = (kick + synth + fx) / 3;

    // Gear Modifiers
    let gearMod = 1.0;
    if (inventory.includes('monitors')) gearMod += 0.05;
    if (inventory.includes('acoustics')) gearMod += 0.05;
    if (inventory.includes('ozone_ai')) gearMod += 0.05; // Plugin bonus
    if (inventory.includes('analog_heat')) gearMod += 0.10;

    // Genre specific adjustments (GDD 4.4)
    let genreBonus = 0;
    if (genre === 'Tech' && inventory.includes('analog_heat')) genreBonus += 5; // Tech Trance needs high production
    if (genre === 'BigRoom') genreBonus -= 5; // Simpler to make but penalty to integrity elsewhere

    const rng = (Math.random() * 10) - 5; // -5 to +5

    let quality = (base * gearMod) + genreBonus + rng;
    return Math.min(100, Math.max(0, Math.floor(quality)));
};

/**
 * GDD 4.2: Fan Growth
 * Growth = BaseGain * (1 + Hype%)
 */
export const calculateFanGrowth = (quality: number, hype: number, genre: Genre): number => {
    let baseGain = quality * 10; // Q: 80 -> 800 fans

    // Genre mods
    if (genre === 'Psy') baseGain *= 0.8; // Niche
    if (genre === 'BigRoom') baseGain *= 1.5; // Mass appeal

    const hypeMultiplier = 1 + (hype / 100);

    return Math.floor(baseGain * hypeMultiplier);
};

/**
 * GDD 4.3: Top 100 Score
 * Score = Votes + (Fans * 0.5) + (Cash Spent * 0.1 - simulated elsewhere)
 */
export const calculateRankScore = (fans: number, votes: number): number => {
    return Math.floor(votes + (fans * 0.5));
};

/**
 * GDD 8.3: Cancellation Chance
 * Chance = (DivaScore - RankBonus) * 5
 */
export const calculateCancellationChance = (divaScore: number, rank: number): number => {
    let rankBonus = 0;
    if (rank <= 1) rankBonus = 50;
    else if (rank <= 10) rankBonus = 30;
    else if (rank <= 100) rankBonus = 10;

    let chance = (divaScore - rankBonus) * 5;
    return Math.max(0, chance);
};
