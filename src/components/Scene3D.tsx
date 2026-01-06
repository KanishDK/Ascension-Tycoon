import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { Crowd } from './Crowd'

const Lasers = () => {
    const group = useRef<THREE.Group>(null!)

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        // Rotate the entire laser rig
        group.current.rotation.y = Math.sin(t * 0.5) * 0.5
        group.current.rotation.z = Math.cos(t * 0.3) * 0.1
    })

    return (
        <group ref={group} position={[0, 4, -2]}>
            {Array.from({ length: 8 }).map((_, i) => (
                <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]} position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 20]} />
                    <meshBasicMaterial color="#00ff00" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
                </mesh>
            ))}
        </group>
    )
}

const Rain = () => {
    const rainCount = 1000
    const rainGeo = useRef<THREE.BufferGeometry>(null!)
    const positions = useMemo(() => {
        const pos = new Float32Array(rainCount * 3)
        for (let i = 0; i < rainCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50
            pos[i * 3 + 1] = Math.random() * 20
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50
        }
        return pos
    }, [])

    useFrame(() => {
        if (!rainGeo.current) return
        const positions = rainGeo.current.attributes.position.array as Float32Array
        for (let i = 0; i < rainCount; i++) {
            positions[i * 3 + 1] -= 0.5 // Fall speed
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 20 // Reset height
            }
        }
        rainGeo.current.attributes.position.needsUpdate = true
    })

    return (
        <points>
            <bufferGeometry ref={rainGeo}>
                <bufferAttribute
                    attach="attributes-position"
                    count={rainCount}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial color="#aaaaaa" size={0.1} transparent opacity={0.6} />
        </points>
    )
}

const Stage = () => {
    return (
        <group position={[0, 0.5, -3]}>
            {/* DJ Table */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[3, 1, 1]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Speakers */}
            <mesh position={[-2.5, 1.5, 0]}>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[2.5, 1.5, 0]}>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>
    )
}

import { useGameStore } from '../store/gameStore'

export const Scene3D = () => {
    const { settings, subGenre } = useGameStore()

    if (settings?.lowPowerMode) {
        return (
            <div className="fixed inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-void-navy via-black to-black opacity-50" />
                {/* Low Power Audio Reactive Placeholder */}
                <div className="text-center space-y-4 relative z-10 animate-pulse">
                    <div className="text-6xl">🔋</div>
                    <div className="font-orbitron text-neon-cyan tracking-widest text-sm uppercase">
                        ECO MODE ACTIVE
                    </div>
                    <div className="text-white/20 text-xs font-mono">
                        3D RENDERING DISABLED
                    </div>
                </div>

                {/* Add some simple CSS grid animation instead of WebGL */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(0,255,100,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(0,255,100,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom animate-[grid-move_20s_linear_infinite]" />
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-0">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 3, 6]} fov={60} />
                <OrbitControls
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going under floor
                    minPolarAngle={Math.PI / 3}
                    autoRotate
                    autoRotateSpeed={0.5}
                />

                <ambientLight intensity={0.1} color="#01162b" />

                {/* Stage Lights */}
                <spotLight
                    position={[0, 10, -5]}
                    angle={0.5}
                    penumbra={0.5}
                    intensity={2}
                    color="#e7305d"
                    castShadow
                />

                {/* Moving Heads simulation */}
                <pointLight position={[-5, 5, -5]} intensity={5} color="#59f0ff" distance={20} />
                <pointLight position={[5, 5, -5]} intensity={5} color="#bbd440" distance={20} />

                <group>
                    <Stage />
                    <Lasers />
                    <Crowd />

                    {/* WEATHER SYSTEM */}
                    {/* Deep Trance = Rain */}
                    {(subGenre === 'DeepTrance' || (!subGenre && Math.random() > 0.5)) && <Rain />}

                    {/* Psytrance = Dust/Fog Colour */}
                    {subGenre === 'Psytrance' && (
                        <fog attach="fog" args={['#2f1b0c', 5, 25]} />
                    )}

                    <gridHelper args={[50, 50, 0x333333, 0x111111]} position={[0, 0, 0]} />
                </group>

                <color attach="background" args={[subGenre === 'Psytrance' ? '#2f1b0c' : '#010a12']} />
                {subGenre !== 'Psytrance' && <fog attach="fog" args={['#010a12', 5, 20]} />}
            </Canvas>
        </div>
    )
}
