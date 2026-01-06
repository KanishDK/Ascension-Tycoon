export class AudioEngine {
    private static instance: AudioEngine
    private context: AudioContext | null = null
    private masterGain: GainNode | null = null
    private compressor: DynamicsCompressorNode | null = null
    private filter: BiquadFilterNode | null = null
    private distortion: WaveShaperNode | null = null
    private analyser: AnalyserNode | null = null
    private analyserData: Uint8Array | null = null

    private constructor() { }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine()
        }
        return AudioEngine.instance
    }

    public async init() {
        if (this.context) return

        this.context = new window.AudioContext()

        // Create Nodes
        this.masterGain = this.context.createGain()
        this.compressor = this.context.createDynamicsCompressor()
        this.filter = this.context.createBiquadFilter()

        // Configure Default Mixing Chain
        // Source (Oscillator) -> Filter -> Compressor -> Master -> Destination

        // Filter Settings (LowPass by default)
        this.filter.type = 'lowpass'
        this.filter.frequency.setValueAtTime(20000, this.context.currentTime) // Open
        this.filter.Q.value = 1

        // Compressor Settings (Sidechain simulation)
        this.compressor.threshold.setValueAtTime(-24, this.context.currentTime)
        this.compressor.knee.setValueAtTime(30, this.context.currentTime)
        this.compressor.ratio.setValueAtTime(12, this.context.currentTime)
        this.compressor.attack.setValueAtTime(0.003, this.context.currentTime)
        this.compressor.release.setValueAtTime(0.25, this.context.currentTime)

        // Connect Chain
        // Chain: Filter -> Compressor -> Distortion (Limiter) -> Analyser -> Master -> Destination
        this.distortion = this.context.createWaveShaper()
        this.distortion.curve = this.makeDistortionCurve(0) // Start clean
        this.distortion.oversample = '4x'

        this.analyser = this.context.createAnalyser()
        this.analyser.fftSize = 256
        this.analyserData = new Uint8Array(this.analyser.frequencyBinCount)

        this.filter.connect(this.compressor)
        this.compressor.connect(this.distortion)
        this.distortion.connect(this.analyser)
        this.analyser.connect(this.masterGain)
        this.masterGain.connect(this.context.destination)

        // Initial Volume
        this.masterGain.gain.setValueAtTime(0.5, this.context.currentTime)
    }

    public getBassLevel(): number {
        if (!this.analyser || !this.analyserData) return 0
        this.analyser.getByteFrequencyData(this.analyserData as any)

        // Average of first few bins (Bass frequencies)
        let sum = 0
        for (let i = 0; i < 5; i++) {
            sum += this.analyserData[i]
        }
        return (sum / 5) / 255 // Normalize 0-1
    }

    // Loudness War: The more "amount", the more clipping/distortion
    public setDrive(amount: number) {
        if (!this.distortion) return
        // amount is 0 to 100
        // If amount > 80, we start really crushing it
        const curveAmount = amount
        this.distortion.curve = this.makeDistortionCurve(curveAmount)
    }

    // Maths for soft clipping / hard clipping
    private makeDistortionCurve(amount: number) {
        const k = typeof amount === 'number' ? amount : 50
        const n_samples = 44100
        const curve = new Float32Array(n_samples)
        const deg = Math.PI / 180

        // Standard distortion formula
        // x is [-1, 1]
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1
            // As k increases, the slope at 0 increases and it flattens at edges (clipping)
            // k=0 => close to linear
            // k=100 => heavy distortion
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
        }
        return curve
    }

    public playTone(freq: number = 440, type: OscillatorType = 'sawtooth') {
        if (!this.context || !this.filter) return

        const osc = this.context.createOscillator()
        const gain = this.context.createGain()

        osc.type = type
        osc.frequency.setValueAtTime(freq, this.context.currentTime)

        // Envelope (Attack/Release)
        gain.gain.setValueAtTime(0, this.context.currentTime)
        gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5)

        osc.connect(gain)
        gain.connect(this.filter) // Connect to start of chain

        osc.start()
        osc.stop(this.context.currentTime + 0.5)

        // Cleanup reference
        osc.onended = () => {
            gain.disconnect()
            osc.disconnect()
        }
    }

    public setFilterFreq(val: number) {
        if (this.context && this.filter) {
            // Clamp value
            const freq = Math.max(20, Math.min(val, 20000))
            this.filter.frequency.linearRampToValueAtTime(freq, this.context.currentTime + 0.1)
        }
    }

    public getContextState() {
        return this.context?.state
    }

    public async loadSample(url: string): Promise<AudioBuffer | null> {
        if (!this.context) return null
        try {
            const response = await fetch(url)
            const arrayBuffer = await response.arrayBuffer()
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer)
            return audioBuffer
        } catch (error) {
            console.error('Failed to load sample:', error)
            return null
        }
    }

    public playSample(buffer: AudioBuffer, loop: boolean = false) {
        if (!this.context || !this.masterGain) return

        const source = this.context.createBufferSource()
        source.buffer = buffer
        source.loop = loop

        // Connect to Filter start of chain
        if (this.filter) {
            source.connect(this.filter)
        } else {
            source.connect(this.masterGain)
        }

        source.start()
        return source
    }

    public setCompressorRelease(ms: number) {
        if (!this.context || !this.compressor) return

        // Convert ms to seconds
        const seconds = ms / 1000
        this.compressor.release.linearRampToValueAtTime(seconds, this.context.currentTime + 0.1)
    }

    public resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume()
        }
    }
}
