import { useState } from 'react'
import { AudioEngine } from '../audio/AudioEngine'

export const StudioPanel = () => {
    const [filterFreq, setFilterFreq] = useState(20000)
    const [drive, setDrive] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const engine = AudioEngine.getInstance()

    // Initialize Audio Context on first user interaction
    const handleStart = async () => {
        await engine.init()
        engine.resume()
        setIsPlaying(true)
        engine.playTone(138, 'sawtooth') // Baseline Bass

        // Rhythm loop simulation
        const loop = setInterval(() => {
            if (Math.random() > 0.5) engine.playTone(138, 'sawtooth')
            else engine.playTone(276, 'square')
        }, 428) // approx 140 BPM (60000 / 140 = 428ms)

        return () => clearInterval(loop)
    }

    const handleFilterChange = (val: number) => {
        setFilterFreq(val)
        engine.setFilterFreq(val)
    }

    const handleDriveChange = (val: number) => {
        setDrive(val)
        engine.setDrive(val)
    }

    return (
        <div className="bg-void-navy/80 border border-neon-cyan/20 p-6 rounded-lg backdrop-blur-sm mt-8 w-full max-w-md">
            <h2 className="text-xl text-neon-cyan font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-acid-lime rounded-full animate-pulse" />
                THE STUDIO
            </h2>

            <div className="space-y-6">

                {/* PLAY BUTTON */}
                <button
                    onClick={handleStart}
                    className="w-full bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan text-neon-cyan py-3 rounded uppercase font-bold tracking-widest transition-all"
                >
                    {isPlaying ? 'Sequencer Running' : 'Initialize Audio Engine'}
                </button>

                {/* FILTER KNOB */}
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Low Pass Filter</label>
                    <input
                        type="range"
                        min="20"
                        max="20000"
                        step="100"
                        value={filterFreq}
                        onChange={(e) => handleFilterChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                    />
                    <div className="flex justify-between text-xs text-gray-500 font-mono">
                        <span>20Hz</span>
                        <span>{filterFreq}Hz</span>
                        <span>20kHz</span>
                    </div>
                </div>

                {/* LOUDNESS WAR (DRIVE) */}
                <div className="space-y-2">
                    <label className="text-xs text-neon-magenta uppercase tracking-widest flex justify-between">
                        <span>Loudness War (Limiter)</span>
                        <span>{drive}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={drive}
                        onChange={(e) => handleDriveChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-magenta"
                    />
                    <p className="text-[10px] text-gray-500 leading-tight">
                        WARNING: High values will cause digital clipping (Red-lining).
                        This increases "Loudness" but decreases "Integrity".
                    </p>
                </div>

            </div>
        </div>
    )
}
