import { useRef, useLayoutEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AudioEngine } from '../audio/AudioEngine'

const COUNT = 10000

// Vertex Shader: Handles position and movement
const vertexShader = `
  uniform float uTime;
  uniform float uBass; // 0.0 to 1.0
  
  attribute vec3 color;
  varying vec3 vColor;
  
  void main() {
    vColor = color;
    
    vec3 pos = position;
    
    // Instance Matrix transforms
    vec4 instancePos = instanceMatrix * vec4(pos, 1.0);
    
    // Effect: Pulse height based on Bass
    // We use the world x/z position to create a wave pattern
    float wave = sin(instancePos.x * 0.5 + uTime * 2.0) * cos(instancePos.z * 0.5 + uTime);
    
    // Apply Bass to Y-axis
    // Base movement + Bass kick
    float bassKick = uBass * 2.0;
    instancePos.y += wave * 0.2 + (bassKick * max(0.0, wave)); 
    
    gl_Position = projectionMatrix * modelViewMatrix * instancePos; // Note: modelView is applied to world pos
    // Correct approach for InstancedMesh with custom shader is tricky in ThreeJS standard material
    // But since we are replacing the material entirely, we calculate gl_Position manually from instanceMatrix
    
    gl_Position = projectionMatrix * viewMatrix * instancePos;
  }
`

// Fragment Shader: Handles color
const fragmentShader = `
  varying vec3 vColor;
  uniform float uBass;
  
  void main() {
    // Add brightness when bass hits
    vec3 finalColor = vColor + (vec3(0.2, 0.8, 0.9) * uBass * 0.5);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export const Crowd = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null!)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    // Custom Shader Material Uniforms
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uBass: { value: 0 }
    }), [])

    // Initial Layout
    useLayoutEffect(() => {
        // Generate Instance Colors manually since we use custom shader attribute
        const colors = new Float32Array(COUNT * 3)

        for (let i = 0; i < COUNT; i++) {
            // Circular distribution logic (Same as before)
            const angle = Math.random() * Math.PI * 2
            const radius = 5 + Math.random() * 30
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const y = 0

            dummy.position.set(x, y, z)
            dummy.rotation.y = Math.random() * Math.PI
            dummy.scale.setScalar(0.2 + Math.random() * 0.5)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)

            // Colors
            const isCyan = Math.random() > 0.5
            const c = new THREE.Color(isCyan ? '#59f0ff' : '#e7305d')
            colors[i * 3] = c.r
            colors[i * 3 + 1] = c.g
            colors[i * 3 + 2] = c.b
        }

        meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3))
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [dummy])

    // Animation Loop
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        uniforms.uTime.value = time

        // Get Audio Data
        // Since we don't have a specific "Bass" node exposed yet, needed to check how to get it.
        // For Lag 2, we didn't expose an Analyzer. We need to add that to AudioEngine now
        // Or we can fake it with the "Drive" param if no audio is playing, but better to be real.

        // Let's assume we update AudioEngine to provide `getBassLevel()`
        // For now, mockup:
        // uniforms.uBass.value = (Math.sin(time * 10) + 1) * 0.5; // TEST MODE

        const level = AudioEngine.getInstance().getBassLevel()
        uniforms.uBass.value = level
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
            <boxGeometry args={[0.5, 2, 0.5]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </instancedMesh>
    )
}
