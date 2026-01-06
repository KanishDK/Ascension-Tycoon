import Dexie, { type Table } from 'dexie';

export interface GameState {
    resources: {
        cash: number;
        hype: number;
        integrity: number;
        energy: number;
    };
    upgrades: { [key: string]: number }; // level of each upgrade
    lastLogin: number;
    playerClass?: 'Virtuoso' | 'IndustryPlant' | 'AINative';
    subGenre?: 'Psytrance' | 'DeepTrance' | 'BigRoom';
    rivals: { [key: string]: boolean }; // true if defeated
    settings: {
        lowPowerMode: boolean;
    };
    stats: {
        ghostTracksBought: number;
    };
    b2bActive?: boolean;
}

export interface SaveData {
    id?: number;
    data: GameState;
    updatedAt: number;
}

export class AscensionDB extends Dexie {
    saves!: Table<SaveData>;

    constructor() {
        super('AscensionDB');
        this.version(1).stores({
            saves: '++id, updatedAt'
        });
    }

    async saveGame(state: GameState) {
        // We only keep one save for now (id: 1)
        await this.saves.put({
            id: 1,
            data: state,
            updatedAt: Date.now()
        });
    }

    async loadGame(): Promise<GameState | null> {
        const save = await this.saves.get(1);
        return save ? save.data : null;
    }
}

export const db = new AscensionDB();
