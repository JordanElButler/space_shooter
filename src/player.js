/**
 * 
 */
const PLAYERNAME = "PlayerEntity";
const PLAYERENTITYTYPE = 99;
class _Player {
	constructor(x, y) {
		this.entityType = PLAYERENTITYTYPE;
		this.name = PLAYERNAME;
		this.x = x;
		this.y = y;
	
		this.horiSpeed = 2;
		this.vertSpeed = 2;
	
		this.hitbox = {width:10, height:10};
		this.alive = true;
	
		this.cooldown = 0;
		this.bulletList = new List();
	
		this.sprite = new createjs.Sprite(playerSpriteSheet, "still");
		this.pixelSprite = new createjs.Sprite(pixelSpriteSheet, "still");
		this.pixelSprite.scaleX = this.hitbox.width;
		this.pixelSprite.scaleY = this.hitbox.height;
		this.pixelSprite.x = -this.hitbox.width/2;
		this.pixelSprite.y = -this.hitbox.height/2;
		this.animations = new createjs.Container();
		this.animations.addChild(this.sprite, this.pixelSprite);
	
		this.animations.x = this.x;
		this.animations.y = this.y;
	}
	receiveMessage(msg) {
		// delegate all that sheit
		console.log("Hit");
		let {eventType} = msg;
		if (eventType === COLLISIONEVENT) {
			let {otherCollider} = msg;
			if (otherCollider.entityType === BULLETENTITYTYPE && otherCollider.owner.entityType != PLAYERENTITYTYPE) {
				this.die();
			}
		}
	}
	tryFire(bulletList) {
		if(this.alive && this.cooldown === 0) {
			this.cooldown = 10;
			bulletList.append(PlayerShot(this, this.x, this.y-1, 1,-9,1,1));
			bulletList.append(PlayerShot(this, this.x, this.y-1, -1,-9,1,1));
			bulletList.append(PlayerShot(this, this.x, this.y-1, 0,-10,1,1));
		}
	}
	update(gameState) {
		this.tryFire(gameState.bulletList);
		if(this.cooldown) this.cooldown--;

		if (mouse.mouseMoved) {
			this.x = mouse.x;
			this.y = mouse.y;
			mouse.mouseMoved = false;
		}
		if(keymap[37]) this.x -= this.horiSpeed;
		if(keymap[38]) this.y -= this.vertSpeed;
		if(keymap[39]) this.x += this.horiSpeed;
		if(keymap[40]) this.y += this.vertSpeed;

		if(this.x < 0) this.x = 0;
		if(this.x > canvasWidth) this.x = canvasWidth;
		if(this.y < 0) this.y = 0;
		if(this.y > canvasHeight) this.y = canvasHeight;

		this.animations.x = this.x;
		this.animations.y = this.y;
	}

	die() {
		console.log("player dead");

		var explodeSprite = new createjs.Sprite(explosionSpriteSheet, "explode");
		explodeSprite.x = this.x;
		explodeSprite.y = this.y;
		shipContainer.addChild(explodeSprite);
		function removeExplosion() {
			shipContainer.removeChild(explodeSprite)
		}
		setTimeout(removeExplosion, 1000);
	}
	getHitbox() {
		return {
			  left: this.x + 1
			, width: 2
			, top: this.y + 1
			, heigth: 2
		};
	}
}

function Player() {
	return new _Player(canvasWidth/2, 2*canvasHeight);
}