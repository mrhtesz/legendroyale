// Core Game Engine
const Game = {
    // Game state
    state: {
        currentScreen: 'menu',
        isPlaying: false,
        isPaused: false,
        battleTime: 180, // 3 minutes in seconds
        battleTimeLeft: 180,
        momentum: 3,
        maxMomentum: 12,
        lastMomentumUpdate: 0,
        momentumRegenRate: 1500, // milliseconds
        
        // Player data
        honorPoints: 0,
        unlockedCards: [],
        currentDeck: [],
        currentArena: null,
        
        // Battle state
        playerTotems: {
            left: { hp: 1000, maxHp: 1000 },
            main: { hp: 2000, maxHp: 2000 },
            right: { hp: 1000, maxHp: 1000 }
        },
        enemyTotems: {
            left: { hp: 1000, maxHp: 1000 },
            main: { hp: 2000, maxHp: 2000 },
            right: { hp: 1000, maxHp: 1000 }
        },
        
        // Units on battlefield
        playerUnits: [],
        enemyUnits: [],
        
        // Hand and deck
        hand: [],
        deckCards: [],
        
        // Canvas and rendering
        canvas: null,
        ctx: null,
        
        // Game loop
        lastFrameTime: 0,
        animationId: null
    },

    // Initialize game
    init() {
        this.loadPlayerData();
        this.setupCanvas();
        this.initializeUI();
        
        // Start momentum regeneration
        this.startMomentumRegen();
        
        console.log('Game initialized');
    },

    // Load player data from localStorage
    loadPlayerData() {
        const savedData = localStorage.getItem('enchantedRealmsData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.state.honorPoints = data.honorPoints || 0;
            this.state.unlockedCards = data.unlockedCards || Cards.getUnlockedCards(0);
            this.state.currentDeck = data.currentDeck || Cards.getStartingDeck();
        } else {
            // First time player
            this.state.honorPoints = 0;
            this.state.unlockedCards = Cards.getUnlockedCards(0);
            this.state.currentDeck = Cards.getStartingDeck();
        }
        
        this.state.currentArena = Cards.getCurrentArena(this.state.honorPoints);
        this.savePlayerData();
    },

    // Save player data to localStorage
    savePlayerData() {
        const data = {
            honorPoints: this.state.honorPoints,
            unlockedCards: this.state.unlockedCards,
            currentDeck: this.state.currentDeck
        };
        localStorage.setItem('enchantedRealmsData', JSON.stringify(data));
    },

    // Setup canvas for battle rendering
    setupCanvas() {
        this.state.canvas = document.getElementById('game-canvas');
        this.state.ctx = this.state.canvas.getContext('2d');
        
        // Resize canvas to container
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    // Resize canvas to fit container
    resizeCanvas() {
        const container = document.querySelector('.battle-field');
        if (container && this.state.canvas) {
            this.state.canvas.width = container.clientWidth;
            this.state.canvas.height = container.clientHeight;
        }
    },

    // Initialize UI elements
    initializeUI() {
        this.updateHonorDisplay();
        this.updateArenaDisplay();
    },

    // Start battle
    startBattle() {
        this.state.isPlaying = true;
        this.state.battleTimeLeft = this.state.battleTime;
        this.state.momentum = 3;
        
        // Reset totems
        this.resetTotems();
        
        // Clear battlefield
        this.state.playerUnits = [];
        this.state.enemyUnits = [];
        
        // Prepare deck and hand
        this.prepareDeckAndHand();
        
        // Apply arena background
        this.applyArenaBackground();
        
        // Start game loop
        this.startGameLoop();
        
        // Start battle timer
        this.startBattleTimer();
        
        console.log('Battle started');
    },

    // End battle
    endBattle(result) {
        this.state.isPlaying = false;
        this.stopGameLoop();
        
        // Calculate honor change
        let honorChange = 0;
        if (result === 'victory') {
            honorChange = 3;
        } else if (result === 'defeat') {
            honorChange = -1;
        }
        
        // Update honor points
        this.state.honorPoints = Math.max(0, this.state.honorPoints + honorChange);
        
        // Update unlocked cards and arena
        this.state.unlockedCards = Cards.getUnlockedCards(this.state.honorPoints);
        this.state.currentArena = Cards.getCurrentArena(this.state.honorPoints);
        
        // Save progress
        this.savePlayerData();
        
        // Show result
        this.showBattleResult(result, honorChange);
        
        console.log(`Battle ended: ${result}, Honor change: ${honorChange}`);
    },

    // Reset totems to full health
    resetTotems() {
        Object.keys(this.state.playerTotems).forEach(key => {
            this.state.playerTotems[key].hp = this.state.playerTotems[key].maxHp;
        });
        Object.keys(this.state.enemyTotems).forEach(key => {
            this.state.enemyTotems[key].hp = this.state.enemyTotems[key].maxHp;
        });
        this.updateTotemUI();
    },

    // Prepare deck and initial hand
    prepareDeckAndHand() {
        // Shuffle deck
        this.state.deckCards = [...this.state.currentDeck].sort(() => Math.random() - 0.5);
        
        // Draw initial hand (4 cards)
        this.state.hand = [];
        for (let i = 0; i < 4; i++) {
            this.drawCard();
        }
        
        this.updateHandUI();
    },

    // Draw a card from deck to hand
    drawCard() {
        if (this.state.deckCards.length > 0 && this.state.hand.length < 4) {
            const cardId = this.state.deckCards.shift();
            this.state.hand.push(cardId);
            
            // Refill deck if empty
            if (this.state.deckCards.length === 0) {
                this.state.deckCards = [...this.state.currentDeck].sort(() => Math.random() - 0.5);
            }
        }
    },

    // Play a card
    playCard(cardId, lane) {
        const card = Cards.getCard(cardId);
        if (!card || this.state.momentum < card.cost) {
            return false;
        }
        
        // Remove card from hand
        const cardIndex = this.state.hand.indexOf(cardId);
        if (cardIndex === -1) return false;
        
        this.state.hand.splice(cardIndex, 1);
        this.state.momentum -= card.cost;
        
        // Create unit
        this.spawnUnit(cardId, lane, 'player');
        
        // Draw new card
        this.drawCard();
        
        // Update UI
        this.updateHandUI();
        this.updateMomentumUI();
        
        return true;
    },

    // Spawn a unit on the battlefield
    spawnUnit(cardId, lane, owner) {
        const card = Cards.getCard(cardId);
        if (!card) return;
        
        const unit = {
            id: Math.random().toString(36).substr(2, 9),
            cardId: cardId,
            owner: owner,
            lane: lane, // 0 = left, 1 = right
            
            // Stats from card
            hp: card.hp,
            maxHp: card.hp,
            damage: card.damage,
            speed: card.speed,
            range: card.range,
            special: card.special,
            
            // Position and state
            x: owner === 'player' ? 50 : this.state.canvas.width - 50,
            y: lane === 0 ? this.state.canvas.height * 0.3 : this.state.canvas.height * 0.7,
            
            // Combat state
            target: null,
            lastAttackTime: 0,
            attackCooldown: 1000, // 1 second
            
            // Special effects
            effects: [],
            stealthTime: card.special === 'stealth' ? 2000 : 0,
            
            // Movement
            moving: true,
            direction: owner === 'player' ? 1 : -1
        };
        
        // Add to appropriate army
        if (owner === 'player') {
            this.state.playerUnits.push(unit);
        } else {
            this.state.enemyUnits.push(unit);
        }
        
        console.log(`${owner} spawned ${card.nameKey} in lane ${lane}`);
    },

    // Start momentum regeneration
    startMomentumRegen() {
        setInterval(() => {
            if (this.state.isPlaying && this.state.momentum < this.state.maxMomentum) {
                const arena = this.state.currentArena;
                let regenRate = 1;
                
                // Apply arena passive
                if (arena && arena.passive === 'momentum') {
                    regenRate *= arena.passiveValue;
                }
                
                this.state.momentum = Math.min(this.state.maxMomentum, this.state.momentum + regenRate);
                this.updateMomentumUI();
            }
        }, this.state.momentumRegenRate);
    },

    // Start battle timer
    startBattleTimer() {
        const timerInterval = setInterval(() => {
            if (!this.state.isPlaying) {
                clearInterval(timerInterval);
                return;
            }
            
            this.state.battleTimeLeft--;
            this.updateTimerUI();
            
            if (this.state.battleTimeLeft <= 0) {
                clearInterval(timerInterval);
                this.checkBattleEnd();
            }
        }, 1000);
    },

    // Check if battle should end
    checkBattleEnd() {
        // Check if main totem is destroyed
        if (this.state.playerTotems.main.hp <= 0) {
            this.endBattle('defeat');
            return true;
        }
        if (this.state.enemyTotems.main.hp <= 0) {
            this.endBattle('victory');
            return true;
        }
        
        // Check time limit
        if (this.state.battleTimeLeft <= 0) {
            const playerTotal = this.getTotalTotemHP('player');
            const enemyTotal = this.getTotalTotemHP('enemy');
            
            if (playerTotal > enemyTotal) {
                this.endBattle('victory');
            } else if (enemyTotal > playerTotal) {
                this.endBattle('defeat');
            } else {
                this.endBattle('draw');
            }
            return true;
        }
        
        return false;
    },

    // Get total totem HP for a side
    getTotalTotemHP(side) {
        const totems = side === 'player' ? this.state.playerTotems : this.state.enemyTotems;
        return totems.left.hp + totems.main.hp + totems.right.hp;
    },

    // Apply arena background
    applyArenaBackground() {
        const battleField = document.querySelector('.battle-field');
        if (battleField && this.state.currentArena) {
            battleField.className = `battle-field ${this.state.currentArena.background}`;
        }
    },

    // Start game loop
    startGameLoop() {
        const gameLoop = (timestamp) => {
            if (!this.state.isPlaying) return;
            
            const deltaTime = timestamp - this.state.lastFrameTime;
            this.state.lastFrameTime = timestamp;
            
            // Update game state
            this.updateUnits(deltaTime);
            this.updateCombat(deltaTime);
            this.applyArenaPassives(deltaTime);
            
            // Render
            this.render();
            
            // Check for battle end
            if (!this.checkBattleEnd()) {
                this.state.animationId = requestAnimationFrame(gameLoop);
            }
        };
        
        this.state.animationId = requestAnimationFrame(gameLoop);
    },

    // Stop game loop
    stopGameLoop() {
        if (this.state.animationId) {
            cancelAnimationFrame(this.state.animationId);
            this.state.animationId = null;
        }
    },

    // Update units (movement, AI, etc.)
    updateUnits(deltaTime) {
        // Update player units
        this.state.playerUnits.forEach(unit => this.updateUnit(unit, deltaTime));
        
        // Update enemy units
        this.state.enemyUnits.forEach(unit => this.updateUnit(unit, deltaTime));
        
        // Remove dead units
        this.state.playerUnits = this.state.playerUnits.filter(unit => unit.hp > 0);
        this.state.enemyUnits = this.state.enemyUnits.filter(unit => unit.hp > 0);
    },

    // Update individual unit
    updateUnit(unit, deltaTime) {
        // Update stealth
        if (unit.stealthTime > 0) {
            unit.stealthTime -= deltaTime;
        }
        
        // Find target
        if (!unit.target || unit.target.hp <= 0) {
            unit.target = this.findTarget(unit);
        }
        
        // Move towards target or totems
        if (unit.target) {
            const distance = Math.abs(unit.x - unit.target.x);
            if (distance > unit.range * 20) { // Scale range for pixels
                unit.x += unit.direction * unit.speed * (deltaTime / 16.67); // 60 FPS normalization
                unit.moving = true;
            } else {
                unit.moving = false;
            }
        } else {
            // Move towards enemy totems
            const targetX = unit.owner === 'player' ? this.state.canvas.width - 100 : 100;
            if (Math.abs(unit.x - targetX) > 50) {
                unit.x += unit.direction * unit.speed * (deltaTime / 16.67);
                unit.moving = true;
            } else {
                unit.moving = false;
            }
        }
    },

    // Find target for unit
    findTarget(unit) {
        const enemies = unit.owner === 'player' ? this.state.enemyUnits : this.state.playerUnits;
        
        // Find closest enemy in same lane
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        enemies.forEach(enemy => {
            if (enemy.lane === unit.lane) {
                const distance = Math.abs(unit.x - enemy.x);
                if (distance < closestDistance && distance <= unit.range * 20) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });
        
        return closestEnemy;
    },

    // Update combat
    updateCombat(deltaTime) {
        // Player units attacking
        this.state.playerUnits.forEach(unit => {
            this.updateUnitCombat(unit, deltaTime);
        });
        
        // Enemy units attacking
        this.state.enemyUnits.forEach(unit => {
            this.updateUnitCombat(unit, deltaTime);
        });
    },

    // Update unit combat
    updateUnitCombat(unit, deltaTime) {
        const now = Date.now();
        
        if (now - unit.lastAttackTime < unit.attackCooldown) {
            return;
        }
        
        // Attack target or totem
        if (unit.target && Math.abs(unit.x - unit.target.x) <= unit.range * 20) {
            this.unitAttack(unit, unit.target);
            unit.lastAttackTime = now;
        } else if (!unit.moving) {
            // Attack totem
            this.attackTotem(unit);
            unit.lastAttackTime = now;
        }
    },

    // Unit attacks another unit
    unitAttack(attacker, target) {
        let damage = attacker.damage;
        
        // Apply special abilities
        if (attacker.special === 'giant-killer' && target.maxHp > 300) {
            damage *= 2;
        }
        
        // Apply damage
        target.hp -= damage;
        
        // Apply special effects
        this.applySpecialEffects(attacker, target, damage);
        
        // Show damage number
        this.showDamageNumber(target.x, target.y, damage);
        
        console.log(`${attacker.cardId} attacks ${target.cardId} for ${damage} damage`);
    },

    // Attack totem
    attackTotem(unit) {
        const totems = unit.owner === 'player' ? this.state.enemyTotems : this.state.playerTotems;
        let targetTotem;
        
        // Determine which totem to attack based on position
        if (unit.lane === 0) {
            targetTotem = totems.left;
        } else {
            targetTotem = totems.right;
        }
        
        // If side totem is destroyed, attack main totem
        if (targetTotem.hp <= 0) {
            targetTotem = totems.main;
        }
        
        if (targetTotem.hp > 0) {
            targetTotem.hp = Math.max(0, targetTotem.hp - unit.damage);
            this.updateTotemUI();
            
            console.log(`${unit.cardId} attacks totem for ${unit.damage} damage`);
        }
    },

    // Apply special effects
    applySpecialEffects(attacker, target, damage) {
        switch (attacker.special) {
            case 'lifesteal':
                attacker.hp = Math.min(attacker.maxHp, attacker.hp + damage * 0.25);
                break;
            case 'burn':
                // Add burn effect
                target.effects.push({
                    type: 'burn',
                    damage: damage * 0.1,
                    duration: 3000,
                    interval: 500,
                    lastTick: Date.now()
                });
                break;
            case 'slow':
                target.speed *= 0.5;
                setTimeout(() => {
                    target.speed /= 0.5;
                }, 3000);
                break;
        }
    },

    // Apply arena passive effects
    applyArenaPassives(deltaTime) {
        const arena = this.state.currentArena;
        if (!arena) return;
        
        switch (arena.passive) {
            case 'regeneration':
                // Heal totems
                Object.values(this.state.playerTotems).forEach(totem => {
                    if (totem.hp > 0 && totem.hp < totem.maxHp) {
                        totem.hp = Math.min(totem.maxHp, totem.hp + arena.passiveValue * (deltaTime / 1000));
                    }
                });
                Object.values(this.state.enemyTotems).forEach(totem => {
                    if (totem.hp > 0 && totem.hp < totem.maxHp) {
                        totem.hp = Math.min(totem.maxHp, totem.hp + arena.passiveValue * (deltaTime / 1000));
                    }
                });
                this.updateTotemUI();
                break;
                
            case 'burn':
                // Damage all units
                [...this.state.playerUnits, ...this.state.enemyUnits].forEach(unit => {
                    unit.hp -= arena.passiveValue * (deltaTime / 1000);
                });
                break;
        }
    },

    // Render game
    render() {
        if (!this.state.ctx) return;
        
        const ctx = this.state.ctx;
        const canvas = this.state.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw lanes
        this.drawLanes(ctx, canvas);
        
        // Draw units
        this.state.playerUnits.forEach(unit => this.drawUnit(ctx, unit, '#4299e1'));
        this.state.enemyUnits.forEach(unit => this.drawUnit(ctx, unit, '#e53e3e'));
    },

    // Draw lanes
    drawLanes(ctx, canvas) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        
        // Lane dividers
        const laneHeight = canvas.height / 2;
        ctx.beginPath();
        ctx.moveTo(0, laneHeight);
        ctx.lineTo(canvas.width, laneHeight);
        ctx.stroke();
        
        ctx.setLineDash([]);
    },

    // Draw unit
    drawUnit(ctx, unit, color) {
        if (unit.stealthTime > 0) {
            ctx.globalAlpha = 0.3;
        }
        
        // Draw unit circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(unit.x, unit.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw health bar
        const barWidth = 30;
        const barHeight = 4;
        const healthPercent = unit.hp / unit.maxHp;
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(unit.x - barWidth/2, unit.y - 25, barWidth, barHeight);
        
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillRect(unit.x - barWidth/2, unit.y - 25, barWidth * healthPercent, barHeight);
        
        ctx.globalAlpha = 1;
    },

    // Show damage number
    showDamageNumber(x, y, damage) {
        // This would create floating damage numbers in a real implementation
        console.log(`Damage: ${damage} at (${x}, ${y})`);
    },

    // Show battle result
    showBattleResult(result, honorChange) {
        const resultMessage = document.getElementById('result-message');
        const honorChangeEl = document.getElementById('honor-change');
        
        if (result === 'victory') {
            resultMessage.textContent = Localization.get('victory');
            resultMessage.className = 'result-message victory';
            honorChangeEl.textContent = Localization.get('honorGained') + honorChange;
            honorChangeEl.className = 'honor-change positive';
        } else if (result === 'defeat') {
            resultMessage.textContent = Localization.get('defeat');
            resultMessage.className = 'result-message defeat';
            honorChangeEl.textContent = Localization.get('honorLost') + Math.abs(honorChange);
            honorChangeEl.className = 'honor-change negative';
        }
        
        UI.showScreen('result');
    },

    // Update UI elements
    updateHonorDisplay() {
        const honorEl = document.getElementById('honor-points');
        if (honorEl) {
            honorEl.textContent = this.state.honorPoints;
        }
    },

    updateArenaDisplay() {
        const arenaEl = document.getElementById('current-arena');
        if (arenaEl && this.state.currentArena) {
            arenaEl.textContent = Localization.get(this.state.currentArena.nameKey);
        }
    },

    updateMomentumUI() {
        const momentumEl = document.getElementById('momentum-text');
        if (momentumEl) {
            momentumEl.textContent = `${Math.floor(this.state.momentum)}/${this.state.maxMomentum}`;
        }
    },

    updateTimerUI() {
        const timerEl = document.getElementById('battle-timer');
        if (timerEl) {
            const minutes = Math.floor(this.state.battleTimeLeft / 60);
            const seconds = this.state.battleTimeLeft % 60;
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    },

    updateTotemUI() {
        // Update player totems
        this.updateTotemHealthBar('player-left-totem', this.state.playerTotems.left);
        this.updateTotemHealthBar('player-main-totem', this.state.playerTotems.main);
        this.updateTotemHealthBar('player-right-totem', this.state.playerTotems.right);
        
        // Update enemy totems
        this.updateTotemHealthBar('enemy-left-totem', this.state.enemyTotems.left);
        this.updateTotemHealthBar('enemy-main-totem', this.state.enemyTotems.main);
        this.updateTotemHealthBar('enemy-right-totem', this.state.enemyTotems.right);
    },

    updateTotemHealthBar(elementId, totem) {
        const element = document.getElementById(elementId);
        if (element) {
            const healthFill = element.querySelector('.health-fill');
            const healthText = element.querySelector('.health-text');
            
            if (healthFill && healthText) {
                const percentage = (totem.hp / totem.maxHp) * 100;
                healthFill.style.width = percentage + '%';
                healthText.textContent = Math.ceil(totem.hp);
                
                // Change color based on health
                if (percentage > 60) {
                    healthFill.style.background = 'linear-gradient(90deg, #48bb78, #38a169)';
                } else if (percentage > 30) {
                    healthFill.style.background = 'linear-gradient(90deg, #ed8936, #dd6b20)';
                } else {
                    healthFill.style.background = 'linear-gradient(90deg, #e53e3e, #c53030)';
                }
            }
        }
    },

    updateHandUI() {
        const handContainer = document.getElementById('hand-cards');
        if (!handContainer) return;
        
        handContainer.innerHTML = '';
        
        this.state.hand.forEach((cardId, index) => {
            const cardElement = Cards.createCardElement(cardId, true);
            if (cardElement) {
                const card = Cards.getCard(cardId);
                
                // Disable if not enough momentum
                if (this.state.momentum < card.cost) {
                    cardElement.classList.add('disabled');
                }
                
                // Add click handler
                cardElement.addEventListener('click', () => {
                    if (!cardElement.classList.contains('disabled')) {
                        this.handleCardPlay(cardId);
                    }
                });
                
                handContainer.appendChild(cardElement);
            }
        });
    },

    // Handle card play (player needs to select lane)
    handleCardPlay(cardId) {
        // Use UI lane selection
        UI.handleCardPlayWithLaneSelection(cardId);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}