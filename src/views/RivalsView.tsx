import { useGameStore } from '../store/gameStore'
import { clsx } from 'clsx'

const RIVALS = [
    {
        id: 'charlotte',
        name: 'Charlotte de Witte',
        title: 'Techno Queen',
        rank: '#1',
        requiredHype: 5000,
        description: 'Dominates the Business Techno scene. Uses Instagram algos to crush competition.',
        imgColor: 'bg-red-500'
    },
    {
        id: 'mainstage_mike',
        name: 'Mainstage Mike',
        title: 'Clap Stack Specialist',
        rank: '#50',
        requiredHype: 20000,
        description: 'Plays pre-recorded sets. Spams "1, 2, 3, Jump!" every 30 seconds.',
        imgColor: 'bg-orange-500'
    },
    {
        id: 'armin',
        name: 'Armin van Buuren',
        title: 'God of Trance',
        rank: '#0',
        requiredHype: 50000,
        description: 'The final boss. Controls the "State of Trance". You need a miracle to win.',
        imgColor: 'bg-blue-500'
    }
]

export const RivalsView = () => {
    const { resources, rivals, defeatRival, addCash } = useGameStore()

    const handleAttack = (rivalId: string, type: 'diss' | 'bots') => {
        // Simple Battle Logic
        if (type === 'diss') {
            // High Risk, High Reward
            if (resources.integrity >= 20) {
                defeatRival(rivalId) // Instant win for prototype
                // Cost Integity
                // In a full game, this would be a minigame
            }
        } else {
            // Expensive
            if (resources.cash >= 10000) {
                addCash(-10000)
                defeatRival(rivalId)
            }
        }
    }

    return (
        <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    GLOBAL SCENE
                </h1>
                <p className="text-white/50 font-mono text-xs tracking-[0.2em] uppercase opacity-80">
                    Dominate Rivals / Climb Beatport Charts
                </p>
            </div>

            {/* Stats Bar */}
            <div className="flex justify-between bg-black/40 p-4 rounded-lg border border-white/10 font-mono text-xs">
                <div>
                    <span className="text-white/40">HYPE:</span>
                    <span className="ml-2 text-neon-magenta font-bold">{Math.floor(resources.hype).toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-white/40">INTEGRITY:</span>
                    <span className="ml-2 text-acid-lime font-bold">{Math.floor(resources.integrity)}%</span>
                </div>
            </div>

            {/* Rivals List */}
            <div className="space-y-6">
                {RIVALS.map((rival) => {
                    const isDefeated = rivals[rival.id]
                    const isUnlocked = resources.hype >= rival.requiredHype

                    return (
                        <div key={rival.id} className={clsx(
                            "relative overflow-hidden rounded-xl border-2 transition-all duration-300",
                            isDefeated ? "border-neon-lime bg-neon-lime/5 opacity-50 grayscale" :
                                isUnlocked ? "border-white/20 bg-void-navy" : "border-white/5 bg-black/60 opacity-60"
                        )}>

                            {/* LOCKED OVERLAY */}
                            {!isUnlocked && !isDefeated && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
                                    <div className="text-center">
                                        <div className="text-2xl">🔒</div>
                                        <div className="text-xs font-mono text-white/50 mt-2">REQUIRES {rival.requiredHype.toLocaleString()} HYPE</div>
                                    </div>
                                </div>
                            )}

                            {/* DEFEATED STAMP */}
                            {isDefeated && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                    <div className="text-neon-lime font-black text-4xl -rotate-12 border-4 border-neon-lime p-2 rounded-lg opacity-80">
                                        DEFEATED
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-black italic text-white">{rival.name}</h2>
                                        <div className="text-xs font-mono text-neon-cyan">{rival.title}</div>
                                    </div>
                                    <div className="text-4xl font-black text-white/10">{rival.rank}</div>
                                </div>

                                <p className="text-sm text-white/60 mb-6 font-light">{rival.description}</p>

                                {/* ACTIONS */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleAttack(rival.id, 'diss')}
                                        disabled={!isUnlocked || isDefeated || resources.integrity < 20}
                                        className="bg-red-500/10 hover:bg-red-500/30 text-red-500 border border-red-500/50 py-2 rounded text-xs font-bold font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        PUBLIC FEUD
                                        <span className="block text-[10px] opacity-60 mt-1">COST: 20 INTEGRITY</span>
                                    </button>
                                    <button
                                        onClick={() => handleAttack(rival.id, 'bots')}
                                        disabled={!isUnlocked || isDefeated || resources.cash < 10000}
                                        className="bg-neon-cyan/10 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50 py-2 rounded text-xs font-bold font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        BUY CLICK FARM
                                        <span className="block text-[10px] opacity-60 mt-1">COST: €10,000</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* MOCK LEADERBOARD */}
            <div className="mt-12 p-6 bg-void-navy/40 border border-white/5 rounded-xl">
                <h2 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                    <span className="text-neon-cyan">🏆</span>
                    GLOBAL RANKINGS
                </h2>
                <div className="space-y-2">
                    {[
                        { name: 'DJ Void', hype: resources.hype * 1.5 },
                        { name: 'YOU', hype: resources.hype, highlight: true },
                        { name: 'Neon Glitch', hype: resources.hype * 0.8 },
                        { name: 'Synth Wave', hype: resources.hype * 0.5 },
                    ].sort((a, b) => b.hype - a.hype).map((entry, i) => (
                        <div key={i} className={`flex justify-between items-center p-2 rounded ${entry.highlight ? 'bg-neon-magenta/20 border border-neon-magenta/50' : 'bg-black/20'}`}>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-white/50 w-4">#{i + 1}</span>
                                <span className={`font-bold ${entry.highlight ? 'text-white' : 'text-gray-400'}`}>{entry.name}</span>
                            </div>
                            <span className="font-mono text-xs text-neon-cyan">{Math.floor(entry.hype).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>


            {/* WEEKLY RADIO SHOW */}
            <button
                onClick={() => useGameStore.getState().runRadioShow()}
                disabled={resources.energy < 50}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 p-6 rounded-xl border border-white/20 shadow-lg group transition-all"
            >
                <div className="flex justify-between items-center">
                    <div className="text-left">
                        <h2 className="text-2xl font-black italic text-white flex items-center gap-2">
                            🎙 HOST RADIO SHOW
                        </h2>
                        <div className="text-xs font-mono text-indigo-200 mt-1">
                            Curate tracks. Gain massive Hype.
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-white/50 mb-1">COST</div>
                        <div className="text-xl font-mono text-white group-hover:text-red-300">50 ENERGY</div>
                    </div>
                </div>
            </button>

            {/* B2B BATTLE ARENA (End Game) */}
            < div className="mt-8 pt-8 border-t border-white/10" >
                <h2 className="text-2xl font-black italic text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-6 drop-shadow-md">
                    ⚠️ B2B WORLD TOUR
                </h2>

                {
                    !Object.values(rivals).every(Boolean) ? (
                        <div className="text-center p-8 bg-black/40 border border-white/5 rounded-xl">
                            <div className="text-4xl mb-4 grayscale opacity-30">🤝</div>
                            <div className="text-white/50 font-mono text-sm">DEFEAT ALL RIVALS TO UNLOCK CO-OP MODE</div>
                        </div>
                    ) : !useGameStore.getState().b2bActive ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => useGameStore.getState().startB2B()}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-xl border-2 border-white/20 hover:scale-[1.02] transition-transform"
                            >
                                <div className="text-2xl font-black text-white">CHALLENGE "THE CORPORATION"</div>
                                <div className="text-sm text-white/70 mt-1 font-mono">PARTNER: CHARLOTTE DE WITTE</div>
                            </button>
                            <div className="text-center text-xs text-white/30 font-mono">
                                WARNING: EXTREME DIFFICULTY. EPILEPSY WARNING.
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-red-900/20 border-2 border-red-500 rounded-xl animate-pulse">
                            <div className="text-center">
                                <div className="text-4xl font-black text-red-500 mb-2">BATTLE ACTIVE</div>
                                <div className="text-white font-mono text-sm">BOSS HP: 1,000,000 / 1,000,000</div>
                                {/* Placeholder for actual battle logic */}
                                <div className="mt-4 text-xs text-red-300">Tap to deal damage! (Mechanic WIP)</div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    )
}
