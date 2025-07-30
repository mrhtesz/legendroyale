// Cosmic Defender - Core Game Engine
class CosmicDefender {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'loading'; // loading, menu, playing, paused, gameOver
        
        // Game settings
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        
        // Game state
        this.score = 0;
        this.wave = 1;
        this.lives = 3;
        this.health = 100;
        this.maxHealth = 100;
        this.gameTime = 0;
        this.waveStartTime = 0;
        this.enemiesDefeated = 0;
        this.shotsFired = 0;
        this.shotsHit = 0;
        
        // Game objects
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.stars = [];
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        
        // Wave management
        this.enemiesPerWave = 5;
        this.enemySpawnRate = 2000; // milliseconds
        this.lastEnemySpawn = 0;
        this.enemiesSpawned = 0;
        this.waveComplete = false;
        
        // Power-up system
        this.activePowerUps = new Map();
        this.powerUpSpawnChance = 0.3;
        
        // Animation frame
        this.animationId = null;
        this.lastFrameTime = 0;
        
        // Mobile controls
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.joystick = { active: false, x: 0, y: 0, centerX: 0, centerY: 0 };
        
        this.init();
    }
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize game objects
        this.initPlayer();
        this.generateStars();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.gameLoop();
        
        console.log('Cosmic Defender initialized');
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Maintain aspect ratio
        const aspectRatio = this.canvasWidth / this.canvasHeight;
        let width = rect.width;
        let height = rect.height;
        
        if (width / height > aspectRatio) {
            width = height * aspectRatio;
        } else {
            height = width / aspectRatio;
        }
        
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // Update scale factor for mouse/touch input
        this.scaleX = this.canvasWidth / width;
        this.scaleY = this.canvasHeight / height;
    }
    
    initPlayer() {
        this.player = {
            x: this.canvasWidth / 2,
            y: this.canvasHeight - 60,
            width: 40,
            height: 30,
            speed: 5,
            shootCooldown: 0,
            shootRate: 250, // milliseconds
            color: '#00ff00',
            trail: []
        };
    }
    
    generateStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvasWidth,
                y: Math.random() * this.canvasHeight,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    setupEventListeners() {
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyPress(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse input
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * this.scaleX;
            this.mouse.y = (e.clientY - rect.top) * this.scaleY;
            this.mouse.pressed = true;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * this.scaleX;
            this.mouse.y = (e.clientY - rect.top) * this.scaleY;
        });
        
        // Mobile touch controls
        if (this.isMobile) {
            this.setupMobileControls();
        }
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    setupMobileControls() {
        const joystick = document.getElementById('mobileJoystick');
        const knob = document.getElementById('joystickKnob');
        const shootBtn = document.getElementById('mobileShoot');
        
        let joystickActive = false;
        
        // Joystick controls
        const handleJoystickStart = (e) => {
            e.preventDefault();
            joystickActive = true;
            const rect = joystick.getBoundingClientRect();
            this.joystick.centerX = rect.left + rect.width / 2;
            this.joystick.centerY = rect.top + rect.height / 2;
            this.joystick.active = true;
        };
        
        const handleJoystickMove = (e) => {
            if (!joystickActive) return;
            e.preventDefault();
            
            const touch = e.touches ? e.touches[0] : e;
            const deltaX = touch.clientX - this.joystick.centerX;
            const deltaY = touch.clientY - this.joystick.centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 30;
            
            if (distance <= maxDistance) {
                this.joystick.x = deltaX / maxDistance;
                this.joystick.y = deltaY / maxDistance;
                knob.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`;
            } else {
                const angle = Math.atan2(deltaY, deltaX);
                this.joystick.x = Math.cos(angle);
                this.joystick.y = Math.sin(angle);
                knob.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * maxDistance}px, ${Math.sin(angle) * maxDistance}px)`;
            }
        };
        
        const handleJoystickEnd = (e) => {
            e.preventDefault();
            joystickActive = false;
            this.joystick.active = false;
            this.joystick.x = 0;
            this.joystick.y = 0;
            knob.style.transform = 'translate(-50%, -50%)';
        };
        
        joystick.addEventListener('touchstart', handleJoystickStart);
        joystick.addEventListener('mousedown', handleJoystickStart);
        
        document.addEventListener('touchmove', handleJoystickMove);
        document.addEventListener('mousemove', handleJoystickMove);
        
        document.addEventListener('touchend', handleJoystickEnd);
        document.addEventListener('mouseup', handleJoystickEnd);
        
        // Shoot button
        let shootPressed = false;
        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            shootPressed = true;
        });
        
        shootBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            shootPressed = false;
        });
        
        shootBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            shootPressed = true;
        });
        
        shootBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            shootPressed = false;
        });
        
        // Update mobile shoot state
        setInterval(() => {
            this.keys['Space'] = shootPressed;
        }, 16);
    }
    
    handleKeyPress(e) {
        switch (e.code) {
            case 'KeyP':
                if (this.gameState === 'playing') {
                    this.pauseGame();
                } else if (this.gameState === 'paused') {
                    this.resumeGame();
                }
                break;
            case 'KeyM':
                AudioManager.toggleMute();
                break;
            case 'Escape':
                if (this.gameState === 'playing') {
                    this.pauseGame();
                }
                break;
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.resetGameState();
        this.waveStartTime = Date.now();
        this.showWaveMessage(`Wave ${this.wave}`);
        AudioManager.playBackgroundMusic();
    }
    
    resetGameState() {
        this.score = 0;
        this.wave = 1;
        this.lives = 3;
        this.health = this.maxHealth;
        this.gameTime = 0;
        this.enemiesDefeated = 0;
        this.shotsFired = 0;
        this.shotsHit = 0;
        this.enemiesSpawned = 0;
        this.waveComplete = false;
        
        // Clear game objects
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.activePowerUps.clear();
        
        // Reset player
        this.initPlayer();
        
        // Update UI
        this.updateUI();
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            AudioManager.pauseBackgroundMusic();
            UI.showPauseScreen();
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            AudioManager.resumeBackgroundMusic();
            UI.hidePauseScreen();
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        AudioManager.stopBackgroundMusic();
        AudioManager.playSound('gameOver');
        
        // Calculate final stats
        const accuracy = this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 0;
        const finalStats = {
            score: this.score,
            wave: this.wave,
            enemiesDefeated: this.enemiesDefeated,
            accuracy: accuracy
        };
        
        // Check for high score
        const isHighScore = ScoreManager.addScore(this.score, this.wave, this.enemiesDefeated, accuracy);
        
        UI.showGameOverScreen(finalStats, isHighScore);
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastFrameTime;
        
        if (deltaTime >= this.frameInterval) {
            this.update(deltaTime);
            this.render();
            this.lastFrameTime = currentTime;
        }
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.gameTime += deltaTime;
        
        // Update player
        this.updatePlayer(deltaTime);
        
        // Update bullets
        this.updateBullets(deltaTime);
        
        // Update enemies
        this.updateEnemies(deltaTime);
        
        // Update power-ups
        this.updatePowerUps(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update stars
        this.updateStars(deltaTime);
        
        // Spawn enemies
        this.spawnEnemies(deltaTime);
        
        // Check collisions
        this.checkCollisions();
        
        // Update power-up timers
        this.updateActivePowerUps(deltaTime);
        
        // Check wave completion
        this.checkWaveCompletion();
        
        // Update UI
        this.updateUI();
    }
    
    updatePlayer(deltaTime) {
        const player = this.player;
        
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
        
        // Apply movement
        player.x += moveX * player.speed;
        player.y += moveY * player.speed;
        
        // Keep player in bounds
        player.x = Math.max(player.width / 2, Math.min(this.canvasWidth - player.width / 2, player.x));
        player.y = Math.max(player.height / 2, Math.min(this.canvasHeight - player.height / 2, player.y));
        
        // Handle shooting
        if (player.shootCooldown > 0) {
            player.shootCooldown -= deltaTime;
        }
        
        if ((this.keys['Space'] || this.mouse.pressed) && player.shootCooldown <= 0) {
            this.playerShoot();
        }
        
        // Update trail
        player.trail.push({ x: player.x, y: player.y, time: this.gameTime });
        player.trail = player.trail.filter(point => this.gameTime - point.time < 200);
    }
    
    playerShoot() {
        const player = this.player;
        const multiShot = this.activePowerUps.has('multiShot');
        const rapidFire = this.activePowerUps.has('rapidFire');
        
        // Adjust shoot rate based on power-ups
        const shootRate = rapidFire ? player.shootRate * 0.3 : player.shootRate;
        player.shootCooldown = shootRate;
        
        if (multiShot) {
            // Shoot 3 bullets in a spread
            for (let i = -1; i <= 1; i++) {
                this.createBullet(player.x + i * 15, player.y - 10, 0, -8, '#00ff00');
            }
            this.shotsFired += 3;
        } else {
            // Single bullet
            this.createBullet(player.x, player.y - 10, 0, -8, '#00ff00');
            this.shotsFired++;
        }
        
        AudioManager.playSound('shoot');
    }
    
    createBullet(x, y, vx, vy, color = '#00ff00', owner = 'player') {
        this.bullets.push({
            x, y, vx, vy, color, owner,
            width: 4,
            height: 8,
            damage: 25,
            trail: []
        });
    }
    
    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // Add to trail
            bullet.trail.push({ x: bullet.x, y: bullet.y, time: this.gameTime });
            bullet.trail = bullet.trail.filter(point => this.gameTime - point.time < 100);
            
            // Remove bullets that are off-screen
            if (bullet.y < -10 || bullet.y > this.canvasHeight + 10 || 
                bullet.x < -10 || bullet.x > this.canvasWidth + 10) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    spawnEnemies(deltaTime) {
        if (this.waveComplete || this.enemiesSpawned >= this.enemiesPerWave) return;
        
        if (Date.now() - this.lastEnemySpawn > this.enemySpawnRate) {
            this.spawnEnemy();
            this.lastEnemySpawn = Date.now();
            this.enemiesSpawned++;
        }
    }
    
    spawnEnemy() {
        const enemyTypes = [
            { type: 'basic', health: 50, speed: 2, score: 100, color: '#ff4444' },
            { type: 'fast', health: 30, speed: 4, score: 150, color: '#ffff44' },
            { type: 'tank', health: 100, speed: 1, score: 200, color: '#ff8844' },
            { type: 'shooter', health: 40, speed: 1.5, score: 180, color: '#ff44ff' }
        ];
        
        // Choose enemy type based on wave
        let availableTypes = enemyTypes.slice(0, Math.min(this.wave, enemyTypes.length));
        const enemyData = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        const enemy = {
            x: Math.random() * (this.canvasWidth - 40) + 20,
            y: -30,
            width: 30,
            height: 30,
            vx: (Math.random() - 0.5) * 2,
            vy: enemyData.speed,
            health: enemyData.health + Math.floor(this.wave * 10),
            maxHealth: enemyData.health + Math.floor(this.wave * 10),
            type: enemyData.type,
            color: enemyData.color,
            score: enemyData.score,
            lastShot: 0,
            shootRate: 2000,
            trail: []
        };
        
        this.enemies.push(enemy);
        this.createParticles(enemy.x, enemy.y, 5, enemy.color, 'spawn');
    }
    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Move enemy
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
            
            // Add to trail
            enemy.trail.push({ x: enemy.x, y: enemy.y, time: this.gameTime });
            enemy.trail = enemy.trail.filter(point => this.gameTime - point.time < 150);
            
            // Enemy shooting (for shooter type)
            if (enemy.type === 'shooter' && Date.now() - enemy.lastShot > enemy.shootRate) {
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 300) {
                    const speed = 3;
                    this.createBullet(
                        enemy.x, 
                        enemy.y + 15, 
                        (dx / distance) * speed, 
                        (dy / distance) * speed, 
                        '#ff0000', 
                        'enemy'
                    );
                    enemy.lastShot = Date.now();
                }
            }
            
            // Remove enemies that are off-screen
            if (enemy.y > this.canvasHeight + 50) {
                this.enemies.splice(i, 1);
                this.takeDamage(10); // Player takes damage for missed enemy
            }
            
            // Keep enemies in horizontal bounds
            if (enemy.x <= 15 || enemy.x >= this.canvasWidth - 15) {
                enemy.vx *= -1;
            }
        }
    }
    
    updatePowerUps(deltaTime) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            powerUp.y += powerUp.speed;
            powerUp.rotation += powerUp.rotationSpeed;
            
            // Remove power-ups that are off-screen
            if (powerUp.y > this.canvasHeight + 20) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            particle.opacity = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateStars(deltaTime) {
        for (const star of this.stars) {
            star.y += star.speed;
            
            if (star.y > this.canvasHeight) {
                star.y = -5;
                star.x = Math.random() * this.canvasWidth;
            }
        }
    }
    
    updateActivePowerUps(deltaTime) {
        for (const [type, powerUp] of this.activePowerUps) {
            powerUp.duration -= deltaTime;
            
            if (powerUp.duration <= 0) {
                this.activePowerUps.delete(type);
                UI.removePowerUpIcon(type);
            }
        }
    }
    
    checkCollisions() {
        // Player bullets vs enemies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.owner !== 'player') continue;
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                if (this.isColliding(bullet, enemy)) {
                    // Damage enemy
                    enemy.health -= bullet.damage;
                    this.bullets.splice(i, 1);
                    this.shotsHit++;
                    
                    // Create hit particles
                    this.createParticles(enemy.x, enemy.y, 8, '#ffff00', 'explosion');
                    
                    if (enemy.health <= 0) {
                        // Enemy destroyed
                        this.score += enemy.score;
                        this.enemiesDefeated++;
                        this.enemies.splice(j, 1);
                        
                        // Create explosion
                        this.createParticles(enemy.x, enemy.y, 15, enemy.color, 'explosion');
                        AudioManager.playSound('explosion');
                        
                        // Chance to spawn power-up
                        if (Math.random() < this.powerUpSpawnChance) {
                            this.spawnPowerUp(enemy.x, enemy.y);
                        }
                    }
                    break;
                }
            }
        }
        
        // Enemy bullets vs player
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.owner !== 'enemy') continue;
            
            if (this.isColliding(bullet, this.player)) {
                this.bullets.splice(i, 1);
                this.takeDamage(15);
                this.createParticles(this.player.x, this.player.y, 5, '#ff0000', 'hit');
            }
        }
        
        // Player vs enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (this.isColliding(this.player, enemy)) {
                this.enemies.splice(i, 1);
                this.takeDamage(25);
                this.createParticles(this.player.x, this.player.y, 10, '#ff0000', 'explosion');
                AudioManager.playSound('hit');
            }
        }
        
        // Player vs power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (this.isColliding(this.player, powerUp)) {
                this.collectPowerUp(powerUp);
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    takeDamage(amount) {
        if (this.activePowerUps.has('shield')) return;
        
        this.health -= amount;
        this.health = Math.max(0, this.health);
        
        if (this.health <= 0) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.health = this.maxHealth;
                this.createParticles(this.player.x, this.player.y, 20, '#00ff00', 'respawn');
            }
        }
    }
    
    spawnPowerUp(x, y) {
        const powerUpTypes = [
            { type: 'rapidFire', icon: '🔥', color: '#ff4400' },
            { type: 'multiShot', icon: '💥', color: '#ff8800' },
            { type: 'shield', icon: '🛡️', color: '#0088ff' },
            { type: 'health', icon: '❤️', color: '#ff0088' }
        ];
        
        const powerUpData = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        this.powerUps.push({
            x: x,
            y: y,
            width: 25,
            height: 25,
            type: powerUpData.type,
            icon: powerUpData.icon,
            color: powerUpData.color,
            speed: 2,
            rotation: 0,
            rotationSpeed: 0.1
        });
    }
    
    collectPowerUp(powerUp) {
        switch (powerUp.type) {
            case 'rapidFire':
                this.activePowerUps.set('rapidFire', { duration: 10000 });
                break;
            case 'multiShot':
                this.activePowerUps.set('multiShot', { duration: 8000 });
                break;
            case 'shield':
                this.activePowerUps.set('shield', { duration: 5000 });
                break;
            case 'health':
                this.health = Math.min(this.maxHealth, this.health + 30);
                break;
        }
        
        if (powerUp.type !== 'health') {
            UI.addPowerUpIcon(powerUp.type, powerUp.icon);
        }
        
        this.createParticles(powerUp.x, powerUp.y, 10, powerUp.color, 'collect');
        AudioManager.playSound('powerUp');
    }
    
    createParticles(x, y, count, color, type = 'explosion') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = type === 'explosion' ? Math.random() * 4 + 2 : Math.random() * 2 + 1;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                size: Math.random() * 3 + 1,
                life: type === 'explosion' ? 500 : 300,
                maxLife: type === 'explosion' ? 500 : 300,
                opacity: 1
            });
        }
    }
    
    checkWaveCompletion() {
        if (this.enemiesSpawned >= this.enemiesPerWave && this.enemies.length === 0 && !this.waveComplete) {
            this.waveComplete = true;
            this.wave++;
            this.enemiesSpawned = 0;
            this.enemiesPerWave += 2;
            this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 100);
            
            setTimeout(() => {
                this.waveComplete = false;
                this.waveStartTime = Date.now();
                this.showWaveMessage(`Wave ${this.wave}`);
            }, 2000);
        }
    }
    
    showWaveMessage(message) {
        const waveMessageEl = document.getElementById('waveMessage');
        waveMessageEl.textContent = message;
        waveMessageEl.style.display = 'block';
        
        setTimeout(() => {
            waveMessageEl.style.display = 'none';
        }, 3000);
    }
    
    updateUI() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentWave').textContent = this.wave;
        document.getElementById('currentLives').textContent = this.lives;
        
        const healthFill = document.getElementById('healthFill');
        const healthPercent = (this.health / this.maxHealth) * 100;
        healthFill.style.width = healthPercent + '%';
        
        // Update health bar color
        if (healthPercent > 60) {
            healthFill.style.background = 'linear-gradient(90deg, #00ff00, #88ff00)';
        } else if (healthPercent > 30) {
            healthFill.style.background = 'linear-gradient(90deg, #ffff00, #ff8800)';
        } else {
            healthFill.style.background = 'linear-gradient(90deg, #ff0000, #ff4400)';
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw stars
        this.drawStars();
        
        if (this.gameState === 'playing') {
            // Draw game objects
            this.drawPlayer();
            this.drawBullets();
            this.drawEnemies();
            this.drawPowerUps();
        }
        
        // Draw particles
        this.drawParticles();
    }
    
    drawStars() {
        this.ctx.save();
        for (const star of this.stars) {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }
        this.ctx.restore();
    }
    
    drawPlayer() {
        const player = this.player;
        
        // Draw trail
        this.ctx.save();
        for (let i = 0; i < player.trail.length; i++) {
            const point = player.trail[i];
            const alpha = i / player.trail.length * 0.5;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = player.color;
            this.ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
        }
        this.ctx.restore();
        
        // Draw player ship
        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        
        // Shield effect
        if (this.activePowerUps.has('shield')) {
            this.ctx.strokeStyle = '#00aaff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Draw ship
        this.ctx.fillStyle = player.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -15);
        this.ctx.lineTo(-10, 10);
        this.ctx.lineTo(0, 5);
        this.ctx.lineTo(10, 10);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawBullets() {
        for (const bullet of this.bullets) {
            // Draw trail
            this.ctx.save();
            for (let i = 0; i < bullet.trail.length; i++) {
                const point = bullet.trail[i];
                const alpha = (i / bullet.trail.length) * 0.8;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = bullet.color;
                this.ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
            }
            this.ctx.restore();
            
            // Draw bullet
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x - bullet.width/2, bullet.y - bullet.height/2, bullet.width, bullet.height);
        }
    }
    
    drawEnemies() {
        for (const enemy of this.enemies) {
            // Draw trail
            this.ctx.save();
            for (let i = 0; i < enemy.trail.length; i++) {
                const point = enemy.trail[i];
                const alpha = (i / enemy.trail.length) * 0.3;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
            }
            this.ctx.restore();
            
            // Draw enemy
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x - enemy.width/2, enemy.y - enemy.height/2, enemy.width, enemy.height);
            
            // Draw health bar
            const healthPercent = enemy.health / enemy.maxHealth;
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(enemy.x - 15, enemy.y - 20, 30, 3);
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(enemy.x - 15, enemy.y - 20, 30 * healthPercent, 3);
        }
    }
    
    drawPowerUps() {
        for (const powerUp of this.powerUps) {
            this.ctx.save();
            this.ctx.translate(powerUp.x, powerUp.y);
            this.ctx.rotate(powerUp.rotation);
            
            // Draw glow
            this.ctx.shadowColor = powerUp.color;
            this.ctx.shadowBlur = 10;
            
            this.ctx.fillStyle = powerUp.color;
            this.ctx.fillRect(-powerUp.width/2, -powerUp.height/2, powerUp.width, powerUp.height);
            
            // Draw icon
            this.ctx.shadowBlur = 0;
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(powerUp.icon, 0, 5);
            
            this.ctx.restore();
        }
    }
    
    drawParticles() {
        for (const particle of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
            this.ctx.restore();
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize game instance
let game = null;