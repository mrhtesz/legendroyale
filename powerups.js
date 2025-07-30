// Power-up System and Score Management for Cosmic Defender

// Power-up Manager
class PowerUpManager {
    constructor() {
        this.activePowerUps = new Map();
        this.powerUpTypes = {
            rapidFire: {
                name: 'Rapid Fire',
                icon: '🔥',
                color: '#ff4400',
                duration: 10000,
                description: 'Increased shooting speed'
            },
            multiShot: {
                name: 'Multi Shot',
                icon: '💥',
                color: '#ff8800',
                duration: 8000,
                description: 'Shoot multiple bullets'
            },
            shield: {
                name: 'Shield',
                icon: '🛡️',
                color: '#0088ff',
                duration: 5000,
                description: 'Temporary invincibility'
            },
            health: {
                name: 'Health',
                icon: '❤️',
                color: '#ff0088',
                duration: 0,
                description: 'Restore health'
            },
            speedBoost: {
                name: 'Speed Boost',
                icon: '⚡',
                color: '#ffff00',
                duration: 7000,
                description: 'Increased movement speed'
            },
            piercing: {
                name: 'Piercing Shot',
                icon: '🎯',
                color: '#00ff88',
                duration: 6000,
                description: 'Bullets pierce through enemies'
            },
            doubleScore: {
                name: 'Double Score',
                icon: '💰',
                color: '#ffd700',
                duration: 8000,
                description: 'Double points for kills'
            },
            magnetism: {
                name: 'Magnetism',
                icon: '🧲',
                color: '#cc44ff',
                duration: 10000,
                description: 'Attract power-ups automatically'
            }
        };
    }
    
    addPowerUp(type, duration = null) {
        const powerUpData = this.powerUpTypes[type];
        if (!powerUpData) return false;
        
        const actualDuration = duration || powerUpData.duration;
        
        if (actualDuration > 0) {
            // Remove existing power-up of same type
            if (this.activePowerUps.has(type)) {
                this.removePowerUp(type);
            }
            
            // Add new power-up
            this.activePowerUps.set(type, {
                ...powerUpData,
                duration: actualDuration,
                startTime: Date.now()
            });
            
            // Update UI
            this.updatePowerUpUI();
            
            return true;
        } else {
            // Instant effect power-up (like health)
            return true;
        }
    }
    
    removePowerUp(type) {
        if (this.activePowerUps.has(type)) {
            this.activePowerUps.delete(type);
            this.updatePowerUpUI();
            return true;
        }
        return false;
    }
    
    hasPowerUp(type) {
        return this.activePowerUps.has(type);
    }
    
    update(deltaTime) {
        const now = Date.now();
        const toRemove = [];
        
        for (const [type, powerUp] of this.activePowerUps) {
            const elapsed = now - powerUp.startTime;
            if (elapsed >= powerUp.duration) {
                toRemove.push(type);
            }
        }
        
        toRemove.forEach(type => this.removePowerUp(type));
    }
    
