import { create } from 'zustand'
import { db, GameState } from '../db/gameDb'
import { vibrate, HAPTIC_Patterns } from '../utils/haptics'

interface GameStore extends GameState {
    addCash: (amount: number) => void
    addHype: (amount: number) => void
    buyUpgrade: (id: string, cost: number) => void
    defeatRival: (id: string) => void
    setClass: (type: 'Virtuoso' | 'IndustryPlant' | 'AINative') => void
    loadState: () => Promise<void>
    reset: () => void
    save: () => Promise<void>
    toggleLowPowerMode: () => void
    touchGrass: () => void
    buyConsumable: (id: 'yerba_mate' | 'nootropic_stack' | 'unauthorized_stimulant') => void
    buyGhostTrack: () => void
    setSubGenre: (genre: 'Psytrance' | 'DeepTrance' | 'BigRoom') => void
    runRadioShow: () => void
    b2bActive: boolean
    startB2B: () => void
}

const DEFAULT_STATE: GameState = {
    resources: {
        cash: 0,
        hype: 0,
        integrity: 100,
        energy: 100,
    },
    upgrades: {
        acoustic_foam: 0,
        monitor_speakers: 0,
        subwoofer: 0
    },
    rivals: {
        charlotte: false,
        armin: false,
    },
    settings: {
        lowPowerMode: false
    },
    stats: {
        ghostTracksBought: 0
    },
    lastLogin: Date.now(),
    playerClass: undefined,
    subGenre: undefined
}

