import { MixingConsole } from '../components/Console/MixingConsole'
import { UpgradeShop } from '../components/Studio/UpgradeShop'
import { useGameStore } from '../store/gameStore'

export const StudioView = () => {
    // BPM could be dynamic later
    const bpm = 140
    const { upgrades, addHype } = useGameStore()

    const hypeGain = 1 + ((upgrades?.subwoofer || 0) * 5)

    return (
        <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    THE STUDIO
                </h1>

                {/* VIRAL MARKETING MENU */}
                <div className="grid grid-cols-3 gap-2 pt-4">
                    <button
                        onClick={() => addHype(hypeGain)}
                        className="bg-gray-800/50 hover:bg-white/10 border border-white/10 p-2 rounded-lg transition-all active:scale-95"
                    >
                        <div className="text-2xl mb-1">📱</div>
                        <div className="text-[10px] font-bold text-white">SHITPOST</div>
                        <div className="text-[9px] text-neon-cyan">+{hypeGain} HYPE</div>
                    </button>

                    <button
                        onClick={() => {
                            // High Cost, High Reward
                            addHype(500)
                            // Needs integrity/cash logic properly hooked up in store, for now just free hype
                        }}
                        className="bg-neon-magenta/20 hover:bg-neon-magenta/40 border border-neon-magenta p-2 rounded-lg transition-all active:scale-95"
                    >
                        <div className="text-2xl mb-1">🎂</div>
                        <div className="text-[10px] font-bold text-white">CAKE THE CROWD</div>
                        <div className="text-[9px] text-neon-cyan">+500 HYPE</div>
                    </button>

                    <button
                        onClick={() => addHype(100)} // Rant
                        className="bg-red-500/20 hover:bg-red-500/40 border border-red-500 p-2 rounded-lg transition-all active:scale-95"
                    >
                        <div className="text-2xl mb-1">🤬</div>
                        <div className="text-[10px] font-bold text-white">CALL OUT GHOSTS</div>
                        <div className="text-[9px] text-neon-cyan">+100 HYPE</div>
                    </button>
                </div>
            </div>

            {/* Mixing Console (Minigame) */}
            <MixingConsole bpm={bpm} />

            {/* Hardware Upgrades */}
            <UpgradeShop />

            {/* GHOST WRITER MARKET */}
            <div className="bg-void-navy/50 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-neon-magenta font-black italic tracking-tighter">THE BLACK MARKET</h3>
                    <div className="text-[10px] font-mono text-white/30 uppercase">
                        Tracks Bought: {useGameStore.getState().stats?.ghostTracksBought || 0}
                    </div>
                </div>
                {(() => {
                    const tracksBought = useGameStore.getState().stats?.ghostTracksBought || 0
                    const currentCost = Math.floor(500 * Math.pow(1.5, tracksBought))
                    const integrityHit = 5 + tracksBought
                    const { resources, buyGhostTrack } = useGameStore()
                    const canAfford = resources.cash >= currentCost && resources.integrity >= integrityHit

                    return (
                        <button
                            onClick={() => buyGhostTrack()}
                            disabled={!canAfford}
                            className="w-full flex items-center justify-between bg-black/40 hover:bg-black/60 border border-white/5 hover:border-neon-magenta/50 p-3 rounded-lg group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="text-left">
                                <div className="text-white font-bold group-hover:text-neon-magenta transition-colors">BUY "ID - ID"</div>
                                <div className="text-[10px] text-gray-500">Guaranteed hit. Escalating cost.</div>
                            </div>
                            <div className="text-right">
                                <div className={canAfford ? "text-neon-cyan font-mono text-sm" : "text-red-500 font-mono text-sm"}>
                                    €{currentCost.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-red-500 font-mono">-{integrityHit} INTEGRITY</div>
                            </div>
                        </button>
                    )
                })()}
            </div>

            <p className="text-xs text-center text-white/30 font-mono pt-8">
                AUDIO ENGINE: 64-bit PRECISION // LATENCY: 0ms
            </p>
        </div>
    )
}