    updatePowerUpUI() {
        const container = document.getElementById('activePowerUps');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (const [type, powerUp] of this.activePowerUps) {
            const element = document.createElement('div');
            element.className = 'active-powerup';
            element.innerHTML = powerUp.icon;
            element.title = `${powerUp.name}: ${powerUp.description}`;
            
            // Add progress indicator
            const progress = document.createElement('div');
            progress.className = 'powerup-progress';
            progress.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: ${powerUp.color};
                width: 100%;
                animation: powerupProgress ${powerUp.duration}ms linear forwards;
            `;
            
            element.appendChild(progress);
            container.appendChild(element);
        }
    }
    
    clear() {
        this.activePowerUps.clear();
        this.updatePowerUpUI();
    }
    
    getRandomPowerUpType() {
        const types = Object.keys(this.powerUpTypes);
        return types[Math.floor(Math.random() * types.length)];
    }
    
    // Get power-up spawn probability based on game state
    getSpawnProbability(wave, score) {
        let baseProbability = 0.3;
        
        // Increase probability with higher waves
        baseProbability += Math.min(wave * 0.02, 0.2);
        
        // Slightly increase with score
        baseProbability += Math.min(score * 0.000001, 0.1);
        
        return Math.min(baseProbability, 0.6); // Cap at 60%
    }
}

// Score Manager
class ScoreManager {
    constructor() {
        this.loadHighScores();
    }
    
    loadHighScores() {
        const saved = localStorage.getItem('cosmicDefenderHighScores');
        if (saved) {
            this.highScores = JSON.parse(saved);
        } else {
            this.highScores = [];
        }
    }
    
    saveHighScores() {
        localStorage.setItem('cosmicDefenderHighScores', JSON.stringify(this.highScores));
    }
    
    addScore(score, wave, enemiesDefeated, accuracy) {
        const newScore = {
            score: score,
            wave: wave,
            enemiesDefeated: enemiesDefeated,
            accuracy: accuracy,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        this.highScores.push(newScore);
        this.highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        if (this.highScores.length > 10) {
            this.highScores = this.highScores.slice(0, 10);
        }
        
        this.saveHighScores();
        
        // Check if it's a new high score
        return this.highScores.indexOf(newScore) === 0 && this.highScores.length > 1;
    }
    
    getHighScores() {
        return [...this.highScores];
    }
    
    getBestScore() {
        return this.highScores.length > 0 ? this.highScores[0].score : 0;
    }
    
    clearHighScores() {
        this.highScores = [];
        this.saveHighScores();
    }
    
    getStats() {
        if (this.highScores.length === 0) {
            return {
                gamesPlayed: 0,
                bestScore: 0,
                totalScore: 0,
                averageScore: 0,
                bestWave: 0,
                totalEnemiesDefeated: 0,
                averageAccuracy: 0
            };
        }
        
        const totalScore = this.highScores.reduce((sum, score) => sum + score.score, 0);
        const totalEnemies = this.highScores.reduce((sum, score) => sum + score.enemiesDefeated, 0);
        const totalAccuracy = this.highScores.reduce((sum, score) => sum + score.accuracy, 0);
        const bestWave = Math.max(...this.highScores.map(score => score.wave));
        
        return {
            gamesPlayed: this.highScores.length,
            bestScore: this.getBestScore(),
            totalScore: totalScore,
            averageScore: Math.round(totalScore / this.highScores.length),
            bestWave: bestWave,
            totalEnemiesDefeated: totalEnemies,
            averageAccuracy: Math.round(totalAccuracy / this.highScores.length)
        };
    }
}

// Wave Manager
class WaveManager {
    constructor() {
        this.currentWave = 1;
        this.enemiesPerWave = 5;
        this.enemySpawnRate = 2000;
        this.enemiesSpawned = 0;
        this.waveComplete = false;
        this.lastEnemySpawn = 0;
        this.waveStartTime = 0;
        
        // Enemy type probabilities by wave
        this.enemyTypeProgression = {
            1: { basic: 1.0 },
            2: { basic: 0.8, fast: 0.2 },
            3: { basic: 0.6, fast: 0.3, tank: 0.1 },
            4: { basic: 0.5, fast: 0.3, tank: 0.1, shooter: 0.1 },
            5: { basic: 0.4, fast: 0.3, tank: 0.15, shooter: 0.1, zigzag: 0.05 },
            10: { basic: 0.2, fast: 0.3, tank: 0.2, shooter: 0.2, zigzag: 0.1 },
            15: { basic: 0.1, fast: 0.2, tank: 0.3, shooter: 0.3, zigzag: 0.1 },
            20: { basic: 0.05, fast: 0.15, tank: 0.3, shooter: 0.35, zigzag: 0.15 }
        };
    }
    
    startWave(waveNumber) {
        this.currentWave = waveNumber;
        this.enemiesSpawned = 0;
        this.waveComplete = false;
        this.waveStartTime = Date.now();
        this.lastEnemySpawn = 0;
        
        // Scale difficulty with wave
        this.enemiesPerWave = Math.floor(5 + (waveNumber - 1) * 1.5);
        this.enemySpawnRate = Math.max(500, 2000 - (waveNumber - 1) * 100);
        
        console.log(`Wave ${waveNumber} started: ${this.enemiesPerWave} enemies, spawn rate: ${this.enemySpawnRate}ms`);
    }
    
    shouldSpawnEnemy() {
        if (this.waveComplete || this.enemiesSpawned >= this.enemiesPerWave) {
            return false;
        }
        
        const now = Date.now();
        if (now - this.lastEnemySpawn >= this.enemySpawnRate) {
            this.lastEnemySpawn = now;
            this.enemiesSpawned++;
            return true;
        }
        
        return false;
    }
    
    getEnemyType() {
        // Get probabilities for current wave
        let probabilities = this.enemyTypeProgression[this.currentWave];
        
        // If wave not defined, use highest defined wave
        if (!probabilities) {
            const maxWave = Math.max(...Object.keys(this.enemyTypeProgression).map(Number));
            probabilities = this.enemyTypeProgression[maxWave];
        }
        
        // Weighted random selection
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [type, probability] of Object.entries(probabilities)) {
            cumulative += probability;
            if (rand <= cumulative) {
                return type;
            }
        }
        
        return 'basic'; // Fallback
    }
    
    checkWaveComplete(activeEnemies) {
        if (this.enemiesSpawned >= this.enemiesPerWave && activeEnemies === 0) {
            this.waveComplete = true;
            return true;
        }
        return false;
    }
    
    getWaveBonus() {
        // Bonus score for completing a wave
        return this.currentWave * 100;
    }
    
    getWaveMessage() {
        const messages = [
            `Wave ${this.currentWave}`,
            `Wave ${this.currentWave} - ${this.enemiesPerWave} enemies incoming!`,
            `Wave ${this.currentWave} - Prepare for battle!`,
            `Wave ${this.currentWave} - Defend Earth!`,
            `Wave ${this.currentWave} - The invasion continues!`
        ];
        
        if (this.currentWave % 5 === 0) {
            return `Wave ${this.currentWave} - BOSS WAVE!`;
        }
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

// Achievement System
class AchievementManager {
    constructor() {
        this.achievements = {
            firstKill: {
                name: 'First Blood',
                description: 'Destroy your first enemy',
                icon: '🎯',
                unlocked: false
            },
            wave5: {
                name: 'Survivor',
                description: 'Reach Wave 5',
                icon: '🏆',
                unlocked: false
            },
            wave10: {
                name: 'Veteran',
                description: 'Reach Wave 10',
                icon: '🎖️',
                unlocked: false
            },
            perfectAccuracy: {
                name: 'Sharpshooter',
                description: 'Achieve 100% accuracy in a game',
                icon: '🎯',
                unlocked: false
            },
            score10k: {
                name: 'High Scorer',
                description: 'Score 10,000 points',
                icon: '💯',
                unlocked: false
            },
            score50k: {
                name: 'Score Master',
                description: 'Score 50,000 points',
                icon: '🌟',
                unlocked: false
            },
            noHit: {
                name: 'Untouchable',
                description: 'Complete a wave without taking damage',
                icon: '🛡️',
                unlocked: false
            },
            rapidFire: {
                name: 'Bullet Storm',
                description: 'Fire 100 bullets in a single game',
                icon: '💥',
                unlocked: false
            },
            powerUpCollector: {
                name: 'Power Hungry',
                description: 'Collect 10 power-ups in a single game',
                icon: '⚡',
                unlocked: false
            },
            endurance: {
                name: 'Marathon Runner',
                description: 'Survive for 10 minutes',
                icon: '⏰',
                unlocked: false
            }
        };
        
        this.loadAchievements();
    }
    
    loadAchievements() {
        const saved = localStorage.getItem('cosmicDefenderAchievements');
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            // Merge with defaults to handle new achievements
            for (const [key, achievement] of Object.entries(savedAchievements)) {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = achievement.unlocked;
                }
            }
        }
    }
    
    saveAchievements() {
        localStorage.setItem('cosmicDefenderAchievements', JSON.stringify(this.achievements));
    }
    
    checkAchievement(type, value) {
        let unlocked = false;
        
        switch (type) {
            case 'firstKill':
                if (!this.achievements.firstKill.unlocked && value >= 1) {
                    this.unlockAchievement('firstKill');
                    unlocked = true;
                }
                break;
            case 'wave':
                if (!this.achievements.wave5.unlocked && value >= 5) {
                    this.unlockAchievement('wave5');
                    unlocked = true;
                }
                if (!this.achievements.wave10.unlocked && value >= 10) {
                    this.unlockAchievement('wave10');
                    unlocked = true;
                }
                break;
            case 'score':
                if (!this.achievements.score10k.unlocked && value >= 10000) {
                    this.unlockAchievement('score10k');
                    unlocked = true;
                }
                if (!this.achievements.score50k.unlocked && value >= 50000) {
                    this.unlockAchievement('score50k');
                    unlocked = true;
                }
                break;
            case 'accuracy':
                if (!this.achievements.perfectAccuracy.unlocked && value === 100) {
                    this.unlockAchievement('perfectAccuracy');
                    unlocked = true;
                }
                break;
            case 'bullets':
                if (!this.achievements.rapidFire.unlocked && value >= 100) {
                    this.unlockAchievement('rapidFire');
                    unlocked = true;
                }
                break;
            case 'powerups':
                if (!this.achievements.powerUpCollector.unlocked && value >= 10) {
                    this.unlockAchievement('powerUpCollector');
                    unlocked = true;
                }
                break;
            case 'time':
                if (!this.achievements.endurance.unlocked && value >= 600000) { // 10 minutes
                    this.unlockAchievement('endurance');
                    unlocked = true;
                }
                break;
        }
        
        return unlocked;
    }
    
    unlockAchievement(key) {
        if (this.achievements[key] && !this.achievements[key].unlocked) {
            this.achievements[key].unlocked = true;
            this.saveAchievements();
            this.showAchievementNotification(this.achievements[key]);
        }
    }
    
    showAchievementNotification(achievement) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: -300px;
            width: 280px;
            padding: 15px;
            background: linear-gradient(45deg, #ffd700, #ffed4a);
            color: #000;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transition: right 0.5s ease;
            font-family: 'Courier New', monospace;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.right = '20px';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.right = '-300px';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
    
    getUnlockedAchievements() {
        return Object.entries(this.achievements)
            .filter(([key, achievement]) => achievement.unlocked)
            .map(([key, achievement]) => ({ key, ...achievement }));
    }
    
    getProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.getUnlockedAchievements().length;
        return { unlocked, total, percentage: Math.round((unlocked / total) * 100) };
    }
}

// Global instances
const powerUpManager = new PowerUpManager();
const scoreManager = new ScoreManager();
const waveManager = new WaveManager();
const achievementManager = new AchievementManager();

// Add CSS for power-up progress animation
const powerUpStyles = document.createElement('style');
powerUpStyles.textContent = `
    @keyframes powerupProgress {
        from { width: 100%; }
        to { width: 0%; }
    }
    
    .powerup-progress {
        animation-fill-mode: forwards;
    }
    
    .achievement-notification {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .achievement-icon {
        font-size: 2em;
        min-width: 40px;
        text-align: center;
    }
    
    .achievement-name {
        font-weight: bold;
        font-size: 1.1em;
        margin-bottom: 3px;
    }
    
    .achievement-desc {
        font-size: 0.9em;
        opacity: 0.8;
    }
`;
document.head.appendChild(powerUpStyles);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PowerUpManager,
        ScoreManager,
        WaveManager,
        AchievementManager,
        powerUpManager,
        scoreManager,
        waveManager,
        achievementManager
    };
}