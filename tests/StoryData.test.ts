import { getEventById, EVENTS_DB } from '../src/data/StoryData';

describe('Story Data', () => {
    it('should retrieve an event by ID', () => {
        const event = getEventById('intro_garage');
        expect(event).toBeDefined();
        expect(event?.title).toContain('Garage');
    });

    it('should have valid nextEventIds', () => {
        EVENTS_DB.forEach(event => {
            event.options.forEach(opt => {
                if (opt.nextEventId) {
                    const nextEvent = getEventById(opt.nextEventId);
                    expect(nextEvent).toBeDefined();
                }
            });
        });
    });
});
