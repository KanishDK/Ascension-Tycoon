import { Briefcase, Mic2, Zap } from 'lucide-react'
import { clsx } from 'clsx'

export type ViewType = 'office' | 'studio' | 'live' | 'world'

interface BottomNavProps {
    currentView: ViewType
    onNavigate: (view: ViewType) => void
}

export const BottomNav = ({ currentView, onNavigate }: BottomNavProps) => {

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none flex justify-center">
            <nav className="bg-void-navy/90 backdrop-blur-xl border border-neon-cyan/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] p-2 pointer-events-auto flex items-center gap-2 max-w-sm w-full">

                {/* OFFICE BUTTON */}
                <button
                    onClick={() => onNavigate('office')}
                    className={clsx(
                        "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-300",
                        currentView === 'office'
                            ? "bg-neon-cyan/10 text-neon-cyan shadow-[0_0_10px_rgba(89,240,255,0.2)]"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                >
                    <Briefcase size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Empire</span>
                </button>

                {/* STUDIO BUTTON */}
                <button
                    onClick={() => onNavigate('studio')}
                    className={clsx(
                        "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-300",
                        currentView === 'studio'
                            ? "bg-neon-magenta/10 text-neon-magenta shadow-[0_0_10px_rgba(231,48,93,0.2)]"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                >
                    <Mic2 size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Studio</span>
                </button>

                {/* LIVE BUTTON */}
                <button
                    onClick={() => onNavigate('live')}
                    className={clsx(
                        "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group",
                        currentView === 'live'
                            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-acid-lime/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Zap size={20} className={currentView === 'live' ? "fill-current" : ""} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                </button>

                {/* WORLD BUTTON */}
                <button
                    onClick={() => onNavigate('world')}
                    className={clsx(
                        "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-300",
                        currentView === 'world'
                            ? "bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                >
                    <div className="text-xl">🌍</div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">World</span>
                </button>
            </nav>
        </div>
    )
}
