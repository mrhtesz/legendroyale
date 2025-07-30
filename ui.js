// UI Management System
const UI = {
    // Current screen state
    currentScreen: 'menu',
    
    // Screen elements
    screens: {},
    
    // Initialize UI
    init() {
        this.cacheScreenElements();
        this.setupEventListeners();
        this.showScreen('menu');
        
        console.log('UI initialized');
    },

    // Cache screen elements for faster access
    cacheScreenElements() {
        this.screens = {
            menu: document.getElementById('menu-screen'),
            deck: document.getElementById('deck-screen'),
            collection: document.getElementById('collection-screen'),
            battle: document.getElementById('battle-screen'),
            result: document.getElementById('result-screen')
        };
    },

    // Setup all event listeners
    setupEventListeners() {
        // Menu screen buttons
        document.getElementById('play-button').addEventListener('click', () => {
            this.startBattle();
        });
        
        document.getElementById('deck-button').addEventListener('click', () => {
            this.showDeckBuilder();
        });
        
        document.getElementById('cards-button').addEventListener('click', () => {
            this.showCardCollection();
        });
        
        // Back to menu buttons
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('menu');
        });
        
        document.getElementById('back-to-menu-2').addEventListener('click', () => {
            this.showScreen('menu');
        });
        
        // Result screen
        document.getElementById('continue-button').addEventListener('click', () => {
            this.showScreen('menu');
        });
        
        // Language selector
        document.getElementById('language-select').addEventListener('change', (e) => {
            Localization.setLanguage(e.target.value);
            this.updateCurrentScreenContent();
        });
    },

    // Show a specific screen
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
            }
        });
        
        // Show target screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
            
            // Update screen-specific content
            this.updateScreenContent(screenName);
        }
    },

    // Update content for current screen
    updateCurrentScreenContent() {
        this.updateScreenContent(this.currentScreen);
    },

    // Update content for specific screen
    updateScreenContent(screenName) {
        switch (screenName) {
            case 'menu':
                this.updateMenuScreen();
                break;
            case 'deck':
                this.updateDeckBuilder();
                break;
            case 'collection':
                this.updateCardCollection();
                break;
            case 'battle':
                this.updateBattleScreen();
                break;
        }
    },

    // Update menu screen
    updateMenuScreen() {
        Game.updateHonorDisplay();
        Game.updateArenaDisplay();
    },

    // Start battle
    startBattle() {
        this.showScreen('battle');
        
        // Initialize AI
        AI.reset();
        AI.init();
        
        // Start game
        Game.startBattle();
        
        // Start AI
        AI.start();
    },

    // Show deck builder
    showDeckBuilder() {
        this.showScreen('deck');
    },

    // Update deck builder screen
    updateDeckBuilder() {
        this.renderCurrentDeck();
        this.renderAvailableCards();
    },

    // Render current deck
    renderCurrentDeck() {
        const deckContainer = document.getElementById('current-deck');
        if (!deckContainer) return;
        
        deckContainer.innerHTML = '';
        
        Game.state.currentDeck.forEach((cardId, index) => {
            const cardElement = Cards.createCardElement(cardId);
            if (cardElement) {
                cardElement.classList.add('deck-card');
                cardElement.dataset.deckIndex = index;
                
                // Add click handler to remove from deck
                cardElement.addEventListener('click', () => {
                    this.removeFromDeck(index);
                });
                
                deckContainer.appendChild(cardElement);
            }
        });
        
        // Update deck count
        const deckLabel = document.getElementById('current-deck-label');
        if (deckLabel) {
            deckLabel.textContent = `${Localization.get('currentDeck')} (${Game.state.currentDeck.length}/8)`;
        }
    },

    // Render available cards for deck building
    renderAvailableCards() {
        const availableContainer = document.getElementById('available-cards');
        if (!availableContainer) return;
        
        availableContainer.innerHTML = '';
        
        const unlockedCards = Cards.getUnlockedCards(Game.state.honorPoints);
        
        unlockedCards.forEach(card => {
            const cardElement = Cards.createCardElement(card.id);
            if (cardElement) {
                cardElement.classList.add('available-card');
                
                // Show how many of this card are in deck
                const countInDeck = Game.state.currentDeck.filter(id => id === card.id).length;
                if (countInDeck > 0) {
                    const countBadge = document.createElement('div');
                    countBadge.className = 'card-count-badge';
                    countBadge.textContent = countInDeck;
                    cardElement.appendChild(countBadge);
                }
                
                // Add click handler to add to deck
                cardElement.addEventListener('click', () => {
                    this.addToDeck(card.id);
                });
                
                availableContainer.appendChild(cardElement);
            }
        });
    },

    // Add card to deck
    addToDeck(cardId) {
        if (Game.state.currentDeck.length < 8) {
            Game.state.currentDeck.push(cardId);
            Game.savePlayerData();
            this.renderCurrentDeck();
            this.renderAvailableCards();
        }
    },

    // Remove card from deck
    removeFromDeck(index) {
        if (index >= 0 && index < Game.state.currentDeck.length) {
            Game.state.currentDeck.splice(index, 1);
            Game.savePlayerData();
            this.renderCurrentDeck();
            this.renderAvailableCards();
        }
    },

    // Show card collection
    showCardCollection() {
        this.showScreen('collection');
    },

    // Update card collection screen
    updateCardCollection() {
        this.renderAllCards();
    },

    // Render all cards in collection
    renderAllCards() {
        const allCardsContainer = document.getElementById('all-cards');
        if (!allCardsContainer) return;
        
        allCardsContainer.innerHTML = '';
        
        const allCards = Cards.getAllCards();
        const unlockedCardIds = Cards.getUnlockedCards(Game.state.honorPoints).map(card => card.id);
        
        // Group cards by type
        const cardsByType = {
            warrior: [],
            ranged: [],
            utility: []
        };
        
        allCards.forEach(card => {
            cardsByType[card.type].push(card);
        });
        
        // Render each type section
        Object.keys(cardsByType).forEach(type => {
            if (cardsByType[type].length > 0) {
                // Create type header
                const typeHeader = document.createElement('h3');
                typeHeader.className = 'card-type-header';
                typeHeader.textContent = Localization.get(type);
                allCardsContainer.appendChild(typeHeader);
                
                // Create cards container for this type
                const typeContainer = document.createElement('div');
                typeContainer.className = 'card-type-container';
                
                cardsByType[type].forEach(card => {
                    const cardElement = Cards.createCardElement(card.id);
                    if (cardElement) {
                        // Check if unlocked
                        if (!unlockedCardIds.includes(card.id)) {
                            cardElement.classList.add('locked');
                            cardElement.style.opacity = '0.3';
                            
                            // Add unlock requirement
                            const unlockReq = document.createElement('div');
                            unlockReq.className = 'unlock-requirement';
                            unlockReq.textContent = `${Localization.get('honorPoints')}: ${card.unlockHonor}`;
                            cardElement.appendChild(unlockReq);
                        }
                        
                        typeContainer.appendChild(cardElement);
                    }
                });
                
                allCardsContainer.appendChild(typeContainer);
            }
        });
    },

    // Update battle screen
    updateBattleScreen() {
        Game.updateTotemUI();
        Game.updateMomentumUI();
        Game.updateTimerUI();
        Game.updateHandUI();
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e53e3e' : type === 'success' ? '#38a169' : '#4299e1'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-weight: bold;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    // Show loading screen
    showLoading(message = 'Loading...') {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-size: 1.5em;
            font-weight: bold;
        `;
        
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
    },

    // Hide loading screen
    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    },

    // Show confirmation dialog
    showConfirmation(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
        `;
        
        dialog.innerHTML = `
            <p style="margin-bottom: 20px; font-size: 1.1em;">${message}</p>
            <button id="confirm-yes" style="
                background: #38a169;
                color: white;
                border: none;
                padding: 10px 20px;
                margin: 0 10px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Yes</button>
            <button id="confirm-no" style="
                background: #e53e3e;
                color: white;
                border: none;
                padding: 10px 20px;
                margin: 0 10px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">No</button>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Event listeners
        document.getElementById('confirm-yes').addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });
        
        document.getElementById('confirm-no').addEventListener('click', () => {
            overlay.remove();
            if (onCancel) onCancel();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if (onCancel) onCancel();
            }
        });
    },

    // Handle card play with lane selection
    handleCardPlayWithLaneSelection(cardId) {
        // Create lane selection overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
        `;
        
        dialog.innerHTML = `
            <h3 style="margin-bottom: 20px;">Select Lane</h3>
            <button id="lane-0" style="
                display: block;
                width: 200px;
                margin: 10px auto;
                padding: 15px;
                background: #4299e1;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
            ">Top Lane</button>
            <button id="lane-1" style="
                display: block;
                width: 200px;
                margin: 10px auto;
                padding: 15px;
                background: #4299e1;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
            ">Bottom Lane</button>
            <button id="cancel-play" style="
                display: block;
                width: 200px;
                margin: 20px auto 0;
                padding: 10px;
                background: #e53e3e;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            ">Cancel</button>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Event listeners
        document.getElementById('lane-0').addEventListener('click', () => {
            overlay.remove();
            Game.playCard(cardId, 0);
        });
        
        document.getElementById('lane-1').addEventListener('click', () => {
            overlay.remove();
            Game.playCard(cardId, 1);
        });
        
        document.getElementById('cancel-play').addEventListener('click', () => {
            overlay.remove();
        });
    },

    // Update progress indicators
    updateProgressIndicators() {
        // Update honor points display
        Game.updateHonorDisplay();
        
        // Update arena display
        Game.updateArenaDisplay();
        
        // Check for new unlocks
        this.checkForNewUnlocks();
    },

    // Check for newly unlocked content
    checkForNewUnlocks() {
        const currentUnlocked = Cards.getUnlockedCards(Game.state.honorPoints);
        const previousUnlocked = Game.state.unlockedCards || [];
        
        // Find newly unlocked cards
        const newCards = currentUnlocked.filter(card => 
            !previousUnlocked.some(prev => prev.id === card.id)
        );
        
        // Show notifications for new unlocks
        newCards.forEach(card => {
            this.showNotification(
                `New card unlocked: ${Localization.get(card.nameKey)}!`,
                'success'
            );
        });
        
        // Check for new arena
        const currentArena = Cards.getCurrentArena(Game.state.honorPoints);
        if (Game.state.currentArena && currentArena.id !== Game.state.currentArena.id) {
            this.showNotification(
                `New arena unlocked: ${Localization.get(currentArena.nameKey)}!`,
                'success'
            );
        }
        
        // Update stored unlocked cards
        Game.state.unlockedCards = currentUnlocked;
        Game.state.currentArena = currentArena;
    },

    // Handle responsive design
    handleResize() {
        // Update canvas size
        Game.resizeCanvas();
        
        // Adjust UI elements for mobile
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .card-count-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #f56565;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8em;
        font-weight: bold;
        border: 2px solid white;
    }
    
    .card-type-header {
        color: #4a5568;
        margin: 20px 0 10px 0;
        text-align: center;
        font-size: 1.3em;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 10px;
    }
    
    .card-type-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 15px;
        margin-bottom: 30px;
    }
    
    .unlock-requirement {
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.6em;
        white-space: nowrap;
    }
    
    .locked {
        position: relative;
    }
    
    .locked::after {
        content: '🔒';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Handle window resize
window.addEventListener('resize', () => UI.handleResize());

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}