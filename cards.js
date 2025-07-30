// Cards System - 30 Unique Cards
const Cards = {
    // All card definitions
    cardData: {
        // WARRIORS (12 cards) - Melee/Tank archetype
        'shadow-stalker': {
            id: 'shadow-stalker',
            nameKey: 'shadowStalker',
            descKey: 'shadowStalkerDesc',
            type: 'warrior',
            cost: 2,
            hp: 150,
            damage: 80,
            speed: 3.5,
            range: 1,
            special: 'stealth', // Invisible for first 2 seconds
            unlockHonor: 0 // Starting card
        },
        'stone-guardian': {
            id: 'stone-guardian',
            nameKey: 'stoneGuardian',
            descKey: 'stoneGuardianDesc',
            type: 'warrior',
            cost: 4,
            hp: 400,
            damage: 60,
            speed: 1.2,
            range: 1,
            special: 'armor', // Takes 50% less damage
            unlockHonor: 0 // Starting card
        },
        'blazing-ogre': {
            id: 'blazing-ogre',
            nameKey: 'blazingOgre',
            descKey: 'blazingOgreDesc',
            type: 'warrior',
            cost: 3,
            hp: 200,
            damage: 70,
            speed: 2.0,
            range: 1.5,
            special: 'splash', // Damages nearby enemies
            unlockHonor: 10
        },
        'iron-knight': {
            id: 'iron-knight',
            nameKey: 'ironKnight',
            descKey: 'ironKnightDesc',
            type: 'warrior',
            cost: 3,
            hp: 250,
            damage: 65,
            speed: 2.2,
            range: 1,
            special: 'shield', // Blocks first attack
            unlockHonor: 15
        },
        'swift-berserker': {
            id: 'swift-berserker',
            nameKey: 'swiftBerserker',
            descKey: 'swiftBerserkerDesc',
            type: 'warrior',
            cost: 2,
            hp: 120,
            damage: 90,
            speed: 4.0,
            range: 1,
            special: 'rage', // Attack speed increases when damaged
            unlockHonor: 25
        },
        'crystal-golem': {
            id: 'crystal-golem',
            nameKey: 'crystalGolem',
            descKey: 'crystalGolemDesc',
            type: 'warrior',
            cost: 5,
            hp: 350,
            damage: 50,
            speed: 1.5,
            range: 1,
            special: 'reflect', // Reflects 30% damage back
            unlockHonor: 35
        },
        'void-warrior': {
            id: 'void-warrior',
            nameKey: 'voidWarrior',
            descKey: 'voidWarriorDesc',
            type: 'warrior',
            cost: 4,
            hp: 180,
            damage: 75,
            speed: 2.5,
            range: 1,
            special: 'lifesteal', // Heals for 25% of damage dealt
            unlockHonor: 45
        },
        'flame-barbarian': {
            id: 'flame-barbarian',
            nameKey: 'flameBarbarian',
            descKey: 'flameBarbarianDesc',
            type: 'warrior',
            cost: 3,
            hp: 160,
            damage: 85,
            speed: 2.8,
            range: 1,
            special: 'burn', // Attacks cause burning damage over time
            unlockHonor: 55
        },
        'ice-troll': {
            id: 'ice-troll',
            nameKey: 'iceTroll',
            descKey: 'iceTrollDesc',
            type: 'warrior',
            cost: 4,
            hp: 280,
            damage: 55,
            speed: 1.8,
            range: 1,
            special: 'slow', // Slows enemy attack and movement speed
            unlockHonor: 65
        },
        'storm-giant': {
            id: 'storm-giant',
            nameKey: 'stormGiant',
            descKey: 'stormGiantDesc',
            type: 'warrior',
            cost: 6,
            hp: 450,
            damage: 100,
            speed: 1.0,
            range: 1.5,
            special: 'chain', // Lightning chains to nearby enemies
            unlockHonor: 75
        },
        'dragon-slayer': {
            id: 'dragon-slayer',
            nameKey: 'dragonSlayer',
            descKey: 'dragonSlayerDesc',
            type: 'warrior',
            cost: 5,
            hp: 220,
            damage: 120,
            speed: 2.3,
            range: 1,
            special: 'giant-killer', // +100% damage vs high HP enemies
            unlockHonor: 90
        },
        'demon-hunter': {
            id: 'demon-hunter',
            nameKey: 'demonHunter',
            descKey: 'demonHunterDesc',
            type: 'warrior',
            cost: 4,
            hp: 200,
            damage: 95,
            speed: 3.0,
            range: 1,
            special: 'purify', // Removes enemy buffs and deals bonus damage
            unlockHonor: 100
        },

        // RANGED/MAGIC (12 cards) - Ranged damage dealers
        'wind-ranger': {
            id: 'wind-ranger',
            nameKey: 'windRanger',
            descKey: 'windRangerDesc',
            type: 'ranged',
            cost: 2,
            hp: 100,
            damage: 60,
            speed: 2.5,
            range: 4,
            special: 'pierce', // Arrows go through first target
            unlockHonor: 0 // Starting card
        },
        'arcane-warden': {
            id: 'arcane-warden',
            nameKey: 'arcaneWarden',
            descKey: 'arcaneWardenDesc',
            type: 'ranged',
            cost: 3,
            hp: 120,
            damage: 50,
            speed: 2.0,
            range: 3.5,
            special: 'splash', // Magic missiles hit multiple targets
            unlockHonor: 0 // Starting card
        },
        'ice-huntress': {
            id: 'ice-huntress',
            nameKey: 'iceHuntress',
            descKey: 'iceHuntressDesc',
            type: 'ranged',
            cost: 3,
            hp: 110,
            damage: 55,
            speed: 2.2,
            range: 3.8,
            special: 'frost', // Slows targets with ice arrows
            unlockHonor: 12
        },
        'fire-elemental': {
            id: 'fire-elemental',
            nameKey: 'fireElemental',
            descKey: 'fireElementalDesc',
            type: 'ranged',
            cost: 4,
            hp: 140,
            damage: 70,
            speed: 1.8,
            range: 3.2,
            special: 'burn', // Fire bolts cause burning
            unlockHonor: 20
        },
        'shadow-archer': {
            id: 'shadow-archer',
            nameKey: 'shadowArcher',
            descKey: 'shadowArcherDesc',
            type: 'ranged',
            cost: 3,
            hp: 90,
            damage: 75,
            speed: 2.8,
            range: 4.2,
            special: 'poison', // Poison arrows deal damage over time
            unlockHonor: 30
        },
        'lightning-mage': {
            id: 'lightning-mage',
            nameKey: 'lightningMage',
            descKey: 'lightningMageDesc',
            type: 'ranged',
            cost: 4,
            hp: 130,
            damage: 80,
            speed: 2.0,
            range: 3.0,
            special: 'chain', // Lightning jumps between enemies
            unlockHonor: 40
        },
        'frost-witch': {
            id: 'frost-witch',
            nameKey: 'frostWitch',
            descKey: 'frostWitchDesc',
            type: 'ranged',
            cost: 5,
            hp: 150,
            damage: 65,
            speed: 1.5,
            range: 3.5,
            special: 'freeze', // Can freeze enemies solid
            unlockHonor: 50
        },
        'void-sorcerer': {
            id: 'void-sorcerer',
            nameKey: 'voidSorcerer',
            descKey: 'voidSorcererDesc',
            type: 'ranged',
            cost: 4,
            hp: 110,
            damage: 85,
            speed: 2.2,
            range: 3.2,
            special: 'drain', // Steals HP from enemies
            unlockHonor: 60
        },
        'nature-druid': {
            id: 'nature-druid',
            nameKey: 'natureDruid',
            descKey: 'natureDruidDesc',
            type: 'ranged',
            cost: 3,
            hp: 160,
            damage: 45,
            speed: 2.0,
            range: 3.0,
            special: 'heal', // Can heal friendly units
            unlockHonor: 70
        },
        'star-weaver': {
            id: 'star-weaver',
            nameKey: 'starWeaver',
            descKey: 'starWeaverDesc',
            type: 'ranged',
            cost: 6,
            hp: 180,
            damage: 100,
            speed: 1.2,
            range: 4.5,
            special: 'cosmic', // Ignores armor and shields
            unlockHonor: 85
        },
        'blood-warlock': {
            id: 'blood-warlock',
            nameKey: 'bloodWarlock',
            descKey: 'bloodWarlockDesc',
            type: 'ranged',
            cost: 5,
            hp: 120,
            damage: 90,
            speed: 1.8,
            range: 3.0,
            special: 'sacrifice', // Damages self to deal massive damage
            unlockHonor: 95
        },
        'spirit-shaman': {
            id: 'spirit-shaman',
            nameKey: 'spiritShaman',
            descKey: 'spiritShamanDesc',
            type: 'ranged',
            cost: 4,
            hp: 100,
            damage: 60,
            speed: 2.5,
            range: 3.5,
            special: 'summon', // Summons ghost minions
            unlockHonor: 110
        },

        // UTILITY/SUMMONERS (6 cards) - Support and special units
        'sky-engineer': {
            id: 'sky-engineer',
            nameKey: 'skyEngineer',
            descKey: 'skyEngineerDesc',
            type: 'utility',
            cost: 4,
            hp: 200,
            damage: 70,
            speed: 0, // Stationary
            range: 5,
            special: 'turret', // Stationary but long range
            unlockHonor: 0 // Starting card
        },
        'trap-weaver': {
            id: 'trap-weaver',
            nameKey: 'trapWeaver',
            descKey: 'trapWeaverDesc',
            type: 'utility',
            cost: 3,
            hp: 80,
            damage: 0,
            speed: 3.0,
            range: 1,
            special: 'trap', // Places invisible traps
            unlockHonor: 18
        },
        'healing-totemist': {
            id: 'healing-totemist',
            nameKey: 'healingTotemist',
            descKey: 'healingTotemistDesc',
            type: 'utility',
            cost: 3,
            hp: 150,
            damage: 0,
            speed: 0, // Stationary
            range: 2.5,
            special: 'heal', // Heals nearby allies
            unlockHonor: 28
        },
        'battle-standard': {
            id: 'battle-standard',
            nameKey: 'battleStandard',
            descKey: 'battleStandardDesc',
            type: 'utility',
            cost: 2,
            hp: 100,
            damage: 0,
            speed: 0, // Stationary
            range: 2,
            special: 'buff', // Increases nearby ally damage
            unlockHonor: 42
        },
        'mystic-portal': {
            id: 'mystic-portal',
            nameKey: 'mysticPortal',
            descKey: 'mysticPortalDesc',
            type: 'utility',
            cost: 5,
            hp: 120,
            damage: 0,
            speed: 0, // Stationary
            range: 6,
            special: 'teleport', // Teleports units across battlefield
            unlockHonor: 80
        },
        'ward-stone': {
            id: 'ward-stone',
            nameKey: 'wardStone',
            descKey: 'wardStoneDesc',
            type: 'utility',
            cost: 4,
            hp: 300,
            damage: 0,
            speed: 0, // Stationary
            range: 3,
            special: 'shield', // Creates protective barrier
            unlockHonor: 120
        }
    },

    // Arena definitions with passive abilities
    arenas: {
        'forest-glade': {
            id: 'forest-glade',
            nameKey: 'forestGlade',
            unlockHonor: 0,
            background: 'arena-forest',
            passive: 'regeneration', // Totems slowly heal over time
            passiveValue: 2 // HP per second
        },
        'frozen-ruins': {
            id: 'frozen-ruins',
            nameKey: 'frozenRuins',
            unlockHonor: 20,
            background: 'arena-frozen',
            passive: 'slow', // Enemy units move 20% slower
            passiveValue: 0.8 // Speed multiplier
        },
        'lava-chasm': {
            id: 'lava-chasm',
            nameKey: 'lavaChasm',
            unlockHonor: 50,
            background: 'arena-lava',
            passive: 'burn', // All units take burn damage over time
            passiveValue: 5 // Damage per second
        },
        'sky-citadel': {
            id: 'sky-citadel',
            nameKey: 'skyCitadel',
            unlockHonor: 80,
            background: 'arena-sky',
            passive: 'momentum', // Momentum regenerates 25% faster
            passiveValue: 1.25 // Regeneration multiplier
        },
        'shadow-abyss': {
            id: 'shadow-abyss',
            nameKey: 'shadowAbyss',
            unlockHonor: 120,
            background: 'arena-shadow',
            passive: 'darkness', // All units have reduced vision range
            passiveValue: 0.7 // Vision multiplier
        }
    },

    // Get card by ID
    getCard(cardId) {
        return this.cardData[cardId];
    },

    // Get all cards
    getAllCards() {
        return Object.values(this.cardData);
    },

    // Get cards by type
    getCardsByType(type) {
        return Object.values(this.cardData).filter(card => card.type === type);
    },

    // Get unlocked cards based on honor points
    getUnlockedCards(honorPoints) {
        return Object.values(this.cardData).filter(card => card.unlockHonor <= honorPoints);
    },

    // Get starting deck (6 basic cards)
    getStartingDeck() {
        return [
            'shadow-stalker',
            'stone-guardian', 
            'wind-ranger',
            'arcane-warden',
            'sky-engineer',
            'shadow-stalker' // Duplicate for 8-card deck
        ].concat(['wind-ranger', 'stone-guardian']); // Fill to 8 cards
    },

    // Get current arena based on honor points
    getCurrentArena(honorPoints) {
        const arenas = Object.values(this.arenas).sort((a, b) => b.unlockHonor - a.unlockHonor);
        return arenas.find(arena => arena.unlockHonor <= honorPoints) || this.arenas['forest-glade'];
    },

    // Get unlocked arenas
    getUnlockedArenas(honorPoints) {
        return Object.values(this.arenas).filter(arena => arena.unlockHonor <= honorPoints);
    },

    // Create card element for UI
    createCardElement(cardId, isInHand = false) {
        const card = this.getCard(cardId);
        if (!card) return null;

        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.type}`;
        cardElement.dataset.cardId = cardId;

        if (isInHand) {
            cardElement.classList.add('hand-card');
        }

        cardElement.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-type">${Localization.get(card.type)}</div>
            <div class="card-name">${Localization.get(card.nameKey)}</div>
            <div class="card-stats">
                <div>${Localization.get('hp')}: ${card.hp}</div>
                <div>${Localization.get('damage')}: ${card.damage}</div>
                <div>${Localization.get('speed')}: ${card.speed}</div>
                <div>${Localization.get('range')}: ${card.range}</div>
            </div>
        `;

        // Add tooltip with description
        cardElement.title = Localization.get(card.descKey);

        return cardElement;
    },

    // Validate deck (must be exactly 8 cards)
    validateDeck(deck) {
        return Array.isArray(deck) && deck.length === 8 && 
               deck.every(cardId => this.cardData[cardId]);
    },

    // Get random card for AI
    getRandomCard(availableCards = null) {
        const cards = availableCards || Object.keys(this.cardData);
        return cards[Math.floor(Math.random() * cards.length)];
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Cards;
}