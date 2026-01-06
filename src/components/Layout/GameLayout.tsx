import { ReactNode } from 'react'
import { Scene3D } from '../Scene3D'
import { BottomNav, ViewType } from './BottomNav'

interface GameLayoutProps {
    children: ReactNode
    currentView: ViewType
    onNavigate: (view: ViewType) => void
}

export const GameLayout = ({ children, currentView, onNavigate }: GameLayoutProps) => {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-void-navy text-white font-mono">
            {/* LAYER 0: 3D Background */}
            <div className="absolute inset-0 z-0">
                <Scene3D />
            </div>

            {/* LAYER 1: Content Area */}
            {/* We use specific positioning to ensure the content sits 'above' the floor of the 3D scene but below the nav */}
            <main className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden pt-8 pb-32 flex flex-col items-center px-4">
                {children}
            </main>

            {/* LAYER 2: Navigation (Thumb Zone) */}
            <BottomNav currentView={currentView} onNavigate={onNavigate} />

            {/* LAYER 3: Global Overlays (e.g. Notifications soon) */}
        </div>
    )
}
