// GDD Formula: Q = (GearMultiplier * SkillLevel) + (RNG * 0.2) + SubgenreBonus + MiniGameScore

export interface QualityParams {
    gearMultiplier: number;
    skillLevel: number;
    subgenreBonus: number;
    miniGameScore: number;
    rng?: number; // Optional seed for deterministic testing
}

export const calculateQuality = (params: QualityParams): number => {
    const { gearMultiplier, skillLevel, subgenreBonus, miniGameScore, rng } = params;
    const randomFactor = rng !== undefined ? rng : Math.random();

    // Q formula
    // Note: Skill calculation is usually separate, but here we expect the level passed in.
    const quality = (gearMultiplier * skillLevel) + (randomFactor * 0.2) + subgenreBonus + miniGameScore;

    return parseFloat(quality.toFixed(2));
};

export const calculateSkillLevel = (xp: number): number => {
    // GDD: Level = floor(sqrt(XP / 100))
    // Max level 20 is a cap we should enforce? GDD says (Max 20).
    const level = Math.floor(Math.sqrt(xp / 100));
    return Math.min(level, 20);
};

export const calculatePlayerLevel = (xp: number): number => {
    // GDD: Level = floor(log2(XP / 50) + 1)
    if (xp < 50) return 1;
    return Math.floor(Math.log2(xp / 50)) + 1;
};
