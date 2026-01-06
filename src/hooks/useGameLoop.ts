import { useEffect, useRef } from 'react'

export const useGameLoop = (callback: (deltaTime: number) => void) => {
    const requestRef = useRef<number | undefined>(undefined)
    const previousTimeRef = useRef<number | undefined>(undefined)
    const callbackRef = useRef(callback)

    // Update callback ref when it changes
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    const animate = (time: number) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current
            callbackRef.current(deltaTime)
        }
        previousTimeRef.current = time
        requestRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate)
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
    }, [])
}
