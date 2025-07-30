// Main Application Controller for Cosmic Defender

class UI {
    constructor() {
        this.currentScreen = 'startScreen';
        this.screens = new Map();
        this.gameStats = {
            gamesPlayed: 0,
            bestScore: 0
        };
        
        this.init();
    }
    
    init() {
        this.cacheScreenElements();
        this.setupEventListeners();
        this.loadStats();
        this.updateMenuStats();
        
        // Show loading screen initially
        this.showLoadingScreen();
        
        // Initialize after a short delay
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showScreen('startScreen');
            AudioManager.playMenuMusic();
        }, 2000);
    }
    
    cacheScreenElements() {
        this.screens.set('startScreen', document.getElementById('startScreen'));
        this.screens.set('instructionsScreen', document.getElementById('instructionsScreen'));
        this.screens.set('highScoresScreen', document.getElementById('highScoresScreen'));
        this.screens.set('gameScreen', document.getElementById('gameScreen'));
        this.screens.set('pauseScreen', document.getElementById('pauseScreen'));
        this.screens.set('gameOverScreen', document.getElementById('gameOverScreen'));
        this.screens.set('loadingScreen', document.getElementById('loadingScreen'));
    }
    
    setupEventListeners() {
        // Start screen buttons
        document.getElementById('startButton').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.startGame();
        });
        
        document.getElementById('instructionsButton').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.showScreen('instructionsScreen');
        });
        
        document.getElementById('highScoresButton').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.showHighScores();
        });
        
        // Instructions screen
        document.getElementById('backFromInstructions').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.showScreen('startScreen');
        });
        
        // High scores screen
        document.getElementById('backFromHighScores').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.showScreen('startScreen');
        });
        
        document.getElementById('clearScores').addEventListener('click', () => {
            this.showConfirmation('Are you sure you want to clear all high scores?', () => {
                scoreManager.clearHighScores();
                this.updateHighScoresList();
                this.updateMenuStats();
                AudioManager.playSound('menuSelect');
            });
        });
        
        // Pause screen
        document.getElementById('resumeButton').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.hidePauseScreen();
            game.resumeGame();
        });
        
        document.getElementById('restartButton').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.hidePauseScreen();
            this.startGame();
        });
        
        document.getElementById('quitButton').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.hidePauseScreen();
            this.showScreen('startScreen');
            AudioManager.playMenuMusic();
        });
        
        // Game over screen
        document.getElementById('playAgainButton').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.hideGameOverScreen();
            this.startGame();
        });
        
        document.getElementById('backToMenuButton').addEventListener('click', () => {
            AudioManager.playSound('menuSelect');
            this.hideGameOverScreen();
            this.showScreen('startScreen');
            AudioManager.playMenuMusic();
        });
        
        // Pause button in game
        document.getElementById('pauseButton').addEventListener('click', () => {
            if (game && game.gameState === 'playing') {
                game.pauseGame();
            }
        });
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.currentScreen === 'gameScreen') {
                if (game && game.gameState === 'playing') {
                    game.pauseGame();
                }
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            if (game) {
                game.resizeCanvas();
            }
        });
    }
    
    showScreen(screenName) {
        // Hide all screens
        this.screens.forEach((screen) => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = this.screens.get(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }
    
    startGame() {
        this.showScreen('gameScreen');
        AudioManager.stopMusic();
        
        // Initialize or restart game
        if (!game) {
            game = new EnhancedCosmicDefender();
        }
        
        game.startGame();
        this.gameStats.gamesPlayed++;
        this.saveStats();
    }
    
    showHighScores() {
        this.showScreen('highScoresScreen');
        this.updateHighScoresList();
    }
    
    updateHighScoresList() {
        const container = document.getElementById('highScoresList');
        const scores = scoreManager.getHighScores();
        
        if (scores.length === 0) {
            container.innerHTML = `
                <div class="no-scores">
                    <p>No high scores yet!</p>
                    <p>Play a game to set your first score.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = scores.map((score, index) => `
            <div class="score-entry">
                <div class="score-rank">#${index + 1}</div>
                <div class="score-details">
                    <div class="score-value">${score.score.toLocaleString()}</div>
                    <div class="score-date">Wave ${score.wave} • ${score.enemiesDefeated} enemies • ${score.accuracy}% accuracy</div>
                    <div class="score-date">${new Date(score.date).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }
    
    showPauseScreen() {
        this.showScreen('pauseScreen');
        
        // Update pause screen stats
        if (game) {
            document.getElementById('pauseScore').textContent = game.score;
            document.getElementById('pauseWave').textContent = game.wave;
            
            const minutes = Math.floor(game.gameTime / 60000);
            const seconds = Math.floor((game.gameTime % 60000) / 1000);
            document.getElementById('timePlayed').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    hidePauseScreen() {
        this.showScreen('gameScreen');
    }
    
    showGameOverScreen(stats, isHighScore) {
        this.showScreen('gameOverScreen');
        
        // Update final stats
        document.getElementById('finalScore').textContent = stats.score.toLocaleString();
        document.getElementById('finalWave').textContent = stats.wave;
        document.getElementById('enemiesDefeated').textContent = stats.enemiesDefeated;
        document.getElementById('accuracy').textContent = stats.accuracy + '%';
        
        // Show high score indicator
        const highScoreElement = document.getElementById('newHighScore');
        if (isHighScore) {
            highScoreElement.style.display = 'block';
        } else {
            highScoreElement.style.display = 'none';
        }
        
        // Update menu stats for next time
        this.updateMenuStats();
        
        // Check achievements
        achievementManager.checkAchievement('score', stats.score);
        achievementManager.checkAchievement('wave', stats.wave);
        achievementManager.checkAchievement('accuracy', stats.accuracy);
    }
    
    hideGameOverScreen() {
        this.showScreen('gameScreen');
    }
    
    showLoadingScreen() {
        const loadingScreen = this.screens.get('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            
            // Simulate loading progress
            const progressBar = document.getElementById('loadingProgress');
            const loadingText = document.getElementById('loadingText');
            
            const loadingSteps = [
                'Initializing game engine...',
                'Loading audio systems...',
                'Preparing graphics...',
                'Loading high scores...',
                'Calibrating weapons...',
                'Ready to defend Earth!'
            ];
            
            let step = 0;
            const updateProgress = () => {
                if (step < loadingSteps.length) {
                    const progress = ((step + 1) / loadingSteps.length) * 100;
                    progressBar.style.width = progress + '%';
                    loadingText.textContent = loadingSteps[step];
                    step++;
                    setTimeout(updateProgress, 300);
                }
            };
            
            updateProgress();
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = this.screens.get('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: -300px;
            background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
            color: #ffffff;
            padding: 15px 20px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            z-index: 10000;
            transition: right 0.3s ease;
            max-width: 250px;
            word-wrap: break-word;
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
            }, 300);
        }, duration);
    }
    
    showConfirmation(message, onConfirm, onCancel = null) {
        const overlay = document.createElement('div');
        overlay.className = 'confirmation-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            font-family: 'Courier New', monospace;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: rgba(0, 20, 40, 0.95);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 30px;
            max-width: 400px;
            text-align: center;
            color: #00ff00;
        `;
        
        dialog.innerHTML = `
            <p style="margin-bottom: 20px; font-size: 1.1em;">${message}</p>
            <div>
                <button id="confirmYes" class="menu-btn" style="margin: 0 10px;">YES</button>
                <button id="confirmNo" class="menu-btn" style="margin: 0 10px;">NO</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Event listeners
        document.getElementById('confirmYes').addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (onConfirm) onConfirm();
        });
        
        document.getElementById('confirmNo').addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (onCancel) onCancel();
        });
        
        // Close on escape
        const escapeHandler = (e) => {
            if (e.code === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', escapeHandler);
                if (onCancel) onCancel();
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    addPowerUpIcon(type, icon) {
        // This is handled by the PowerUpManager
        // Just trigger a visual effect
        this.showNotification(`Power-up activated: ${icon}`, 'success', 2000);
    }
    
    removePowerUpIcon(type) {
        // This is handled by the PowerUpManager
    }
    
    updateMenuStats() {
        const stats = scoreManager.getStats();
        document.getElementById('bestScore').textContent = stats.bestScore.toLocaleString();
        document.getElementById('gamesPlayed').textContent = stats.gamesPlayed;
    }
    
    loadStats() {
        const saved = localStorage.getItem('cosmicDefenderStats');
        if (saved) {
            this.gameStats = { ...this.gameStats, ...JSON.parse(saved) };
        }
    }
    
    saveStats() {
        localStorage.setItem('cosmicDefenderStats', JSON.stringify(this.gameStats));
    }
}

// Enhanced Cosmic Defender Game Class
class EnhancedCosmicDefender extends CosmicDefender {
    constructor() {
        super();
        this.entityManager = new EntityManager();
        this.powerUpCollected = 0;
        this.gameStartTime = 0;
        this.waveStartHealth = 100;
    }
    
    startGame() {
        super.startGame();
        this.gameStartTime = Date.now();
        this.powerUpCollected = 0;
        this.waveStartHealth = this.health;
        waveManager.startWave(1);
        
        // Clear entity manager
        this.entityManager.clear();
        
        // Add player to entity manager
        const playerEntity = new Player(this.canvasWidth / 2, this.canvasHeight - 60);
        this.entityManager.addEntity(playerEntity, 'player');
        this.player = playerEntity;
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.gameTime += deltaTime;
        
        // Update all entities
        this.entityManager.update(deltaTime, this.player);
        
        // Update power-ups
        powerUpManager.update(deltaTime);
        
        // Handle input for player
        this.handlePlayerInput(deltaTime);
        
        // Spawn enemies using wave manager
        if (waveManager.shouldSpawnEnemy()) {
            this.spawnEnemyFromWave();
        }
        
        // Handle collisions
        this.handleCollisions();
        
        // Check wave completion
        const activeEnemies = this.entityManager.getEntitiesByType('enemy').length;
        if (waveManager.checkWaveComplete(activeEnemies)) {
            this.completeWave();
        }
        
        // Update stars
        this.updateStars(deltaTime);
        
        // Check achievements
        this.checkAchievements();
        
        // Update UI
        this.updateUI();
    }
    
    handlePlayerInput(deltaTime) {
        const player = this.player;
        if (!player) return;
        
        // Handle movement
        let moveX = 0;
        let moveY = 0;
        
        // Keyboard input
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
        
        // Mobile joystick input
        if (this.joystick.active) {
            moveX += this.joystick.x;
            moveY += this.joystick.y;
        }
        
        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }
        
        // Apply speed boost if active
        let speed = player.speed;
        if (powerUpManager.hasPowerUp('speedBoost')) {
            speed *= 1.6;
        }
        
        // Apply movement
        player.x += moveX * speed;
        player.y += moveY * speed;
        
        // Keep player in bounds
        player.x = Math.max(player.width / 2, Math.min(this.canvasWidth - player.width / 2, player.x));
        player.y = Math.max(player.height / 2, Math.min(this.canvasHeight - player.height / 2, player.y));
        
        // Handle shooting
        if ((this.keys['Space'] || this.mouse.pressed) && player.canShoot()) {
            this.playerShoot();
        }
    }
    
    playerShoot() {
        const player = this.player;
        if (!player) return;
        
        // Adjust shoot rate based on power-ups
        let shootRate = player.shootRate;
        if (powerUpManager.hasPowerUp('rapidFire')) {
            shootRate *= 0.3;
        }
        
        player.shootCooldown = shootRate;
        
        if (powerUpManager.hasPowerUp('multiShot')) {
            // Shoot 3 bullets in a spread
            for (let i = -1; i <= 1; i++) {
                const bullet = new Bullet(player.x + i * 15, player.y - 10, 0, -8, '#00ff00', 'player');
                this.entityManager.addEntity(bullet, 'playerBullet');
            }
            this.shotsFired += 3;
        } else {
            // Single bullet
            const bullet = new Bullet(player.x, player.y - 10, 0, -8, '#00ff00', 'player');
            this.entityManager.addEntity(bullet, 'playerBullet');
            this.shotsFired++;
        }
        
        AudioManager.playSound('shoot');
    }
    
    spawnEnemyFromWave() {
        const enemyType = waveManager.getEnemyType();
        const enemy = new Enemy(
            Math.random() * (this.canvasWidth - 40) + 20,
            -30,
            enemyType
        );
        
        // Scale enemy health with wave
        enemy.health += Math.floor(waveManager.currentWave * 5);
        enemy.maxHealth = enemy.health;
        
        this.entityManager.addEntity(enemy, 'enemy');
        this.createParticles(enemy.x, enemy.y, 5, enemy.color, 'spawn');
    }
    
    handleCollisions() {
        // Player bullets vs enemies
        this.entityManager.checkCollisions('playerBullet', 'enemy', (bullet, enemy) => {
            enemy.health -= bullet.damage;
            bullet.active = false;
            this.shotsHit++;
            
            this.createParticles(enemy.x, enemy.y, 8, '#ffff00', 'explosion');
            
            if (enemy.health <= 0) {
                // Enemy destroyed
                let points = enemy.points;
                if (powerUpManager.hasPowerUp('doubleScore')) {
                    points *= 2;
                }
                
                this.score += points;
                this.enemiesDefeated++;
                enemy.active = false;
                
                this.createParticles(enemy.x, enemy.y, 15, enemy.color, 'explosion');
                AudioManager.playSound('explosion');
                
                // Check for power-up spawn
                const spawnChance = powerUpManager.getSpawnProbability(this.wave, this.score);
                if (Math.random() < spawnChance) {
                    this.spawnPowerUp(enemy.x, enemy.y);
                }
                
                // Check achievements
                achievementManager.checkAchievement('firstKill', this.enemiesDefeated);
            }
        });
        
        // Enemy bullets vs player
        this.entityManager.checkCollisions('enemyBullet', 'player', (bullet, player) => {
            bullet.active = false;
            if (player.takeDamage(15)) {
                this.health = player.health;
                this.createParticles(player.x, player.y, 5, '#ff0000', 'hit');
                AudioManager.playSound('hit');
                
                if (this.health <= 0) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver();
                    } else {
                        player.health = player.maxHealth;
                        this.health = player.maxHealth;
                        this.createParticles(player.x, player.y, 20, '#00ff00', 'respawn');
                    }
                }
            }
        });
        
        // Player vs enemies (collision damage)
        this.entityManager.checkCollisions('player', 'enemy', (player, enemy) => {
            enemy.active = false;
            if (player.takeDamage(25)) {
                this.health = player.health;
                this.createParticles(player.x, player.y, 10, '#ff0000', 'explosion');
                AudioManager.playSound('hit');
                
                if (this.health <= 0) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver();
                    } else {
                        player.health = player.maxHealth;
                        this.health = player.maxHealth;
                        this.createParticles(player.x, player.y, 20, '#00ff00', 'respawn');
                    }
                }
            }
        });
        
        // Player vs power-ups
        this.entityManager.checkCollisions('player', 'powerUp', (player, powerUp) => {
            this.collectPowerUp(powerUp);
            powerUp.active = false;
        });
        
        // Handle off-screen enemies (missed)
        const enemies = this.entityManager.getEntitiesByType('enemy');
        enemies.forEach(enemy => {
            if (enemy.y > this.canvasHeight + 50) {
                enemy.active = false;
                if (!powerUpManager.hasPowerUp('shield')) {
                    this.takeDamage(10);
                }
            }
        });
    }
    
    spawnPowerUp(x, y) {
        const powerUpType = powerUpManager.getRandomPowerUpType();
        const powerUp = new PowerUp(x, y, powerUpType);
        this.entityManager.addEntity(powerUp, 'powerUp');
    }
    
    collectPowerUp(powerUp) {
        this.powerUpCollected++;
        
        switch (powerUp.type) {
            case 'health':
                this.player.heal(30);
                this.health = this.player.health;
                break;
            default:
                powerUpManager.addPowerUp(powerUp.type);
                break;
        }
        
        this.createParticles(powerUp.x, powerUp.y, 10, powerUp.color, 'collect');
        AudioManager.playSound('powerUp');
        
        // Check achievements
        achievementManager.checkAchievement('powerups', this.powerUpCollected);
    }
    
    completeWave() {
        // Award wave bonus
        const bonus = waveManager.getWaveBonus();
        this.score += bonus;
        
        // Check for no-hit achievement
        if (this.health === this.waveStartHealth) {
            achievementManager.checkAchievement('noHit', 1);
        }
        
        // Move to next wave
        this.wave++;
        waveManager.startWave(this.wave);
        this.waveStartHealth = this.health;
        
        // Show wave message
        this.showWaveMessage(waveManager.getWaveMessage());
        AudioManager.playSound('waveComplete');
        
        // Check achievements
        achievementManager.checkAchievement('wave', this.wave);
    }
    
    checkAchievements() {
        // Check bullet count
        achievementManager.checkAchievement('bullets', this.shotsFired);
        
        // Check time played
        const timePlayed = Date.now() - this.gameStartTime;
        achievementManager.checkAchievement('time', timePlayed);
    }
    
    takeDamage(amount) {
        if (powerUpManager.hasPowerUp('shield')) return;
        
        this.player.takeDamage(amount);
        this.health = this.player.health;
        
        if (this.health <= 0) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.player.health = this.player.maxHealth;
                this.health = this.player.maxHealth;
                this.createParticles(this.player.x, this.player.y, 20, '#00ff00', 'respawn');
            }
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw stars
        this.drawStars();
        
        if (this.gameState === 'playing') {
            // Render all entities
            this.entityManager.render(this.ctx);
            
            // Draw shield effect if active
            if (powerUpManager.hasPowerUp('shield')) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.3;
                this.ctx.strokeStyle = '#00aaff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(this.player.x, this.player.y, 35, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
        
        // Draw particles
        this.drawParticles();
    }
}

// Initialize the application
let game = null;
let ui = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Cosmic Defender - Initializing...');
    
    // Initialize UI
    ui = new UI();
    
    // Set up global error handling
    window.addEventListener('error', (e) => {
        console.error('Game Error:', e.error);
        if (ui) {
            ui.showNotification('An error occurred. Please refresh the page.', 'error', 5000);
        }
    });
    
    // Handle visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
        if (game && game.gameState === 'playing') {
            if (document.hidden) {
                game.pauseGame();
            }
        }
    });
    
    console.log('🎮 Cosmic Defender - Ready to play!');
});

// Export for debugging
window.game = game;
window.ui = ui;
window.powerUpManager = powerUpManager;
window.scoreManager = scoreManager;
window.waveManager = waveManager;
window.achievementManager = achievementManager;