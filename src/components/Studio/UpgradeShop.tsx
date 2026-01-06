import { useGameStore } from '../../store/gameStore'
import { clsx } from 'clsx'

const UPGRADES = [
    {
        id: 'acoustic_foam',
        name: 'Acoustic Foam',
        baseCost: 150,
        effect: '+10% Passive Income',
        description: 'Reduce reverb for cleaner mixes. Labels pay more.'
    },
    {
        id: 'monitor_speakers',
        name: 'KRK Monitors',
        baseCost: 500,
        effect: 'Easier Mixing',
        description: 'Hear the bass clearly. Increases mix tolerance by 20ms.'
    },
    {
        id: 'subwoofer',
        name: 'Subwoofer',
        baseCost: 1000,
        effect: '+5 Hype / Click',
        description: 'Feel the rumble. Neighbors hate you, fans love you.'
    },
    {
        id: 'tour_manager',
        name: 'Tour Manager',
        baseCost: 5000,
        effect: 'Auto-Fix Disasters',
        description: 'Prevents trainwrecks while you focus on the crowd.'
    }
]

export const UpgradeShop = () => {
    const { resources, upgrades, buyUpgrade } = useGameStore()

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-void-navy/60 border border-white/10 rounded-xl backdrop-blur-md">
            <h2 className="text-xl font-orbitron text-neon-cyan mb-6 tracking-widest border-b border-white/10 pb-2">
                STUDIO HARWARE
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {UPGRADES.map((item) => {
                    const currentLevel = upgrades?.[item.id] || 0
                    // Simple cost scaling: Base * (1.5 ^ Level)
                    const cost = Math.floor(item.baseCost * Math.pow(1.5, currentLevel))
                    const canAfford = resources.cash >= cost

                    return (
                        <div key={item.id} className="relative group bg-black/40 p-4 rounded-lg border border-white/5 hover:border-neon-cyan/50 transition-all duration-300">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white group-hover:text-neon-cyan transition-colors">
                                    {item.name}
                                </h3>
                                <div className="text-xs font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded">
                                    Lvl {currentLevel}
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-white/60 mb-1 font-light min-h-[2.5em]">
                                {item.description}
                            </p>
                            <div className="text-xs text-neon-magenta font-mono mb-4">
                                {item.effect}
                            </div>

                            {/* Buy Button */}
                            <button
                                onClick={() => buyUpgrade(item.id, cost)}
                                disabled={!canAfford}
                                className={clsx(
                                    "w-full py-2 rounded font-orbitron text-xs tracking-wider transition-all duration-200 uppercase",
                                    canAfford
                                        ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(89,240,255,0.5)]"
                                        : "bg-white/5 text-white/20 cursor-not-allowed border border-transparent"
                                )}
                            >
                                {canAfford ? `BUY €${cost.toLocaleString()}` : `NEED €${cost.toLocaleString()}`}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
