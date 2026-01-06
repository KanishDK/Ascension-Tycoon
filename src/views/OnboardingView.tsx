import { useGameStore } from '../store/gameStore'

export const OnboardingView = () => {
    const { setClass } = useGameStore()

    const classes = [
        {
            id: 'Virtuoso',
            title: 'THE VIRTUOSO',
            subtitle: '"Respect the BPM"',
            desc: 'Start with nothing but talent. Mixing is easier.',
            bonus: 'BONUS: +20ms Mixing Tolerance',
            start: '€100',
            color: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10'
        },
        {
            id: 'IndustryPlant',
            title: 'INDUSTRY PLANT',
            subtitle: '"Fake it till you make it"',
            desc: 'Daddy paid for your studio. No integrity, all cash.',
            bonus: 'BONUS: Start Rich',
            start: '€50,000',
            color: 'border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10'
        },
        {
            id: 'AINative',
            title: 'AI NATIVE',
            subtitle: '"Prompt it till you make it"',
            desc: 'You don\'t produce, you prompt. High efficiency.',
            bonus: 'BONUS: +25% Passive Income',
            start: '€0',
            color: 'border-acid-lime text-acid-lime hover:bg-acid-lime/10'
        }
    ] as const

    return (
        <div className="absolute inset-0 z-50 bg-void-navy flex flex-col items-center justify-center p-4 overflow-y-auto">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-magenta mb-4 text-center">
                ASCENSION 2026
            </h1>
            <p className="text-white/50 font-mono text-sm tracking-widest mb-12 uppercase">
                Select your Archtype
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {classes.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setClass(c.id)}
                        className={`group relative p-8 rounded-xl border-2 ${c.color} transition-all duration-300 hover:scale-[1.02] backdrop-blur-md bg-black/20 text-left`}
                    >
                        <h2 className="text-2xl font-black italic tracking-wider mb-2">{c.title}</h2>
                        <h3 className="text-sm font-mono opacity-70 mb-4">{c.subtitle}</h3>
                        <p className="text-white/80 font-light mb-8 min-h-[3em]">{c.desc}</p>

                        <div className="space-y-1 font-mono text-xs">
                            <div className="flex justify-between border-b border-white/10 pb-1">
                                <span>START CASH</span>
                                <span className="font-bold">{c.start}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span>PERK</span>
                                <span className="font-bold">{c.bonus}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
