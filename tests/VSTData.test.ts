import { getVSTById, getAvailableVSTs, VST_CATALOG } from '../src/data/VSTData';

describe('VST Data', () => {
    it('should retrieve a VST by ID', () => {
        const serum = getVSTById('serum');
        expect(serum).toBeDefined();
        expect(serum?.name).toBe('Serum');
        expect(serum?.boost).toBe(0.5);
    });

    it('should return undefined for invalid ID', () => {
        expect(getVSTById('invalid_id')).toBeUndefined();
    });

    it('should filter VSTs by unlock level', () => {
        const level2VSTs = getAvailableVSTs(2);
        const level10VSTs = getAvailableVSTs(10);

        // Serum is lvl 2, Sylenth1 is lvl 3
        expect(level2VSTs.find(v => v.id === 'serum')).toBeDefined();
        expect(level2VSTs.find(v => v.id === 'sylenth1')).toBeUndefined();

        // All should be avail at lvl 10 (max in sample is 10)
        expect(level10VSTs.length).toBeGreaterThanOrEqual(VST_CATALOG.length);
    });
});
