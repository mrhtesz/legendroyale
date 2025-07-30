// Entity Management System for Cosmic Defender

// Entity base class
class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
        this.id = Math.random().toString(36).substr(2, 9);
    }
    
    update(deltaTime) {
        // Override in subclasses
    }
    
    render(ctx) {
        // Override in subclasses
    }
    
    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2
        };
    }
    
    isColliding(other) {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();
        
        return bounds1.left < bounds2.right &&
               bounds1.right > bounds2.left &&
               bounds1.top < bounds2.bottom &&
               bounds1.bottom > bounds2.top;
    }
}

// Player entity
class Player extends Entity {
    constructor(x, y) {
        super(x, y, 40, 30);
        this.speed = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.shootCooldown = 0;
        this.shootRate = 250;
        this.color = '#00ff00';
        this.trail = [];
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
    }
    
    update(deltaTime) {
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        if (this.invulnerable) {
            this.invulnerabilityTime -= deltaTime;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Update trail
        this.trail.push({ x: this.x, y: this.y, time: Date.now() });
        this.trail = this.trail.filter(point => Date.now() - point.time < 200);
    }
    
    takeDamage(amount) {
        if (this.invulnerable) return false;
        
        this.health -= amount;
        this.health = Math.max(0, this.health);
        
        // Brief invulnerability after taking damage
        this.invulnerable = true;
        this.invulnerabilityTime = 1000; // 1 second
        
        return true;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    canShoot() {
        return this.shootCooldown <= 0;
    }
    
    shoot() {
        if (!this.canShoot()) return null;
        
        this.shootCooldown = this.shootRate;
        return new Bullet(this.x, this.y - 15, 0, -8, '#00ff00', 'player');
    }
    
    render(ctx) {
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = (i / this.trail.length) * 0.5;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
        }
        ctx.restore();
        
        // Draw player ship
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Flicker if invulnerable
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(-10, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(10, 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

// Bullet entity
class Bullet extends Entity {
    constructor(x, y, vx, vy, color = '#00ff00', owner = 'player') {
        super(x, y, 4, 8);
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.owner = owner;
        this.damage = 25;
        this.trail = [];
        this.speed = Math.sqrt(vx * vx + vy * vy);
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        
        // Add to trail
        this.trail.push({ x: this.x, y: this.y, time: Date.now() });
        this.trail = this.trail.filter(point => Date.now() - point.time < 100);
        
        // Deactivate if off-screen
        if (this.y < -10 || this.y > 610 || this.x < -10 || this.x > 810) {
            this.active = false;
        }
    }
    
    render(ctx) {
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = (i / this.trail.length) * 0.8;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
        }
        ctx.restore();
        
        // Draw bullet
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
}

// Enemy entity
class Enemy extends Entity {
    constructor(x, y, type = 'basic') {
        super(x, y, 30, 30);
        
        this.type = type;
        this.setupType();
        
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = this.baseSpeed;
        this.trail = [];
        this.lastShot = 0;
        this.shootRate = 2000;
        this.points = this.basePoints;
        
        // AI behavior
        this.behaviorTimer = 0;
        this.behaviorDuration = 2000 + Math.random() * 3000;
    }
    
    setupType() {
        const types = {
            basic: {
                health: 50,
                speed: 2,
                points: 100,
                color: '#ff4444'
            },
            fast: {
                health: 30,
                speed: 4,
                points: 150,
                color: '#ffff44'
            },
            tank: {
                health: 100,
                speed: 1,
                points: 200,
                color: '#ff8844'
            },
            shooter: {
                health: 40,
                speed: 1.5,
                points: 180,
                color: '#ff44ff'
            },
            zigzag: {
                health: 60,
                speed: 2.5,
                points: 160,
                color: '#44ffff'
            }
        };
        
        const typeData = types[this.type] || types.basic;
        this.health = typeData.health;
        this.maxHealth = typeData.health;
        this.baseSpeed = typeData.speed;
        this.basePoints = typeData.points;
        this.color = typeData.color;
    }
    
    update(deltaTime, player) {
        this.behaviorTimer += deltaTime;
        
        // Update movement based on type
        switch (this.type) {
            case 'zigzag':
                this.vx = Math.sin(this.behaviorTimer * 0.005) * 3;
                break;
            case 'fast':
                // Occasional speed bursts
                if (this.behaviorTimer > this.behaviorDuration) {
                    this.vy = this.baseSpeed * (1.5 + Math.random());
                    this.behaviorTimer = 0;
                    this.behaviorDuration = 1000 + Math.random() * 2000;
                }
                break;
            case 'tank':
                // Slow but steady, occasionally charges
                if (this.behaviorTimer > this.behaviorDuration) {
                    this.vy = this.baseSpeed * 3;
                    this.behaviorTimer = 0;
                    this.behaviorDuration = 5000 + Math.random() * 3000;
                }
                break;
        }
        
        // Move enemy
        this.x += this.vx;
        this.y += this.vy;
        
        // Keep in horizontal bounds
        if (this.x <= 15 || this.x >= 785) {
            this.vx *= -1;
        }
        
        // Shooting behavior for shooter type
        if (this.type === 'shooter' && player) {
            this.updateShooting(player);
        }
        
        // Update trail
        this.trail.push({ x: this.x, y: this.y, time: Date.now() });
        this.trail = this.trail.filter(point => Date.now() - point.time < 150);
        
        // Deactivate if off-screen (bottom)
        if (this.y > 650) {
            this.active = false;
        }
    }
    
    updateShooting(player) {
        const now = Date.now();
        if (now - this.lastShot < this.shootRate) return;
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
            const speed = 3;
            const bullet = new Bullet(
                this.x,
                this.y + 15,
                (dx / distance) * speed,
                (dy / distance) * speed,
                '#ff0000',
                'enemy'
            );
            
            this.lastShot = now;
            return bullet;
        }
        
        return null;
    }
    
    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
    
    render(ctx) {
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = (i / this.trail.length) * 0.3;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
        }
        ctx.restore();
        
        // Draw enemy
        ctx.fillStyle = this.color;
        
        // Different shapes for different types
        switch (this.type) {
            case 'basic':
                ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
                break;
            case 'fast':
                // Triangle
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - 15);
                ctx.lineTo(this.x - 15, this.y + 15);
                ctx.lineTo(this.x + 15, this.y + 15);
                ctx.closePath();
                ctx.fill();
                break;
            case 'tank':
                // Larger rectangle
                ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
                break;
            case 'shooter':
                // Diamond
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - 15);
                ctx.lineTo(this.x + 15, this.y);
                ctx.lineTo(this.x, this.y + 15);
                ctx.lineTo(this.x - 15, this.y);
                ctx.closePath();
                ctx.fill();
                break;
            case 'zigzag':
                // Hexagon
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    const px = this.x + Math.cos(angle) * 15;
                    const py = this.y + Math.sin(angle) * 15;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                break;
        }
        
        // Draw health bar
        if (this.health < this.maxHealth) {
            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - 15, this.y - 25, 30, 3);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x - 15, this.y - 25, 30 * healthPercent, 3);
        }
    }
}

