/**
 *  file for different bullets
 */
const BULLETENTITYTYPE = 88;
const PLAYERSHOT = 0;
const PURPLEDOT = 1;
const ORB = 2;
const PLAYERSHOTNAME = "PlayerShot";
const PURPLEDOTNAME = "PurpleDot";
const ORBNAME = "Orb";
class Bullet {
	constructor(owner, x, y, vx, vy, ax, ay, damp, width, height, type) {
		this.entityType = BULLETENTITYTYPE;
		this.owner = owner;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.ax = ax;
		this.ay = ay;
		this.damp = damp;
		this.life = 4000;
		this.type = type;
		if (this.type[0] === PLAYERSHOT) {
			this.name = PLAYERSHOTNAME;
			this.sprite = new createjs.Sprite(playerShotSpriteSheet, "spin");
			this.animations = this.sprite;
			this.animations.x = this.x;
			this.animations.y = this.y;
		}
		else if (this.type[0] === PURPLEDOT) {
			this.name = PURPLEDOTNAME;
			this.sprite = new createjs.Sprite(purpleOrbSpriteSheet, "spin");
			this.animations = this.sprite;

			this.animations.x = this.x;
			this.animations.y = this.y;

		} else if (this.type[0] === ORB) {
			this.name = ORBNAME;
			this.sprite = new createjs.Sprite(colorSpriteSheet, this.type[1]);
			this.sprite2 = new createjs.Sprite(whiteSpriteSheet, "spin");
	
		}

	}
	update() {
		var epsilon = .001;
		if(this.ax < epsilon) {
			this.ax = 0;
		}
		if(this.ay < epsilon) {
			this.ay = 0;
		}

		this.ax *= this.damp;
		this.ay *= this.damp;
		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;

		this.life--;
		if (this.alive()) {
			if (this.type[0] === PLAYERSHOT) {
				colorContainer.addChild(this.animations);
			}
			else if (this.type[0] === PURPLEDOT) {
				colorContainer.addChild(this.animations);
	
				this.animations.x = this.x;
				this.animations.y = this.y;
			}
			else if (this.type[0] === ORB) {
				colorContainer.addChild(this.sprite);
				whiteContainer.addChild(this.sprite2);
		
				this.sprite.x = this.x;
				this.sprite.y = this.y;
				this.sprite2.x = this.x;
				this.sprite2.y = this.y;
			}
		}

	}
	alive() {
		return this.life > 0;
	}
	setDead() {
		this.life = 0;
	}
	receiveMessage(msg) {

	}
	getHitbox() {
		if (this.type[0] === PLAYERSHOT) return {
			  left: this.x - 4
			, width: 8
			, top: this.y - 4
			, height: 8
		};
		else if (this.type[0] === PURPLEDOT) return {
			left: this.x - 2
			, width: 4
			, top: this.y - 2
			, height: 4
		};
		else if (this.type[0] === ORB) return {
			left: this.x - 4
			, width: 8
			, top: this.y - 4
			, height: 8
		};
	}
}

function PlayerShot(owner, x, y, vx, vy, width, height) {
	return new Bullet(owner, x, y, vx, vy, 0, 0, 1, width, height, [PLAYERSHOT]);
}
function PurpleDot(owner, x,y,vx,vy,ax, ay, width, height) {
	return new Bullet(owner, x,y,vx,vy,ax, ay, 0.9, width, height, [PURPLEDOT]);
}

function Orb(owner, x, y, vx, vy, ax, ay, width, height, color) {
	return new Bullet(owner, x, y, vx, vy, ax, ay, 1, width, height, [ORB, color]);
}
/*
function MobilePattern(x, y, vx, vy, pattern, list, life) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.bulletList = list;
	this.pattern = pattern;
	this.visible = true;

	this.life = life || 220;

	//this.hitbox = {width: width, height: height};

	this.update = function() {
		this.counter = this.counter || 0;
		this.pattern();
		this.counter++;

		this.x += this.vx;
		this.y += this.vy;

		this.life--;
	};

	this.destroy = function() {
		this.life = 0;
	};
}
*/ //someday