// AI Opponent System
const AI = {
    // AI state
    state: {
        momentum: 3,
        maxMomentum: 12,
        deck: [],
        hand: [],
        difficulty: 'normal', // easy, normal, hard
        lastPlayTime: 0,
        playInterval: 3000, // Base interval between plays
        
        // Strategy state
        laneUnits: { 0: 0, 1: 0 }, // Count of units in each lane
        playerLaneUnits: { 0: 0, 1: 0 },
        lastLaneChoice: 0,
        aggressionLevel: 0.5, // 0 = defensive, 1 = aggressive
        
        // Timing
        isActive: false,
        nextPlayTime: 0
    },

    // Initialize AI
    init() {
        this.setupDeck();
        this.startMomentumRegen();
        console.log('AI initialized');
    },

    // Setup AI deck (uses same cards as player)
    setupDeck() {
        // Use unlocked cards or basic set
        const availableCards = Cards.getUnlockedCards(Game.state.honorPoints);
        
        // Create balanced deck
        this.state.deck = this.createBalancedDeck(availableCards);
        
        // Shuffle and prepare hand
        this.shuffleDeck();
        this.drawInitialHand();
    },

    // Create a balanced deck for AI
    createBalancedDeck(availableCards) {
        const warriors = availableCards.filter(card => card.type === 'warrior');
        const ranged = availableCards.filter(card => card.type === 'ranged');
        const utility = availableCards.filter(card => card.type === 'utility');
        
        const deck = [];
        
        // Add 4 warriors (tanks and damage dealers)
        for (let i = 0; i < 4; i++) {
            if (warriors.length > 0) {
                const card = warriors[i % warriors.length];
                deck.push(card.id);
            }
        }
        
        // Add 3 ranged units
        for (let i = 0; i < 3; i++) {
            if (ranged.length > 0) {
                const card = ranged[i % ranged.length];
                deck.push(card.id);
            }
        }
        
        // Add 1 utility unit
        if (utility.length > 0) {
            deck.push(utility[0].id);
        }
        
        // Fill remaining slots with best available cards
        while (deck.length < 8) {
            const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
            deck.push(randomCard.id);
        }
        
        return deck;
    },

    // Shuffle deck
    shuffleDeck() {
        this.state.deck = this.state.deck.sort(() => Math.random() - 0.5);
    },

    // Draw initial hand
    drawInitialHand() {
        this.state.hand = [];
        for (let i = 0; i < 4; i++) {
            this.drawCard();
        }
    },

    // Draw card from deck
    drawCard() {
        if (this.state.hand.length < 4) {
            if (this.state.deck.length === 0) {
                this.shuffleDeck();
            }
            
            const cardId = this.state.deck.shift();
            this.state.hand.push(cardId);
        }
    },

    // Start AI
    start() {
        this.state.isActive = true;
        this.state.momentum = 3;
        this.state.nextPlayTime = Date.now() + this.getPlayInterval();
        this.startAILoop();
        console.log('AI started');
    },

    // Stop AI
    stop() {
        this.state.isActive = false;
        console.log('AI stopped');
    },

    // Start AI decision loop
    startAILoop() {
        const aiLoop = () => {
            if (!this.state.isActive || !Game.state.isPlaying) {
                return;
            }
            
            const now = Date.now();
            
            // Check if it's time to make a play
            if (now >= this.state.nextPlayTime) {
                this.makePlay();
                this.state.nextPlayTime = now + this.getPlayInterval();
            }
            
            // Update strategy
            this.updateStrategy();
            
            // Continue loop
            setTimeout(aiLoop, 100); // Check every 100ms
        };
        
        aiLoop();
    },

    // Get play interval based on difficulty and situation
    getPlayInterval() {
        let baseInterval = this.state.playInterval;
        
        // Adjust based on difficulty
        switch (this.state.difficulty) {
            case 'easy':
                baseInterval *= 1.5;
                break;
            case 'hard':
                baseInterval *= 0.7;
                break;
        }
        
        // Add randomness
        const randomFactor = 0.5 + Math.random();
        baseInterval *= randomFactor;
        
        // Faster play when under pressure
        const playerPressure = this.calculatePlayerPressure();
        if (playerPressure > 0.7) {
            baseInterval *= 0.6;
        }
        
        return Math.max(1000, baseInterval);
    },

    // Calculate player pressure (how much threat player poses)
    calculatePlayerPressure() {
        const playerUnits = Game.state.playerUnits.length;
        const aiUnits = Game.state.enemyUnits.length;
        
        // Consider unit count difference
        let pressure = Math.max(0, (playerUnits - aiUnits) / 5);
        
        // Consider totem health
        const aiTotemHealth = this.getTotalTotemHealth();
        const maxTotemHealth = 4000; // Total max health
        const healthPressure = 1 - (aiTotemHealth / maxTotemHealth);
        
        pressure = Math.max(pressure, healthPressure);
        
        return Math.min(1, pressure);
    },

    // Get total AI totem health
    getTotalTotemHealth() {
        return Game.state.enemyTotems.left.hp + 
               Game.state.enemyTotems.main.hp + 
               Game.state.enemyTotems.right.hp;
    },

    // Make a play decision
    makePlay() {
        // Update unit counts
        this.updateUnitCounts();
        
        // Get playable cards
        const playableCards = this.getPlayableCards();
        
        if (playableCards.length === 0) {
            return; // No cards can be played
        }
        
        // Choose best card to play
        const cardToPlay = this.chooseBestCard(playableCards);
        
        if (cardToPlay) {
            // Choose lane
            const lane = this.chooseLane(cardToPlay);
            
            // Play the card
            this.playCard(cardToPlay, lane);
        }
    },

    // Update unit counts for strategy
    updateUnitCounts() {
        this.state.laneUnits = { 0: 0, 1: 0 };
        this.state.playerLaneUnits = { 0: 0, 1: 0 };
        
        // Count AI units
        Game.state.enemyUnits.forEach(unit => {
            this.state.laneUnits[unit.lane]++;
        });
        
        // Count player units
        Game.state.playerUnits.forEach(unit => {
            this.state.playerLaneUnits[unit.lane]++;
        });
    },

    // Get cards that can be played with current momentum
    getPlayableCards() {
        return this.state.hand.filter(cardId => {
            const card = Cards.getCard(cardId);
            return card && card.cost <= this.state.momentum;
        });
    },

    // Choose best card to play
    chooseBestCard(playableCards) {
        if (playableCards.length === 0) return null;
        
        // Score each card
        const cardScores = playableCards.map(cardId => ({
            cardId,
            score: this.scoreCard(cardId)
        }));
        
        // Sort by score
        cardScores.sort((a, b) => b.score - a.score);
        
        // Add some randomness to prevent predictability
        const topCards = cardScores.slice(0, Math.min(3, cardScores.length));
        const randomIndex = Math.floor(Math.random() * topCards.length);
        
        return topCards[randomIndex].cardId;
    },

    // Score a card for current situation
    scoreCard(cardId) {
        const card = Cards.getCard(cardId);
        if (!card) return 0;
        
        let score = 0;
        
        // Base stats score
        score += card.hp / 10;
        score += card.damage / 5;
        score += card.speed;
        score += card.range * 5;
        
        // Cost efficiency
        const efficiency = (card.hp + card.damage * 2) / card.cost;
        score += efficiency * 10;
        
        // Situational bonuses
        const pressure = this.calculatePlayerPressure();
        
        // Under pressure - prefer defensive units
        if (pressure > 0.6) {
            if (card.type === 'warrior' && card.hp > 200) {
                score += 50; // Prefer tanks
            }
            if (card.special === 'heal' || card.special === 'shield') {
                score += 30; // Prefer defensive abilities
            }
        } else {
            // Safe situation - prefer aggressive units
            if (card.type === 'ranged' && card.damage > 70) {
                score += 40; // Prefer high damage ranged
            }
            if (card.special === 'burn' || card.special === 'poison') {
                score += 25; // Prefer damage over time
            }
        }
        
        // Special ability bonuses
        switch (card.special) {
            case 'splash':
                score += 20; // Good against grouped units
                break;
            case 'chain':
                score += 15; // Good for multiple targets
                break;
            case 'lifesteal':
                score += 10; // Sustain
                break;
            case 'stealth':
                score += pressure > 0.5 ? 25 : 10; // Better when under pressure
                break;
        }
        
        return score;
    },

    // Choose lane to play card in
    chooseLane(cardId) {
        const card = Cards.getCard(cardId);
        if (!card) return 0;
        
        let laneScores = [0, 0];
        
        // Consider player unit distribution
        const playerLane0 = this.state.playerLaneUnits[0];
        const playerLane1 = this.state.playerLaneUnits[1];
        
        // Consider AI unit distribution
        const aiLane0 = this.state.laneUnits[0];
        const aiLane1 = this.state.laneUnits[1];
        
        // Strategy based on card type
        if (card.type === 'warrior') {
            // Warriors go where there are more enemies to tank
            laneScores[0] += playerLane0 * 10;
            laneScores[1] += playerLane1 * 10;
            
            // But avoid overcrowding own lane
            laneScores[0] -= aiLane0 * 5;
            laneScores[1] -= aiLane1 * 5;
        } else if (card.type === 'ranged') {
            // Ranged units prefer less crowded lanes for positioning
            laneScores[0] -= aiLane0 * 8;
            laneScores[1] -= aiLane1 * 8;
            
            // Support lanes with existing units
            laneScores[0] += aiLane0 * 3;
            laneScores[1] += aiLane1 * 3;
        } else if (card.type === 'utility') {
            // Utility units go where they can support most units
            laneScores[0] += aiLane0 * 15;
            laneScores[1] += aiLane1 * 15;
        }
        
        // Avoid alternating lanes too predictably
        if (this.state.lastLaneChoice === 0) {
            laneScores[1] += 5;
        } else {
            laneScores[0] += 5;
        }
        
        // Add randomness
        laneScores[0] += Math.random() * 10;
        laneScores[1] += Math.random() * 10;
        
        // Choose lane with higher score
        const chosenLane = laneScores[0] > laneScores[1] ? 0 : 1;
        this.state.lastLaneChoice = chosenLane;
        
        return chosenLane;
    },

    // Play a card
    playCard(cardId, lane) {
        const card = Cards.getCard(cardId);
        if (!card || this.state.momentum < card.cost) {
            return false;
        }
        
        // Remove from hand
        const cardIndex = this.state.hand.indexOf(cardId);
        if (cardIndex === -1) return false;
        
        this.state.hand.splice(cardIndex, 1);
        this.state.momentum -= card.cost;
        
        // Spawn unit
        Game.spawnUnit(cardId, lane, 'enemy');
        
        // Draw new card
        this.drawCard();
        
        console.log(`AI played ${card.nameKey} in lane ${lane} for ${card.cost} momentum`);
        return true;
    },

    // Update AI strategy based on game state
    updateStrategy() {
        const pressure = this.calculatePlayerPressure();
        
        // Adjust aggression based on situation
        if (pressure > 0.7) {
            this.state.aggressionLevel = Math.max(0.2, this.state.aggressionLevel - 0.1);
        } else if (pressure < 0.3) {
            this.state.aggressionLevel = Math.min(0.8, this.state.aggressionLevel + 0.05);
        }
        
        // Adjust play interval based on pressure
        if (pressure > 0.8) {
            this.state.playInterval = 2000; // Play faster when under pressure
        } else {
            this.state.playInterval = 3500; // Normal pace
        }
    },

    // Start momentum regeneration for AI
    startMomentumRegen() {
        setInterval(() => {
            if (this.state.isActive && this.state.momentum < this.state.maxMomentum) {
                const arena = Game.state.currentArena;
                let regenRate = 1;
                
                // Apply arena passive
                if (arena && arena.passive === 'momentum') {
                    regenRate *= arena.passiveValue;
                }
                
                this.state.momentum = Math.min(this.state.maxMomentum, this.state.momentum + regenRate);
            }
        }, 1500); // Same as player
    },

    // Set difficulty
    setDifficulty(difficulty) {
        this.state.difficulty = difficulty;
        
        switch (difficulty) {
            case 'easy':
                this.state.aggressionLevel = 0.3;
                this.state.playInterval = 4000;
                break;
            case 'normal':
                this.state.aggressionLevel = 0.5;
                this.state.playInterval = 3000;
                break;
            case 'hard':
                this.state.aggressionLevel = 0.7;
                this.state.playInterval = 2500;
                break;
        }
    },

    // Reset AI state
    reset() {
        this.state.momentum = 3;
        this.state.hand = [];
        this.state.laneUnits = { 0: 0, 1: 0 };
        this.state.playerLaneUnits = { 0: 0, 1: 0 };
        this.state.lastLaneChoice = 0;
        this.state.isActive = false;
        
        this.setupDeck();
    },

    // Get AI status for debugging
    getStatus() {
        return {
            momentum: this.state.momentum,
            handSize: this.state.hand.length,
            aggression: this.state.aggressionLevel,
            pressure: this.calculatePlayerPressure(),
            laneUnits: this.state.laneUnits,
            isActive: this.state.isActive
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI;
}