export const useGameStore = create<GameStore>((set, get) => ({
    ...DEFAULT_STATE,

    toggleLowPowerMode: () => {
        set((state) => ({
            settings: {
                ...state.settings,
                lowPowerMode: !state.settings.lowPowerMode
            }
        }))
        get().save()
    },

    defeatRival: (id) => {
        set((state) => ({
            rivals: {
                ...state.rivals,
                [id]: true
            }
        }))
        get().save()
    },

    setClass: (type) => {
        let startingCash = 0

        // Class Bonuses
        if (type === 'Virtuoso') startingCash = 100
        if (type === 'IndustryPlant') startingCash = 50000 // Daddy's Money
        if (type === 'AINative') startingCash = 0 // Using free tools

        set({
            playerClass: type,
            resources: { ...DEFAULT_STATE.resources, cash: startingCash }
        })

        // Persist immediately
        get().save()
    },

    addCash: (amount) => {
        const state = get()
        // Apply Multipliers
        let multiplier = 1

        // Upgrade Multipliers (Additive Base)
        if (state.upgrades?.acoustic_foam > 0) {
            multiplier += (state.upgrades.acoustic_foam * 0.1)
        }

        // Class Multipliers (Additive to avoid runaway stacking)
        if (state.playerClass === 'AINative') {
            // Was multiplier *= 1.25, changed to additive +0.25 to fix exploitation
            multiplier += 0.25
        }

        set((state) => ({
            resources: {
                ...state.resources,
                cash: state.resources.cash + (amount * multiplier),
            },
        }))
    },

    addHype: (amount) => {
        set((state) => ({
            resources: {
                ...state.resources,
                hype: state.resources.hype + amount,
            },
        }))
    },

    buyUpgrade: (id: string, cost: number) => {
        const state = get()
        if (state.resources.cash >= cost) {
            vibrate(HAPTIC_Patterns.click)
            set((state) => ({
                resources: {
                    ...state.resources,
                    cash: state.resources.cash - cost
                },
                upgrades: {
                    ...state.upgrades,
                    [id]: (state.upgrades[id] || 0) + 1
                }
            }))
        }
    },

    loadState: async () => {
        const saved = await db.loadGame()
        if (saved) {
            // Offline Calculation
            const now = Date.now()
            let lastLogin = saved.lastLogin || now

            // SECURITY: Airplane Mode Prevention
            // If the last login is in the future (clock manipulation), punish the player.
            if (lastLogin > now) {
                console.warn("[Security] Chronons Unstable. Resetting timeline.")
                lastLogin = now
            }

            const diffMs = now - lastLogin

            // Passive Income Rate (simplified: €0.001/ms base)
            let rate = 0.0001

            // Apply Upgrade Multipliers to Offline Earnings too
            if (saved.upgrades?.acoustic_foam > 0) {
                rate *= (1 + (saved.upgrades.acoustic_foam * 0.1))
            }

            const offlineEarnings = diffMs * rate

            if (diffMs > 1000) {
                console.log(`[Offline] Gone for ${diffMs}ms. Earned €${offlineEarnings.toFixed(2)}`)
            }

            set({
                ...DEFAULT_STATE, // Merge with default to ensure new fields (like upgrades) exist if loading old save
                ...saved,
                resources: {
                    ...saved.resources,
                    cash: saved.resources.cash + (offlineEarnings > 0 ? offlineEarnings : 0)
                },
                lastLogin: now
            })
        }
    },

    save: async () => {
        const state = get()
        // Only extract data we want to persist
        const dataToSave: GameState = {
            resources: state.resources,
            upgrades: state.upgrades,
            rivals: state.rivals,
            lastLogin: Date.now(),

            playerClass: state.playerClass,
            subGenre: state.subGenre,
            stats: state.stats,
            settings: state.settings,
            b2bActive: state.b2bActive
        }
        await db.saveGame(dataToSave)
    },

    touchGrass: () => {
        set((state) => ({
            resources: {
                ...state.resources,
                energy: Math.min(100, (state.resources.energy || 0) + 10)
            }
        }))
    },

    reset: async () => {
        set(DEFAULT_STATE)
        await db.saveGame({ ...DEFAULT_STATE, lastLogin: Date.now() })
    },

    buyConsumable: (id) => {
        const state = get()
        let cost = 0
        let energyGain = 0
        let integrityCost = 0

        if (id === 'yerba_mate') { cost = 50; energyGain = 20 }
        if (id === 'nootropic_stack') { cost = 200; energyGain = 50 }
        if (id === 'unauthorized_stimulant') { cost = 1000; energyGain = 100; integrityCost = 5 }

        if (state.resources.cash >= cost) {
            vibrate(HAPTIC_Patterns.success)
            set((state) => ({
                resources: {
                    ...state.resources,
                    cash: state.resources.cash - cost,
                    energy: Math.min(100, (state.resources.energy || 0) + energyGain),
                    integrity: Math.max(0, state.resources.integrity - integrityCost)
                }
            }))
        }
    },

    buyGhostTrack: () => {
        // Progressive Cost Mechanism
        const state = get()
        const tracksBought = state.stats?.ghostTracksBought || 0

        // Cost formulation: Base 500 * (1.5 ^ tracks)
        const cost = Math.floor(500 * Math.pow(1.5, tracksBought))
        // Integrity Hit: Base 5 + tracks
        const integrityHit = 5 + tracksBought
        // Hype Reward (Static for now, could scale down to simulate diminishing returns)
        const hypeReward = 200

        if (state.resources.cash >= cost && state.resources.integrity >= integrityHit) {
            vibrate(HAPTIC_Patterns.warning)
            set((state) => ({
                resources: {
                    ...state.resources,
                    cash: state.resources.cash - cost,
                    hype: state.resources.hype + hypeReward,
                    integrity: Math.max(0, state.resources.integrity - integrityHit)
                },
                stats: {
                    ...state.stats,
                    ghostTracksBought: tracksBought + 1
                }
            }))
        }
    }
    ,

    setSubGenre: (genre) => {
        set({ subGenre: genre })
        get().save()
    },

    runRadioShow: () => {
        // Weekly Event Logic
        const state = get()

        // Cost: 50 Energy
        if ((state.resources.energy || 0) < 50) return

        // Reward: Integrity & Hype based on SubGenre
        let integrityGain = 10
        let hypeGain = 500

        // Synergy Bonuses
        if (state.subGenre === 'DeepTrance') integrityGain *= 2
        if (state.subGenre === 'BigRoom') hypeGain *= 1.5

        set((state) => ({
            resources: {
                ...state.resources,
                energy: Math.max(0, (state.resources.energy || 0) - 50),
                integrity: Math.min(100, state.resources.integrity + integrityGain),
                hype: state.resources.hype + hypeGain
            }
        }))
        get().save()
    },

    b2bActive: false,

    startB2B: () => {
        set({ b2bActive: true })
        vibrate(HAPTIC_Patterns.drop)
    }
}))
