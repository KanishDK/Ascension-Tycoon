import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { useGameStore } from '../store/gameStore'
import { AlertTriangle } from 'lucide-react'
import { vibrate, HAPTIC_Patterns } from '../utils/haptics'

type DisasterType = 'none' | 'usb_corrupt' | 'sync_drift'

export const LiveView = () => {
    const { addHype, addCash, upgrades } = useGameStore()
    const [disaster, setDisaster] = useState<DisasterType>('none')
    const [hypeRate, setHypeRate] = useState(0)
    const [lastMerchSale, setLastMerchSale] = useState<string | null>(null)

    // TOUR MANAGER AUTOMATION
    useEffect(() => {
        if (disaster !== 'none' && (upgrades?.tour_manager || 0) > 0) {
            const timer = setTimeout(() => {
                fixDisaster()
            }, 3000) // 3 second delay
            return () => clearTimeout(timer)
        }
    }, [disaster, upgrades?.tour_manager])

    // MERCH STAND LOGIC (Passive Income)
    useEffect(() => {
        const interval = setInterval(() => {
            if (disaster !== 'none') return

            // Sales Logic
            const roll = Math.random()
            let sale = null

            if (roll > 0.9) sale = { item: 'Limited Vinyl', price: 50 }
            else if (roll > 0.6) sale = { item: 'Tour Tee', price: 25 }
            else if (roll > 0.2) sale = { item: 'Glow Sticks', price: 5 }

            if (sale) {
                addCash(sale.price)
                setLastMerchSale(`+€${sale.price} (${sale.item})`)
                // Clear notification after 2s
                setTimeout(() => setLastMerchSale(null), 2000)
            }

        }, 2000) // Check every 2 seconds
        return () => clearInterval(interval)
    }, [disaster])

    // RNG Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (disaster !== 'none') return // Don't stack disasters

            // 10% chance every 2 seconds to trigger disaster
            if (Math.random() < 0.1) {
                const type = Math.random() > 0.5 ? 'usb_corrupt' : 'sync_drift'
                setDisaster(type)
                setHypeRate(0) // Stop hype generation
                vibrate(HAPTIC_Patterns.error)
            } else {
                // Passive Hype Generation while Performin
                const gain = Math.floor(Math.random() * 5) + 1
                addHype(gain)
                setHypeRate(gain)
            }
        }, 2000)
        return () => clearInterval(interval)
    }, [disaster])

    const fixDisaster = () => {
        setDisaster('none')
        addHype(50) // Bonus for saving it
        vibrate(HAPTIC_Patterns.success)
    }

    return (
        <div className="flex flex-col justify-end h-full pb-32 px-4 animate-fade-in pointer-events-none relative">

            {/* MERCH STAND NOTIFICATION */}
            {lastMerchSale && (
                <div className="absolute top-20 right-4 animate-in slide-in-from-right fade-in duration-300 pointer-events-auto">
                    <div className="bg-neon-lime/20 border border-neon-lime/50 px-3 py-1 rounded-full backdrop-blur-md">
                        <span className="text-neon-lime font-mono font-bold text-xs">🛍️ {lastMerchSale}</span>
                    </div>
                </div>
            )}

            {/* DISASTER OVERLAY */}
            {disaster !== 'none' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-500/20 backdrop-blur-sm pointer-events-auto animate-pulse">
                    <div className="bg-black/90 p-8 rounded-2xl border-4 border-red-500 text-center space-y-4 max-w-sm mx-4 shadow-[0_0_50px_red]">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
                        <h2 className="text-3xl font-black text-white italic">
                            {disaster === 'usb_corrupt' ? 'LINK ERROR E-8307' : 'BEATMATCH DRIFT'}
                        </h2>
                        <p className="text-red-200 font-mono text-sm">
                            {disaster === 'usb_corrupt' ? 'Audio dropout detected via LINK protocol.' : 'Phase alignment critical. Trainwreck imminent.'}
                        </p>
                        <button
                            onClick={fixDisaster}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-xl transition-all active:scale-95"
                        >
                            {disaster === 'usb_corrupt' ? 'ENGAGE EMERGENCY LOOP' : 'RIDE THE PITCH'}
                        </button>
                    </div>
                </div>
            )}

            {/* STATUS UI */}
            <div className={clsx(
                "p-6 rounded-xl border backdrop-blur-md transition-all duration-300 pointer-events-auto",
                disaster === 'none' ? "bg-black/40 border-white/10" : "bg-red-900/40 border-red-500/50"
            )}>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Main Stage
                        </h1>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neon-cyan/80 mt-1">
                            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
                            <span>Live Feed</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-white">{hypeRate > 0 ? `+${hypeRate}` : '0'}</div>
                        <div className="text-[10px] text-white/50 uppercase">Hype / Sec</div>
                    </div>
                </div>

                {/* VISUALIZER DUMMY */}
                <div className="flex gap-1 h-12 items-end justify-center opacity-80">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-2 bg-neon-magenta rounded-t-sm"
                            style={{
                                height: `${disaster === 'none' ? Math.random() * 100 : 10}%`,
                                transition: 'height 100ms ease'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
