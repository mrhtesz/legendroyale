# 🏰 Enchanted Realms Battle

A complete, real-time card-based lane battle game inspired by Clash Royale, built entirely with vanilla HTML, CSS, and JavaScript. Features 30 unique cards, 5 magical arenas, strategic AI opponent, and full localization support.

## 🎮 Game Features

### Core Gameplay
- **Real-time battles** with 3-minute time limit
- **Two-lane combat system** with strategic unit deployment  
- **Momentum resource system** (starts at 3, regenerates to max 12)
- **Three Totems per side** - destroy the main Totem to win instantly
- **4-card hand** drawn from customizable 8-card deck

### 30 Unique Cards
**Warriors (12 cards)** - Melee tanks and damage dealers
- Shadow Stalker, Stone Guardian, Blazing Ogre, Iron Knight
- Swift Berserker, Crystal Golem, Void Warrior, Flame Barbarian  
- Ice Troll, Storm Giant, Dragon Slayer, Demon Hunter

**Ranged/Magic (12 cards)** - Long-range damage dealers
- Wind Ranger, Arcane Warden, Ice Huntress, Fire Elemental
- Shadow Archer, Lightning Mage, Frost Witch, Void Sorcerer
- Nature Druid, Star Weaver, Blood Warlock, Spirit Shaman

**Utility/Summoners (6 cards)** - Support and special units
- Sky Engineer, Trap Weaver, Healing Totemist
- Battle Standard, Mystic Portal, Ward Stone

### 5 Enchanted Arenas
1. **Forest Glade** (0 Honor) - Totems regenerate health over time
2. **Frozen Ruins** (20 Honor) - Enemy units move 20% slower  
3. **Lava Chasm** (50 Honor) - All units take burn damage
4. **Sky Citadel** (80 Honor) - Momentum regenerates 25% faster
5. **Shadow Abyss** (120 Honor) - Reduced unit vision range

### Progression System
- **Honor Points** - Earn +3 for wins, lose -1 for defeats
- **Card Unlocks** - New cards unlock at specific Honor milestones
- **Arena Progression** - Access new battlefields as you advance
- **Deck Building** - Customize your 8-card deck from unlocked cards

### Advanced Features
- **Strategic AI opponent** with difficulty scaling
- **Special abilities** - Stealth, lifesteal, burn, freeze, and more
- **Full localization** - English and Turkish language support
- **Responsive design** - Works on desktop and mobile devices
- **localStorage persistence** - Progress saves automatically
- **Keyboard shortcuts** - Quick access to all features

## 🚀 Getting Started

### Quick Start
1. Download all files to a folder
2. Open `index.html` in any modern web browser
3. No server or installation required!

### File Structure
```
enchanted-realms-battle/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── localization.js     # English/Turkish language system
├── cards.js           # 30 card definitions and arena data
├── game.js            # Core game engine and mechanics
├── ai.js              # Strategic AI opponent system
├── ui.js              # User interface and screen management
├── main.js            # Application initialization
└── README.md          # This documentation
```

## 🎯 How to Play

### Basic Controls
- **Click cards** to play them (select lane when prompted)
- **Keyboard shortcuts**: 1-4 to play cards, P for battle, D for deck, C for collection
- **Language toggle** in the main menu

### Battle Strategy
1. **Manage Momentum** - Cards cost Momentum to play (regenerates over time)
2. **Choose lanes wisely** - Deploy units strategically across two lanes
3. **Unit synergy** - Combine different card types for maximum effect
4. **Totem targeting** - Destroy side Totems first, then the main Totem
5. **Special abilities** - Each card has unique powers (stealth, burn, heal, etc.)

### Progression Tips
- Start with 6 basic cards and unlock more by winning battles
- Experiment with different deck combinations
- Higher Honor unlocks powerful cards and new arenas
- Arena passive effects can change your strategy

## 🛠 Technical Implementation

### Architecture
- **Modular design** - Separate systems for cards, game logic, AI, and UI
- **Event-driven** - Clean separation between game state and presentation
- **Performance optimized** - 60 FPS game loop with efficient rendering
- **Error handling** - Comprehensive error catching and user feedback

### Browser Compatibility
- **Modern browsers** - Chrome, Firefox, Safari, Edge (ES6+ required)
- **Mobile responsive** - Touch-friendly interface for phones/tablets
- **No dependencies** - Pure vanilla JavaScript, no frameworks needed

### Data Persistence
- **localStorage** - Automatic saving of Honor Points, unlocked cards, and deck
- **Cross-session** - Progress persists between browser sessions
- **No backend** - Completely client-side implementation

## 🎨 Customization

### Adding New Cards
Edit `cards.js` to add new cards to the `cardData` object:
```javascript
'new-card': {
    id: 'new-card',
    nameKey: 'newCardName',
    descKey: 'newCardDesc', 
    type: 'warrior', // warrior, ranged, utility
    cost: 3,
    hp: 200,
    damage: 75,
    speed: 2.0,
    range: 1,
    special: 'customAbility',
    unlockHonor: 50
}
```

### Adding Translations
Extend the `Localization.strings` object in `localization.js`:
```javascript
// Add new language
fr: {
    gameTitle: "Bataille des Royaumes Enchantés",
    // ... other translations
}
```

### Modifying Game Rules
Key parameters in `game.js`:
- `battleTime: 180` - Battle duration in seconds
- `maxMomentum: 12` - Maximum Momentum capacity
- `momentumRegenRate: 1500` - Milliseconds between Momentum regeneration

## 🎵 Future Enhancements

### Planned Features
- **Sound effects** and background music
- **Particle effects** and enhanced animations  
- **Tournament mode** with bracket progression
- **Card rarity system** with visual distinctions
- **Achievement system** with unlock rewards

### Multiplayer Possibilities
- **WebRTC** peer-to-peer battles
- **WebSocket** server-based matchmaking
- **Spectator mode** for watching battles
- **Replay system** to review past games

## 🐛 Troubleshooting

### Common Issues
- **Cards not showing**: Check browser console for JavaScript errors
- **Progress not saving**: Ensure localStorage is enabled in browser
- **Performance issues**: Close other browser tabs, check for 60 FPS in console
- **Mobile controls**: Use landscape mode for better experience

### Browser Requirements
- **JavaScript enabled** - Required for all functionality
- **localStorage support** - For progress saving
- **Canvas API** - For battle rendering
- **CSS Grid/Flexbox** - For responsive layout

## 📄 License

This project is open source and available under the MIT License. Feel free to modify, distribute, and use for educational purposes.

## 🙏 Acknowledgments

Inspired by Clash Royale's innovative lane-based strategy gameplay. Built as a showcase of modern web development techniques using vanilla JavaScript.

---

**Ready to command your army and conquer the Enchanted Realms? Open `index.html` and begin your journey!** ⚔️✨