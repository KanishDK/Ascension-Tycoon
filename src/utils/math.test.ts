import { calculateQuality, calculateSkillLevel, calculatePlayerLevel } from './math';

describe('Math Utils', () => {
    describe('calculateQuality', () => {
        it('should calculate Q correctly with deterministic RNG', () => {
            // Formula: (Gear * Skill) + (RNG * 0.2) + Subgenre + MiniGame
            // Inputs: Gear=1.0, Skill=2, Subgenre=0.2, MiniGame=0.8, RNG=0.5
            // Calc: (1.0 * 2) + (0.5 * 0.2) + 0.2 + 0.8
            //       2.0 + 0.1 + 0.2 + 0.8 = 3.1
            const params = {
                gearMultiplier: 1.0,
                skillLevel: 2,
                subgenreBonus: 0.2,
                miniGameScore: 0.8,
                rng: 0.5
            };
            expect(calculateQuality(params)).toBe(3.1);
        });
    });

    describe('calculateSkillLevel', () => {
        it('should calculate level correctly from XP', () => {
            // Level = floor(sqrt(XP / 100))
            // XP 400 => sqrt(4) = 2
            expect(calculateSkillLevel(400)).toBe(2);
            // XP 500 => sqrt(5) = 2.23 => 2
            expect(calculateSkillLevel(500)).toBe(2);
            // XP 900 => sqrt(9) = 3
            expect(calculateSkillLevel(900)).toBe(3);
        });

        it('should cap level at 20', () => {
            // XP 1,000,000 => sqrt(10000) = 100 => cap 20
            expect(calculateSkillLevel(1000000)).toBe(20);
        });
    });

    describe('calculatePlayerLevel', () => {
        it('should calculate player level correctly', () => {
            // Level = floor(log2(XP / 50) + 1)
            // XP 50 => log2(1) = 0 + 1 = 1
            expect(calculatePlayerLevel(50)).toBe(1);
            // XP 100 => log2(2) = 1 + 1 = 2
            expect(calculatePlayerLevel(100)).toBe(2);
        });
    });
});
