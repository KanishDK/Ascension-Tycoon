import { GameState } from '../core/GameState';
import { INITIAL_STATE } from '../core/GameState';

export class SaveMigrator {
    private static CURRENT_VERSION = 2; // Increment this when changing GameState structure

    static migrate(data: any): GameState {
        // Handle brand new saves (null data)
        if (!data) return INITIAL_STATE;

        let migrated = { ...data };

        // Fix for "Version 0" (Before version tracking)
        if (!migrated.version) {
            console.warn('[SaveMigrator] Legacy Save detected (v0). Migrating...');
            migrated.version = 1;
        }

        // Migration: v1 -> v2 (Adding Missions & Achievements)
        if (migrated.version < 2) {
            console.log('[SaveMigrator] Upgrading v1 -> v2 (Missions)...');
            migrated.missions = { ...INITIAL_STATE.missions };
            migrated.achievements = [];

            // Should rival data be updated?
            if (!migrated.rivals) migrated.rivals = { ...INITIAL_STATE.rivals };

            migrated.version = 2;
        }

        // Future Migrations
        // if (migrated.version < 3) { ... }

        return migrated as GameState;
    }
}
