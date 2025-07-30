// Main Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
    console.log('Enchanted Realms Battle - Starting initialization...');
    
    // Initialize all systems in order
    initializeGame();
});

// Initialize the complete game system
async function initializeGame() {
    try {
        // Show loading screen
        showInitialLoading();
        
        // Initialize localization first
        await initializeLocalization();
        
        // Initialize core systems
        await initializeCoreSystem();
        
        // Initialize UI
        await initializeUserInterface();
        
        // Initialize game engine
        await initializeGameEngine();
        
        // Initialize AI system
        await initializeAI();
        
        // Final setup
        await finalizeInitialization();
        
        // Hide loading and show game
        hideInitialLoading();
        
        console.log('Game initialization complete!');
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showErrorMessage('Failed to load game. Please refresh the page.');
    }
}

// Show initial loading screen
function showInitialLoading() {
    const loadingHTML = `
        <div id="initial-loading" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
        ">
            <div style="text-align: center;">
                <h1 style="font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    ⚔️ Enchanted Realms Battle ⚔️
                </h1>
                <div class="loading-spinner" style="
                    width: 60px;
                    height: 60px;
                    border: 6px solid rgba(255, 255, 255, 0.3);
                    border-top: 6px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                "></div>
                <p style="font-size: 1.2em; margin-top: 20px;">Loading magical cards and arenas...</p>
                <div id="loading-progress" style="
                    width: 300px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                    margin: 20px auto;
                    overflow: hidden;
                ">
                    <div id="progress-bar" style="
                        width: 0%;
                        height: 100%;
                        background: white;
                        border-radius: 3px;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <p id="loading-text" style="font-size: 1em; opacity: 0.8;">Initializing...</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

// Update loading progress
function updateLoadingProgress(percent, text) {
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
    
    if (loadingText && text) {
        loadingText.textContent = text;
    }
}

// Hide initial loading screen
function hideInitialLoading() {
    const loadingScreen = document.getElementById('initial-loading');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
}

// Initialize localization system
async function initializeLocalization() {
    updateLoadingProgress(10, 'Loading languages...');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            Localization.init();
            resolve();
        }, 100);
    });
}

// Initialize core systems
async function initializeCoreSystem() {
    updateLoadingProgress(25, 'Loading card database...');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Cards system is already loaded as it's in a separate file
            // Verify all cards are properly loaded
            const cardCount = Cards.getAllCards().length;
            console.log(`Loaded ${cardCount} cards`);
            
            if (cardCount !== 30) {
                throw new Error(`Expected 30 cards, but loaded ${cardCount}`);
            }
            
            resolve();
        }, 200);
    });
}

// Initialize user interface
async function initializeUserInterface() {
    updateLoadingProgress(50, 'Setting up user interface...');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            UI.init();
            
            // Setup responsive design
            UI.handleResize();
            
            resolve();
        }, 300);
    });
}

// Initialize game engine
async function initializeGameEngine() {
    updateLoadingProgress(75, 'Initializing game engine...');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            Game.init();
            resolve();
        }, 200);
    });
}

// Initialize AI system
async function initializeAI() {
    updateLoadingProgress(90, 'Training AI opponent...');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            AI.init();
            resolve();
        }, 300);
    });
}

// Finalize initialization
async function finalizeInitialization() {
    updateLoadingProgress(100, 'Ready to battle!');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Setup global error handling
            setupErrorHandling();
            
            // Setup performance monitoring
            setupPerformanceMonitoring();
            
            // Setup keyboard shortcuts
            setupKeyboardShortcuts();
            
            // Check for saved game data and show welcome message
            checkFirstTimePlayer();
            
            resolve();
        }, 500);
    });
}

// Setup global error handling
function setupErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        
        // Don't show error to user for minor issues
        if (event.error && event.error.message && 
            !event.error.message.includes('Script error') &&
            !event.error.message.includes('Non-Error promise rejection')) {
            
            UI.showNotification('An error occurred. The game will continue.', 'error');
        }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });
}

// Setup performance monitoring
function setupPerformanceMonitoring() {
    // Monitor frame rate during battles
    let frameCount = 0;
    let lastFPSCheck = performance.now();
    
    function checkFPS() {
        frameCount++;
        const now = performance.now();
        
        if (now - lastFPSCheck >= 5000) { // Check every 5 seconds
            const fps = Math.round((frameCount * 1000) / (now - lastFPSCheck));
            
            if (fps < 30 && Game.state.isPlaying) {
                console.warn(`Low FPS detected: ${fps}`);
            }
            
            frameCount = 0;
            lastFPSCheck = now;
        }
        
        if (Game.state.isPlaying) {
            requestAnimationFrame(checkFPS);
        }
    }
    
    // Start monitoring when battle begins
    const originalStartBattle = Game.startBattle;
    Game.startBattle = function() {
        originalStartBattle.call(this);
        requestAnimationFrame(checkFPS);
    };
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Only handle shortcuts when not in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (event.key) {
            case 'Escape':
                // Go back to menu from any screen
                if (UI.currentScreen !== 'menu' && UI.currentScreen !== 'battle') {
                    UI.showScreen('menu');
                    event.preventDefault();
                }
                break;
                
            case '1':
            case '2':
            case '3':
            case '4':
                // Play cards 1-4 during battle
                if (UI.currentScreen === 'battle' && Game.state.isPlaying) {
                    const cardIndex = parseInt(event.key) - 1;
                    if (cardIndex < Game.state.hand.length) {
                        const cardId = Game.state.hand[cardIndex];
                        UI.handleCardPlayWithLaneSelection(cardId);
                        event.preventDefault();
                    }
                }
                break;
                
            case 'p':
            case 'P':
                // Quick play battle
                if (UI.currentScreen === 'menu') {
                    UI.startBattle();
                    event.preventDefault();
                }
                break;
                
            case 'd':
            case 'D':
                // Quick deck builder
                if (UI.currentScreen === 'menu') {
                    UI.showDeckBuilder();
                    event.preventDefault();
                }
                break;
                
            case 'c':
            case 'C':
                // Quick card collection
                if (UI.currentScreen === 'menu') {
                    UI.showCardCollection();
                    event.preventDefault();
                }
                break;
        }
    });
}

// Check if this is a first-time player
function checkFirstTimePlayer() {
    const savedData = localStorage.getItem('enchantedRealmsData');
    
    if (!savedData) {
        // First time player - show welcome message
        setTimeout(() => {
            showWelcomeMessage();
        }, 1000);
    } else {
        // Returning player - show quick tips
        const data = JSON.parse(savedData);
        if (data.honorPoints > 0) {
            setTimeout(() => {
                UI.showNotification(`Welcome back! You have ${data.honorPoints} Honor Points.`, 'info');
            }, 1000);
        }
    }
}

// Show welcome message for new players
function showWelcomeMessage() {
    const welcomeHTML = `
        <div id="welcome-overlay" style="
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
            animation: fadeIn 0.5s ease;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                max-width: 500px;
                margin: 20px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <h2 style="color: #4a5568; margin-bottom: 20px;">Welcome to Enchanted Realms Battle!</h2>
                <p style="margin-bottom: 15px; line-height: 1.6;">
                    🎮 Deploy units by playing cards<br>
                    ⚡ Manage your Momentum wisely<br>
                    🏰 Destroy the enemy's main Totem to win<br>
                    🏆 Earn Honor Points to unlock new cards and arenas
                </p>
                <p style="margin-bottom: 25px; font-weight: bold; color: #667eea;">
                    You start with 6 basic cards. Good luck, commander!
                </p>
                <button id="welcome-start" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" 
                   onmouseout="this.style.transform='translateY(0)'">
                    Start Your Journey!
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', welcomeHTML);
    
    document.getElementById('welcome-start').addEventListener('click', () => {
        const overlay = document.getElementById('welcome-overlay');
        overlay.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            overlay.remove();
        }, 500);
    });
}

// Show error message
function showErrorMessage(message) {
    const errorHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #e53e3e;
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        ">
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #e53e3e;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 15px;
            ">Reload Game</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHTML);
}

// Add fade animations to CSS
const fadeAnimations = document.createElement('style');
fadeAnimations.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeAnimations);

// Export initialization function for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeGame };
}

console.log('Main application script loaded - waiting for DOM...');