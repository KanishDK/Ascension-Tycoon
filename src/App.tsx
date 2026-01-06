import { useState, useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import { GameLayout } from './components/Layout/GameLayout'
import { ViewType } from './components/Layout/BottomNav'

// Views
import { OfficeView } from './views/OfficeView'
import { StudioView } from './views/StudioView'
import { LiveView } from './views/LiveView'
import { OnboardingView } from './views/OnboardingView'
import { RivalsView } from './views/RivalsView'

function App() {
    const { addCash, loadState, playerClass } = useGameStore() // Destructure playerClass here
    const [currentView, setCurrentView] = useState<ViewType>('office')

    // Load Game & Auto-Save Loop & Game Loop
    useEffect(() => {
        // Load save on mount
        loadState()

        // Auto-save every 30s
        const autoSave = setInterval(() => {
            useGameStore.getState().save()
        }, 30000)

        // Game Loop (60fps)
        let lastTime = performance.now()
        let animateId: number

        const tick = (dt: number) => {
            // Generate €1 per second => €0.001 per ms
            const incomePerMs = 0.001
            const income = incomePerMs * dt
            if (income > 0) {
                addCash(income)
            }
            // Add other global game ticks here
        }

        const loop = (time: number) => {
            const dt = time - lastTime
            lastTime = time

            // Run Global Ticks only if game is started (class selected)
            if (useGameStore.getState().playerClass) { // Access playerClass from store state directly
                tick(dt)
            }

            animateId = requestAnimationFrame(loop)
        }
        animateId = requestAnimationFrame(loop)

        return () => {
            clearInterval(autoSave)
            cancelAnimationFrame(animateId)
        }
    }, [loadState, addCash]) // Removed playerClass from dependencies to avoid re-running loop setup

    if (!playerClass) {
        return <OnboardingView />
    }

    return (
        <GameLayout currentView={currentView} onNavigate={setCurrentView}>
            {currentView === 'office' && <OfficeView />}
            {currentView === 'studio' && <StudioView />}
            {currentView === 'live' && <LiveView />}
            {currentView === 'world' && <RivalsView />}
        </GameLayout>
    )
}

export default App
