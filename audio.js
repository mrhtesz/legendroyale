// Audio System for Cosmic Defender

class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = new Map();
        this.isMuted = false;
        this.soundVolume = 0.7;
        this.musicVolume = 0.4;
        this.currentMusic = null;
        
        // Load mute state from localStorage
        const savedMute = localStorage.getItem('cosmicDefenderMuted');
        if (savedMute) {
            this.isMuted = JSON.parse(savedMute);
        }
        
        this.init();
    }
    
    init() {
        // Create audio context for better browser support
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported, using HTML5 Audio');
            this.audioContext = null;
        }
        
        this.loadSounds();
        this.loadMusic();
    }
    
    loadSounds() {
        // Generate procedural sound effects using Web Audio API
        if (this.audioContext) {
            this.generateProceduralSounds();
        } else {
            // Fallback to simple beep sounds
            this.createFallbackSounds();
        }
    }
    
    generateProceduralSounds() {
        // Laser shoot sound
        this.sounds.set('shoot', () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'square';
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        });
        
        // Explosion sound
        this.sounds.set('explosion', () => {
            const duration = 0.3;
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            source.buffer = buffer;
            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            source.start();
        });
        
        // Power-up collect sound
        this.sounds.set('powerUp', () => {
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
            oscillator1.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
            oscillator1.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G5
            
            oscillator2.frequency.setValueAtTime(1046, this.audioContext.currentTime); // C6
            oscillator2.frequency.setValueAtTime(1318, this.audioContext.currentTime + 0.1); // E6
            oscillator2.frequency.setValueAtTime(1568, this.audioContext.currentTime + 0.2); // G6
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            oscillator1.start();
            oscillator2.start();
            oscillator1.stop(this.audioContext.currentTime + 0.3);
            oscillator2.stop(this.audioContext.currentTime + 0.3);
        });
        
        // Hit/damage sound
        this.sounds.set('hit', () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.type = 'sawtooth';
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.2);
        });
        
        // Game over sound
        this.sounds.set('gameOver', () => {
            const frequencies = [523, 494, 466, 440, 415, 392, 370, 349];
            let time = 0;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                    
                    oscillator.type = 'sine';
                    oscillator.start();
                    oscillator.stop(this.audioContext.currentTime + 0.3);
                }, index * 100);
            });
        });
        
        // Wave complete sound
        this.sounds.set('waveComplete', () => {
            const notes = [523, 659, 784, 1047]; // C-E-G-C chord
            
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                    
                    oscillator.type = 'sine';
                    oscillator.start();
                    oscillator.stop(this.audioContext.currentTime + 0.5);
                }, index * 50);
            });
        });
        
        // Menu navigation sound
        this.sounds.set('menuSelect', () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'sine';
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        });
    }
    
    createFallbackSounds() {
        // Simple beep sounds for browsers without Web Audio API
        const createBeep = (frequency, duration, type = 'sine') => {
            return () => {
                console.log(`Beep: ${frequency}Hz for ${duration}ms`);
                // In a real implementation, you might use a library or pre-recorded sounds
            };
        };
        
        this.sounds.set('shoot', createBeep(800, 100));
        this.sounds.set('explosion', createBeep(200, 300));
        this.sounds.set('powerUp', createBeep(1000, 300));
        this.sounds.set('hit', createBeep(150, 200));
        this.sounds.set('gameOver', createBeep(300, 800));
        this.sounds.set('waveComplete', createBeep(600, 500));
        this.sounds.set('menuSelect', createBeep(800, 100));
    }
    
    loadMusic() {
        // Generate simple background music loops
        if (this.audioContext) {
            this.generateBackgroundMusic();
        }
    }
    
    generateBackgroundMusic() {
        // Create a simple ambient background track
        this.music.set('background', () => {
            const duration = 16; // 16 second loop
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            const leftChannel = buffer.getChannelData(0);
            const rightChannel = buffer.getChannelData(1);
            
            // Generate ambient pad sounds
            for (let i = 0; i < bufferSize; i++) {
                const time = i / this.audioContext.sampleRate;
                
                // Low frequency drone
                const drone = Math.sin(2 * Math.PI * 55 * time) * 0.1;
                
                // Slow-moving harmonics
                const harmonic1 = Math.sin(2 * Math.PI * 110 * time + Math.sin(time * 0.5) * 2) * 0.05;
                const harmonic2 = Math.sin(2 * Math.PI * 165 * time + Math.sin(time * 0.3) * 1.5) * 0.03;
                const harmonic3 = Math.sin(2 * Math.PI * 220 * time + Math.sin(time * 0.7) * 1) * 0.02;
                
                // Add some subtle noise for texture
                const noise = (Math.random() * 2 - 1) * 0.005;
                
                const sample = drone + harmonic1 + harmonic2 + harmonic3 + noise;
                
                leftChannel[i] = sample;
                rightChannel[i] = sample * 0.8; // Slightly different for stereo effect
            }
            
            return buffer;
        });
        
        // Menu music - more upbeat
        this.music.set('menu', () => {
            const duration = 8;
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            const leftChannel = buffer.getChannelData(0);
            const rightChannel = buffer.getChannelData(1);
            
            // Simple chord progression
            const chords = [
                [262, 330, 392], // C major
                [294, 370, 440], // D minor
                [330, 415, 494], // E minor
                [349, 440, 523]  // F major
            ];
            
            for (let i = 0; i < bufferSize; i++) {
                const time = i / this.audioContext.sampleRate;
                const chordIndex = Math.floor(time / 2) % chords.length;
                const chord = chords[chordIndex];
                
                let sample = 0;
                chord.forEach(freq => {
                    sample += Math.sin(2 * Math.PI * freq * time) * 0.1;
                });
                
                // Add some arpeggiation
                const arpFreq = chord[Math.floor(time * 4) % chord.length];
                sample += Math.sin(2 * Math.PI * arpFreq * 2 * time) * 0.05;
                
                leftChannel[i] = sample;
                rightChannel[i] = sample;
            }
            
            return buffer;
        });
    }
    
    playSound(soundName) {
        if (this.isMuted) return;
        
        const sound = this.sounds.get(soundName);
        if (sound) {
            try {
                // Resume audio context if suspended (browser autoplay policy)
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                sound();
            } catch (error) {
                console.warn(`Error playing sound ${soundName}:`, error);
            }
        }
    }
    
    playMusic(musicName, loop = true) {
        if (this.isMuted) return;
        
        this.stopMusic();
        
        const musicGenerator = this.music.get(musicName);
        if (musicGenerator && this.audioContext) {
            try {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                const buffer = musicGenerator();
                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();
                
                source.buffer = buffer;
                source.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                gainNode.gain.setValueAtTime(this.musicVolume, this.audioContext.currentTime);
                source.loop = loop;
                source.start();
                
                this.currentMusic = source;
            } catch (error) {
                console.warn(`Error playing music ${musicName}:`, error);
            }
        }
    }
    
    stopMusic() {
        if (this.currentMusic) {
            try {
                this.currentMusic.stop();
            } catch (error) {
                // Music might already be stopped
            }
            this.currentMusic = null;
        }
    }
    
    pauseMusic() {
        if (this.currentMusic && this.audioContext) {
            this.audioContext.suspend();
        }
    }
    
    resumeMusic() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    playBackgroundMusic() {
        this.playMusic('background', true);
    }
    
    playMenuMusic() {
        this.playMusic('menu', true);
    }
    
    stopBackgroundMusic() {
        this.stopMusic();
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('cosmicDefenderMuted', JSON.stringify(this.isMuted));
        
        if (this.isMuted) {
            this.stopMusic();
        } else {
            // Resume music if game is playing
            if (game && game.gameState === 'playing') {
                this.playBackgroundMusic();
            }
        }
        
        // Update UI
        this.updateMuteUI();
        
        return this.isMuted;
    }
    
    setVolume(soundVolume, musicVolume) {
        this.soundVolume = Math.max(0, Math.min(1, soundVolume));
        this.musicVolume = Math.max(0, Math.min(1, musicVolume));
        
        // Apply to current music
        if (this.currentMusic && this.audioContext) {
            // Note: This is a simplified approach
            // In a real implementation, you'd want to track the gain node
        }
    }
    
    updateMuteUI() {
        // Update any mute button UI
        const muteButtons = document.querySelectorAll('.mute-button');
        muteButtons.forEach(button => {
            button.textContent = this.isMuted ? '🔇' : '🔊';
            button.title = this.isMuted ? 'Unmute' : 'Mute';
        });
    }
    
    // Initialize audio on user interaction (required by browsers)
    initializeOnUserInteraction() {
        const initAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // Play a silent sound to initialize
            this.playSound('menuSelect');
            
            // Remove event listeners
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
            document.removeEventListener('touchstart', initAudio);
        };
        
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
        document.addEventListener('touchstart', initAudio);
    }
    
    // Preload all audio assets
    preload() {
        return new Promise((resolve) => {
            // For procedural audio, there's nothing to preload
            // In a real game, you'd load audio files here
            setTimeout(resolve, 100);
        });
    }
    
    // Get audio status for debugging
    getStatus() {
        return {
            muted: this.isMuted,
            soundVolume: this.soundVolume,
            musicVolume: this.musicVolume,
            audioContextState: this.audioContext ? this.audioContext.state : 'not available',
            currentMusic: this.currentMusic ? 'playing' : 'stopped',
            soundsLoaded: this.sounds.size,
            musicTracksLoaded: this.music.size
        };
    }
}

// Create global audio manager instance
const AudioManager = new AudioManager();

// Initialize audio on user interaction
AudioManager.initializeOnUserInteraction();

// Add volume control UI
const createVolumeControls = () => {
    const style = document.createElement('style');
    style.textContent = `
        .volume-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
            display: none;
        }
        
        .volume-controls.visible {
            display: block;
        }
        
        .volume-control {
            margin: 5px 0;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        
        .volume-slider {
            width: 100px;
            margin-left: 10px;
        }
        
        .mute-button {
            background: none;
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 5px;
        }
        
        .mute-button:hover {
            background: rgba(0, 255, 0, 0.1);
        }
    `;
    document.head.appendChild(style);
};

// Initialize volume controls
createVolumeControls();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}

// Make available globally
window.AudioManager = AudioManager;