// PowerUp entity
class PowerUp extends Entity {
    constructor(x, y, type) {
        super(x, y, 25, 25);
        this.type = type;
        this.setupType();
        this.speed = 2;
        this.rotation = 0;
        this.rotationSpeed = 0.1;
        this.pulseTime = 0;
    }
    
    setupType() {
        const types = {
            rapidFire: {
                icon: '🔥',
                color: '#ff4400',
                duration: 10000
            },
            multiShot: {
                icon: '💥',
                color: '#ff8800',
                duration: 8000
            },
            shield: {
                icon: '🛡️',
                color: '#0088ff',
                duration: 5000
            },
            health: {
                icon: '❤️',
                color: '#ff0088',
                duration: 0 // Instant effect
            },
            speedBoost: {
                icon: '⚡',
                color: '#ffff00',
                duration: 7000
            },
            piercing: {
                icon: '🎯',
                color: '#00ff88',
                duration: 6000
            }
        };
        
        const typeData = types[this.type] || types.health;
        this.icon = typeData.icon;
        this.color = typeData.color;
        this.duration = typeData.duration;
    }
    
    update(deltaTime) {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        this.pulseTime += deltaTime;
        
        // Deactivate if off-screen
        if (this.y > 620) {
            this.active = false;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Pulsing glow effect
        const pulseScale = 1 + Math.sin(this.pulseTime * 0.005) * 0.2;
        ctx.scale(pulseScale, pulseScale);
        
        // Draw glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Draw icon
        ctx.shadowBlur = 0;
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.icon, 0, 5);
        
        ctx.restore();
    }
    
