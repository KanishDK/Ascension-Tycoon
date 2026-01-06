import { useGameStore } from '../store/gameStore'

export const OfficeView = () => {
    const { resources } = useGameStore()

    return (
        <div className="flex flex-col gap-6 w-full max-w-md pb-24 animate-fade-in">
            {/* Header / Stats Card */}
            <div className="bg-black/30 backdrop-blur-md border border-neon-cyan/30 p-8 rounded-xl shadow-[0_0_15px_rgba(89,240,255,0.1)] w-full">
                <h1 className="text-3xl font-bold text-neon-cyan mb-6 tracking-tighter uppercase text-center drop-shadow-[0_0_5px_rgba(89,240,255,0.8)]">
                    ARTIST DASHBOARD
                </h1>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-gray-400 font-mono uppercase text-sm">ROYALTIES</span>
                        <span className="text-2xl text-acid-lime font-bold font-mono">€{resources.cash.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-gray-400 font-mono uppercase text-sm">Global Hype</span>
                        <span className="text-xl text-neon-magenta font-bold font-mono">{resources.hype.toFixed(0)}</span>
                    </div>

                    <span className="text-xl text-white font-bold font-mono">{resources.integrity}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-mono uppercase text-sm">Vitality</span>
                    <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold font-mono ${resources.energy < 20 ? 'text-red-500 animate-pulse' : 'text-neon-cyan'}`}>
                            {Math.floor(resources.energy || 100)}%
                        </span>
                        <button
                            onClick={() => useGameStore.getState().touchGrass()}
                            className="bg-green-500/20 hover:bg-green-500/40 text-green-500 border border-green-500/50 px-2 py-1 rounded text-[10px] uppercase font-bold transition-all active:scale-95"
                        >
                            Touch Grass
                        </button>
                    </div>
                </div>

                {/* SETTINGS TOGGLE */}
                <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                    <span className="text-gray-400 font-mono uppercase text-xs">Low Power Mode</span>
                    <button
                        onClick={() => useGameStore.getState().toggleLowPowerMode()} // Direct access to store action
                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${useGameStore.getState().settings?.lowPowerMode ? 'bg-neon-lime' : 'bg-white/10'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${useGameStore.getState().settings?.lowPowerMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>


            {/* Placeholder for future upgrades */}
            {/* THE LABORATORY (Consumables) */}
            <div className="bg-void-navy/50 border border-white/5 p-6 rounded-lg backdrop-blur-sm">
                <h2 className="text-lg text-white font-bold mb-4 uppercase tracking-wider border-b border-white/10 pb-2 flex justify-between">
                    <span>THE LABORATORY</span>
                    <span className="text-xs text-neon-cyan font-mono animate-pulse">OPEN 24/7</span>
                </h2>

                <div className="space-y-3">
                    <button
                        onClick={() => useGameStore.getState().buyConsumable('yerba_mate')}
                        disabled={resources.cash < 50}
                        className="w-full flex justify-between items-center bg-black/40 hover:bg-neon-lime/10 border border-white/5 hover:border-neon-lime/50 p-3 rounded transition-all disabled:opacity-50"
                    >
                        <div className="text-left">
                            <div className="text-white font-bold text-sm">Yerba Mate</div>
                            <div className="text-[10px] text-gray-500">Natural caffeine. +20 Energy</div>
                        </div>
                        <div className="text-neon-cyan font-mono text-xs">€50</div>
                    </button>

                    <button
                        onClick={() => useGameStore.getState().buyConsumable('nootropic_stack')}
                        disabled={resources.cash < 200}
                        className="w-full flex justify-between items-center bg-black/40 hover:bg-neon-magenta/10 border border-white/5 hover:border-neon-magenta/50 p-3 rounded transition-all disabled:opacity-50"
                    >
                        <div className="text-left">
                            <div className="text-white font-bold text-sm">Nootropic Stack</div>
                            <div className="text-[10px] text-gray-500">Focus enhancement. +50 Energy</div>
                        </div>
                        <div className="text-neon-cyan font-mono text-xs">€200</div>
                    </button>

                    <button
                        onClick={() => useGameStore.getState().buyConsumable('unauthorized_stimulant')}
                        disabled={resources.cash < 1000}
                        className="w-full flex justify-between items-center bg-black/40 hover:bg-red-500/10 border border-white/5 hover:border-red-500/50 p-3 rounded transition-all disabled:opacity-50 group"
                    >
                        <div className="text-left">
                            <div className="text-white font-bold text-sm group-hover:text-red-500 transition-colors">Experimental Stimulant</div>
                            <div className="text-[10px] text-gray-500">Dangerous. +100 Energy. -5 Integrity.</div>
                        </div>
                        <div className="text-neon-cyan font-mono text-xs">€1,000</div>
                    </button>
                </div>
            </div>

            {/* ARTIST IDENTITY (Sub-Genre) */}
            <div className="bg-void-navy/50 border border-white/5 p-6 rounded-lg backdrop-blur-sm">
                <h2 className="text-lg text-white font-bold mb-4 uppercase tracking-wider border-b border-white/10 pb-2">
                    SONIC IDENTITY
                </h2>
                {!useGameStore.getState().subGenre ? (
                    <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => useGameStore.getState().setSubGenre('Psytrance')} className="p-3 bg-orange-900/20 border border-orange-500/30 hover:bg-orange-500/20 rounded text-left">
                            <div className="font-bold text-orange-500">PSYTRANCE</div>
                            <div className="text-[10px] text-gray-400">Dusty Raves. Speed +20%.</div>
                        </button>
                        <button onClick={() => useGameStore.getState().setSubGenre('DeepTrance')} className="p-3 bg-blue-900/20 border border-blue-500/30 hover:bg-blue-500/20 rounded text-left">
                            <div className="font-bold text-blue-500">DEEP TRANCE</div>
                            <div className="text-[10px] text-gray-400">Rainy Vibes. Integrity +20%.</div>
                        </button>
                        <button onClick={() => useGameStore.getState().setSubGenre('BigRoom')} className="p-3 bg-purple-900/20 border border-purple-500/30 hover:bg-purple-500/20 rounded text-left">
                            <div className="font-bold text-purple-500">BIG ROOM</div>
                            <div className="text-[10px] text-gray-400">Massive Crowds. Cash +20%.</div>
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-4 bg-black/20 rounded border border-white/5">
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Current Style</div>
                        <div className="text-2xl font-black italic text-white mt-1">
                            {useGameStore.getState().subGenre?.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}
