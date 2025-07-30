// Localization System
const Localization = {
    currentLanguage: 'en',
    
    strings: {
        en: {
            // Menu Screen
            gameTitle: "Enchanted Realms Battle",
            honorPoints: "Honor Points",
            currentArena: "Current Arena",
            playBattle: "Play Battle",
            deckBuilder: "Deck Builder",
            cardCollection: "Card Collection",
            language: "Language",
            
            // Deck Builder
            deckTitle: "Deck Builder",
            currentDeck: "Current Deck",
            availableCards: "Available Cards",
            backToMenu: "Back to Menu",
            
            // Card Collection
            collectionTitle: "Card Collection",
            
            // Battle Screen
            victory: "Victory!",
            defeat: "Defeat!",
            battleResult: "Battle Result",
            continue: "Continue",
            honorGained: "Honor Gained: +",
            honorLost: "Honor Lost: -",
            
            // Arenas
            forestGlade: "Forest Glade",
            frozenRuins: "Frozen Ruins",
            lavaChasm: "Lava Chasm",
            skyCitadel: "Sky Citadel",
            shadowAbyss: "Shadow Abyss",
            
            // Card Names - Warriors
            shadowStalker: "Shadow Stalker",
            stoneGuardian: "Stone Guardian",
            blazingOgre: "Blazing Ogre",
            ironKnight: "Iron Knight",
            swiftBerserker: "Swift Berserker",
            crystalGolem: "Crystal Golem",
            voidWarrior: "Void Warrior",
            flameBarbarian: "Flame Barbarian",
            iceTroll: "Ice Troll",
            stormGiant: "Storm Giant",
            dragonSlayer: "Dragon Slayer",
            demonHunter: "Demon Hunter",
            
            // Card Names - Ranged/Magic
            windRanger: "Wind Ranger",
            arcaneWarden: "Arcane Warden",
            iceHuntress: "Ice Huntress",
            fireElemental: "Fire Elemental",
            shadowArcher: "Shadow Archer",
            lightningMage: "Lightning Mage",
            frostWitch: "Frost Witch",
            voidSorcerer: "Void Sorcerer",
            natureDruid: "Nature Druid",
            starWeaver: "Star Weaver",
            bloodWarlock: "Blood Warlock",
            spiritShaman: "Spirit Shaman",
            
            // Card Names - Utility/Summoners
            skyEngineer: "Sky Engineer",
            trapWeaver: "Trap Weaver",
            healingTotemist: "Healing Totemist",
            battleStandard: "Battle Standard",
            mysticPortal: "Mystic Portal",
            wardStone: "Ward Stone",
            
            // Card Descriptions
            shadowStalkerDesc: "Fast assassin that strikes from the shadows",
            stoneGuardianDesc: "Slow but mighty tank with high defense",
            blazingOgreDesc: "AoE melee fighter with burning attacks",
            ironKnightDesc: "Balanced warrior with shield protection",
            swiftBerserkerDesc: "Quick attacker with rage ability",
            crystalGolemDesc: "Magical tank that reflects damage",
            voidWarriorDesc: "Dark warrior that drains enemy life",
            flameBarbarianDesc: "Fire warrior with explosive attacks",
            iceTrollDesc: "Frost warrior that slows enemies",
            stormGiantDesc: "Lightning warrior with chain attacks",
            dragonSlayerDesc: "Elite warrior effective vs large units",
            demonHunterDesc: "Holy warrior with purification attacks",
            
            windRangerDesc: "Long-range archer with piercing shots",
            arcaneWardenDesc: "Splash damage mage with magic missiles",
            iceHuntressDesc: "Frost archer that slows targets",
            fireElementalDesc: "Burning ranged unit with fire bolts",
            shadowArcherDesc: "Stealth archer with poison arrows",
            lightningMageDesc: "Electric mage with chain lightning",
            frostWitchDesc: "Ice mage with freezing spells",
            voidSorcererDesc: "Dark mage with life drain magic",
            natureDruidDesc: "Nature mage with healing abilities",
            starWeaverDesc: "Cosmic mage with stellar magic",
            bloodWarlockDesc: "Blood mage with sacrifice spells",
            spiritShamanDesc: "Spirit mage with ghostly summons",
            
            skyEngineerDesc: "Stationary turret with long range",
            trapWeaverDesc: "Places invisible traps on the field",
            healingTotemistDesc: "Healing ward that restores HP",
            battleStandardDesc: "Banner that boosts nearby allies",
            mysticPortalDesc: "Portal that teleports units",
            wardStoneDesc: "Protective barrier for your totems",
            
            // Card Types
            warrior: "Warrior",
            ranged: "Ranged",
            utility: "Utility",
            
            // Stats
            cost: "Cost",
            hp: "HP",
            damage: "DMG",
            speed: "SPD",
            range: "RNG"
        },
        
        tr: {
            // Menu Screen
            gameTitle: "Büyülü Diyarlar Savaşı",
            honorPoints: "Onur Puanları",
            currentArena: "Mevcut Arena",
            playBattle: "Savaşa Başla",
            deckBuilder: "Deste Oluşturucu",
            cardCollection: "Kart Koleksiyonu",
            language: "Dil",
            
            // Deck Builder
            deckTitle: "Deste Oluşturucu",
            currentDeck: "Mevcut Deste",
            availableCards: "Mevcut Kartlar",
            backToMenu: "Ana Menüye Dön",
            
            // Card Collection
            collectionTitle: "Kart Koleksiyonu",
            
            // Battle Screen
            victory: "Zafer!",
            defeat: "Yenilgi!",
            battleResult: "Savaş Sonucu",
            continue: "Devam Et",
            honorGained: "Kazanılan Onur: +",
            honorLost: "Kaybedilen Onur: -",
            
            // Arenas
            forestGlade: "Orman Açıklığı",
            frozenRuins: "Donmuş Harabe",
            lavaChasm: "Lav Uçurumu",
            skyCitadel: "Gökyüzü Kalesi",
            shadowAbyss: "Gölge Uçurumu",
            
            // Card Names - Warriors
            shadowStalker: "Gölge Avcısı",
            stoneGuardian: "Taş Koruyucu",
            blazingOgre: "Alevli Ogr",
            ironKnight: "Demir Şövalye",
            swiftBerserker: "Çevik Berserker",
            crystalGolem: "Kristal Golem",
            voidWarrior: "Boşluk Savaşçısı",
            flameBarbarian: "Alev Barbarian",
            iceTroll: "Buz Trol",
            stormGiant: "Fırtına Devi",
            dragonSlayer: "Ejder Avcısı",
            demonHunter: "İblis Avcısı",
            
            // Card Names - Ranged/Magic
            windRanger: "Rüzgar Avcısı",
            arcaneWarden: "Büyülü Bekçi",
            iceHuntress: "Buz Avcısı",
            fireElemental: "Ateş Elementi",
            shadowArcher: "Gölge Okçusu",
            lightningMage: "Şimşek Büyücüsü",
            frostWitch: "Buz Cadısı",
            voidSorcerer: "Boşluk Büyücüsü",
            natureDruid: "Doğa Druidi",
            starWeaver: "Yıldız Dokuyucu",
            bloodWarlock: "Kan Büyücüsü",
            spiritShaman: "Ruh Şamanı",
            
            // Card Names - Utility/Summoners
            skyEngineer: "Gökyüzü Mühendisi",
            trapWeaver: "Tuzak Dokuyucu",
            healingTotemist: "Şifa Totemcisi",
            battleStandard: "Savaş Sancağı",
            mysticPortal: "Mistik Portal",
            wardStone: "Koruma Taşı",
            
            // Card Descriptions
            shadowStalkerDesc: "Gölgelerden saldıran hızlı suikastçı",
            stoneGuardianDesc: "Yavaş ama güçlü, yüksek savunmalı tank",
            blazingOgreDesc: "Yakıcı saldırılarla alan hasarı veren savaşçı",
            ironKnightDesc: "Kalkan koruması olan dengeli savaşçı",
            swiftBerserkerDesc: "Öfke yetisi olan hızlı saldırgan",
            crystalGolemDesc: "Hasarı yansıtan büyülü tank",
            voidWarriorDesc: "Düşman canını emen karanlık savaşçı",
            flameBarbarianDesc: "Patlayıcı saldırıları olan ateş savaşçısı",
            iceTrollDesc: "Düşmanları yavaşlatan buz savaşçısı",
            stormGiantDesc: "Zincir saldırıları olan şimşek savaşçısı",
            dragonSlayerDesc: "Büyük birimlere karşı etkili elit savaşçı",
            demonHunterDesc: "Arındırma saldırıları olan kutsal savaşçı",
            
            windRangerDesc: "Delici okları olan uzun menzilli okçu",
            arcaneWardenDesc: "Büyü füzeleri olan alan hasarı büyücüsü",
            iceHuntressDesc: "Hedefleri yavaşlatan buz okçusu",
            fireElementalDesc: "Ateş oklarıyla yanan uzak birim",
            shadowArcherDesc: "Zehirli okları olan gizli okçu",
            lightningMageDesc: "Zincir şimşeği olan elektrik büyücüsü",
            frostWitchDesc: "Dondurucu büyüleri olan buz büyücüsü",
            voidSorcererDesc: "Can emme büyüsü olan karanlık büyücü",
            natureDruidDesc: "Şifa yetenekleri olan doğa büyücüsü",
            starWeaverDesc: "Yıldız büyüsü olan kozmik büyücü",
            bloodWarlockDesc: "Kurban büyüleri olan kan büyücüsü",
            spiritShamanDesc: "Hayalet çağırma olan ruh büyücüsü",
            
            skyEngineerDesc: "Uzun menzilli sabit taret",
            trapWeaverDesc: "Sahaya görünmez tuzaklar kurar",
            healingTotemistDesc: "Can yenileyen şifa totemi",
            battleStandardDesc: "Yakındaki müttefikleri güçlendiren sancak",
            mysticPortalDesc: "Birimleri ışınlayan portal",
            wardStoneDesc: "Totemleriniz için koruyucu bariyer",
            
            // Card Types
            warrior: "Savaşçı",
            ranged: "Uzak",
            utility: "Destek",
            
            // Stats
            cost: "Maliyet",
            hp: "Can",
            damage: "Hasar",
            speed: "Hız",
            range: "Menzil"
        }
    },
    
    // Get localized string
    get(key) {
        return this.strings[this.currentLanguage][key] || this.strings.en[key] || key;
    },
    
    // Set language
    setLanguage(lang) {
        if (this.strings[lang]) {
            this.currentLanguage = lang;
            this.updateUI();
            localStorage.setItem('gameLanguage', lang);
        }
    },
    
    // Update all UI elements with current language
    updateUI() {
        const elements = document.querySelectorAll('[id]');
        elements.forEach(element => {
            const key = this.getKeyFromId(element.id);
            if (key && this.strings[this.currentLanguage][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                    element.value = this.get(key);
                } else {
                    element.textContent = this.get(key);
                }
            }
        });
    },
    
    // Convert element ID to localization key
    getKeyFromId(id) {
        const keyMap = {
            'game-title': 'gameTitle',
            'honor-label': 'honorPoints',
            'current-arena-label': 'currentArena',
            'play-button': 'playBattle',
            'deck-button': 'deckBuilder',
            'cards-button': 'cardCollection',
            'language-label': 'language',
            'deck-title': 'deckTitle',
            'current-deck-label': 'currentDeck',
            'available-cards-label': 'availableCards',
            'back-to-menu': 'backToMenu',
            'back-to-menu-2': 'backToMenu',
            'collection-title': 'collectionTitle',
            'result-title': 'battleResult',
            'continue-button': 'continue'
        };
        return keyMap[id];
    },
    
    // Initialize localization
    init() {
        const savedLang = localStorage.getItem('gameLanguage');
        if (savedLang && this.strings[savedLang]) {
            this.currentLanguage = savedLang;
        }
        
        // Set language selector
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = this.currentLanguage;
            langSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
        
        this.updateUI();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Localization;
}