    applyEffect(player) {
        switch (this.type) {
            case 'health':
                player.heal(30);
                return null; // No lasting effect
            case 'rapidFire':
                return { type: 'rapidFire', duration: this.duration, effect: () => {
                    player.shootRate = 100; // Much faster shooting
                }};
            case 'multiShot':
                return { type: 'multiShot', duration: this.duration };
            case 'shield':
                return { type: 'shield', duration: this.duration, effect: () => {
                    player.invulnerable = true;
                }};
            case 'speedBoost':
                return { type: 'speedBoost', duration: this.duration, effect: () => {
                    player.speed = 8; // Increased speed
                }};
            case 'piercing':
                return { type: 'piercing', duration: this.duration };
        }
        return null;
    }
}

// Particle entity for visual effects
class Particle extends Entity {
    constructor(x, y, vx, vy, color, size, life) {
        super(x, y, size, size);
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.life = life;
        this.maxLife = life;
        this.opacity = 1;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= deltaTime;
        this.opacity = this.life / this.maxLife;
        
        // Add gravity to some particles
        this.vy += 0.1;
        
        if (this.life <= 0) {
            this.active = false;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.restore();
    }
}

// Entity Manager
class EntityManager {
    constructor() {
        this.entities = new Map();
        this.entityTypes = new Map();
    }
    
    addEntity(entity, type = 'default') {
        this.entities.set(entity.id, entity);
        
        if (!this.entityTypes.has(type)) {
            this.entityTypes.set(type, new Set());
        }
        this.entityTypes.get(type).add(entity.id);
    }
    
    removeEntity(entityId) {
        const entity = this.entities.get(entityId);
        if (entity) {
            this.entities.delete(entityId);
            
            // Remove from type collections
            for (const [type, ids] of this.entityTypes) {
                ids.delete(entityId);
            }
        }
    }
    
    getEntitiesByType(type) {
        const ids = this.entityTypes.get(type);
        if (!ids) return [];
        
        return Array.from(ids).map(id => this.entities.get(id)).filter(entity => entity);
    }
    
    getAllEntities() {
        return Array.from(this.entities.values());
    }
    
    update(deltaTime, ...args) {
        for (const entity of this.entities.values()) {
            if (entity.active) {
                entity.update(deltaTime, ...args);
            }
        }
        
        // Remove inactive entities
        const toRemove = [];
        for (const [id, entity] of this.entities) {
            if (!entity.active) {
                toRemove.push(id);
            }
        }
        
        toRemove.forEach(id => this.removeEntity(id));
    }
    
    render(ctx) {
        for (const entity of this.entities.values()) {
            if (entity.active) {
                entity.render(ctx);
            }
        }
    }
    
    clear() {
        this.entities.clear();
        this.entityTypes.clear();
    }
    
    checkCollisions(type1, type2, callback) {
        const entities1 = this.getEntitiesByType(type1);
        const entities2 = this.getEntitiesByType(type2);
        
        for (const entity1 of entities1) {
            for (const entity2 of entities2) {
                if (entity1.active && entity2.active && entity1.isColliding(entity2)) {
                    callback(entity1, entity2);
                }
            }
        }
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Entity,
        Player,
        Bullet,
        Enemy,
        PowerUp,
        Particle,
        EntityManager
    };
}