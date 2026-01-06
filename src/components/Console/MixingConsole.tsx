import { useState, useEffect } from 'react'
import { AudioEngine } from '../../audio/AudioEngine'
import { useGameStore } from '../../store/gameStore'
import { clsx } from 'clsx'

interface MixingConsoleProps {
    bpm: number
}

export const MixingConsole = ({ bpm }: MixingConsoleProps) => {
    const [release, setRelease] = useState(250)
    const [drive, setDrive] = useState(0) // 0-100
    const [score, setScore] = useState(0)
    const [isClean, setIsClean] = useState(false)
    const { upgrades } = useGameStore()

    const targetMs = 60000 / bpm
    const tolerance = 50 + ((upgrades?.monitor_speakers || 0) * 20)

    useEffect(() => {
        AudioEngine.getInstance().setCompressorRelease(release)
        AudioEngine.getInstance().setDrive(drive)

        const diff = Math.abs(release - targetMs)
        // Drive penalty: If drive is too high (>80), score drops regardless of release
        const drivePenalty = Math.max(0, (drive - 70) * 2)

        if (diff < tolerance) {
            setIsClean(true)
            setScore(Math.max(0, (100 - diff) - drivePenalty))
        } else {
            setIsClean(false)
            setScore(Math.max(0, (50 - diff) - drivePenalty))
        }
    }, [release, drive, bpm, targetMs])

    // Sausage Face Logic
    const getFace = () => {
        if (drive < 30) return '( ◡́.◡̀)' // Chill
        if (drive < 70) return '( o . o)' // Concerned
        return '( > ▃ < )' // Crushed
    }

    return (
        <div className="bg-void-navy/80 p-6 rounded-xl border border-white/10 backdrop-blur-md w-full max-w-md mx-auto relative overflow-hidden group">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-neon-cyan font-orbitron tracking-wider text-lg">MASTERING CHAIN</h3>
                <div className={clsx(
                    "px-3 py-1 rounded-full text-xs font-bold transition-all duration-300",
                    isClean && drive < 80 ? "bg-neon-lime/20 text-neon-lime shadow-[0_0_10px_#bbd440]" : "bg-red-500/20 text-red-500"
                )}>
                    {isClean && drive < 80 ? "IDEAL DYNAMICS" : drive > 80 ? "DIGITAL DISTORTION" : "MUDDY"}
                </div>
            </div>

            {/* SAUSAGE VISUALIZER */}
            <div className="absolute top-2 right-6 text-xs font-mono text-neon-lime z-10">
                SCORE: {score.toFixed(0)}%
            </div>
            <div className="h-40 bg-black/40 rounded-lg mb-6 relative flex items-center justify-center overflow-hidden border border-white/5">
                <div
                    className="transition-all duration-100 flex items-center justify-center font-black text-2xl text-black/50 shadow-lg"
                    style={{
                        width: `${50 + (drive * 1.5)}%`,
                        height: `${50 + (drive * 0.4)}%`,
                        backgroundColor: `hsl(${120 - drive}, 100%, 50%)`,
                        borderRadius: `${50 - (drive * 0.4)}px`, // Becomes more square
                        transform: `scale(${1 + (drive / 200)})`,
                        boxShadow: `0 0 ${drive}px hsl(${120 - drive}, 100%, 50%)`
                    }}
                >
                    <span
                        className="transition-transform duration-75 block"
                        style={{ transform: `rotate(${Math.random() * (drive / 10)}deg)` }}
                    >
                        {getFace()}
                    </span>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="space-y-6">
                {/* Release */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neon-cyan/70 font-mono">
                        <span>COMP RELEASE (MS)</span>
                        <span>{release}ms</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={release}
                        onChange={(e) => setRelease(Number(e.target.value))}
                        className="w-full h-2 bg-void-navy rounded-lg appearance-none cursor-pointer accent-neon-cyan hover:accent-white transition-colors"
                    />
                </div>

                {/* Drive */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neon-magenta/70 font-mono">
                        <span>TUBE DRIVE (SATURATION)</span>
                        <span>{drive}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={drive}
                        onChange={(e) => setDrive(Number(e.target.value))}
                        className="w-full h-2 bg-void-navy rounded-lg appearance-none cursor-pointer accent-neon-magenta hover:accent-red-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    )
}
