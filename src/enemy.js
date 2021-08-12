/**
 *  file for all enemy types
 */

const BOSSENTITYTYPE = 77;
class _Boss {
	constructor(bossData) {
		this.entityType = BOSSENTITYTYPE;
		this.name = bossData.name;
		this.x = bossData.x;
		this.y = bossData.y;
		this.hp = bossData.maxhp;
		this.bulletSpawns = [];
		for (var i = 0; i < bossData.bulletSpawns.length; i++) {
			const [posX, posY, spawnFnName] = bossData.bulletSpawns[i];
			this.bulletSpawns.push(new BulletSpawn(posX, posY, spawnFnName, this));
		}
		this.moveFn = () => { bossData.moveFn(this)};


		this.sprite = new createjs.Sprite(bossData.spriteSheet, "still");
		this.animations = new createjs.Container();
		this.animations.addChild(this.sprite);
	
		this.animations.x = this.x;
		this.animations.y = this.y;
	}
	receiveMessage(msg) {
		var {eventType} = msg;
	}
	update(gameState) {
		this.moveFn();
		this.animations.x = this.x;
		this.animations.y = this.y;
		for (var i = 0; i < this.bulletSpawns.length; i++) {
			this.bulletSpawns[i].update(gameState);
		}
	}
	getHitbox() {
		return {
			  left: this.x
			, width: this.sprite.x
			, top: this.y
			, height: this.sprite.y
		}
	}
}

function Massive() {
	return new _Boss({
		name: "Massive",
		maxhp: 500,
		x: canvasWidth/2,
		y: canvasHeight/3,
		spriteSheet: bossMassiveSpriteSheet,
		moveFn: function (self) {
			var epsilon = .01;

			self.moveParameter = self.moveParameter ? self.moveParameter : 0;
			self.x = canvasWidth/2 + 50*Math.cos(self.moveParameter);
			self.moveParameter += epsilon;
			if(self.moveParameter >= 2*Math.PI) {
				self.moveParameter = 0;
			}
		},
		bulletSpawns: [
			[0,-100, shotgun],
			[0,0, shotgun],
			[-50,10, shootAtEm], 
			[50, 10, shootAtEm],
			[-40, 20, hose],
			[40, 20, hose]
		]
	});
}
function DDP3(x, y) {
	this.x = x;
	this.y = y;
	this.hp = 500;
	this.maxhp = this.hp;
	this._node;

	this.bulletSpawns = [
		new BulletSpawn(-50,-100,shootAtEm,this), 
		new BulletSpawn(50, -100, shootAtEm, this),
		new BulletSpawn(0,0, hose, this),
		new BulletSpawn(50,0, spinnerFactory(13), this),
		new BulletSpawn(-50,0, spinnerFactory(11), this)
	];
	this.invincible = false;

	

	this.hitbox = {width: 200, height: 200};

	this.sprite = new createjs.Sprite(bossDDP3SpriteSheet, "still");

	this.animations = new createjs.Container();
	this.animations.addChild(this.sprite);

	this.animations.x = this.x;
	this.animations.y = this.y;


	var move = function() {
		move.parameter = move.parameter || 0;
		var epsilon = .01;

		this.x = 10*Math.cos(move.parameter) + canvasWidth/2;
		this.y = 10*Math.sin(move.parameter) + canvasHeight/4;
		move.parameter+= epsilon;
		if(move.parameter >= 2*Math.PI) {
			move.parameter = 0;
		}
	}.bind(this);


	this.update = function() {

		move();
		this.animations.x = this.x;
		this.animations.y = this.y;
		for(var i = 0; i < this.bulletSpawns.length; i++) {
			this.bulletSpawns[i].update([gameState.player], this.collisionCallback);
		}
	}
	this.destroy = function() {
		shipContainer.removeChild(this.animations);
		enemyList.remove(this._node);
	}
}

DDP3.prototype.collisionCallback = function() {
	console.log("Player hit");
	checkIfPlayerDeadAndTakeAction();
}

function DDP4(x, y) {
	this.x = x;
	this.y = y;
	this.hp = 1000;
	this.maxhp = this.hp;
	this.bulletSpawns = [
		new BulletSpawn(0,-100, shotgun, this),
		new BulletSpawn(0,0,shotgun, this),
		new BulletSpawn(0, 0, cherryBlossom, this)
	//	new BulletSpawn(0,0, circle, this),
	];

	this.invincible = false;
	this.hitbox = {width: 200, height: 200};

	this.sprite = new createjs.Sprite(bossDDP4SpriteSheet, "still");

	this.animations = new createjs.Container();
	this.animations.addChild(this.sprite);

	this.animations.x = this.x;
	this.animations.y = this.y;


	var move = function() {
		move.parameter = move.parameter || 0;
		move.epsilon =  move.epsilon || .01;

		this.x = canvasWidth/2 - 50*Math.cos(move.parameter);
		this.y = canvasHeight/4 - 50*Math.sin(move.parameter);
		move.parameter += move.epsilon;
		if(move.parameter >= Math.PI || move.parameter < 0) {
			//move.parameter = 0;
			move.epsilon = -move.epsilon;
		}
	}.bind(this);


	this.update = function() {

		move();
		this.animations.x = this.x;
		this.animations.y = this.y;
		for(var i = 0; i < this.bulletSpawns.length; i++) {
			this.bulletSpawns[i].update([gameState.player], this.collisionCallback);
		}
		
	}
}

DDP4.prototype.collisionCallback = function() {
	console.log("Player hit");
	checkIfPlayerDeadAndTakeAction();
}	


function DDP5(x, y) {
	this.x = x;
	this.y = y;
	this.hp = 500;
	this.maxhp = this.hp;
	this.bulletSpawns = [
	new BulletSpawn(0,-100, shotgun, this),
	new BulletSpawn(0,0,shotgun, this),
		new BulletSpawn(-100,20, circle, this),
		new BulletSpawn(100,20, circle, this),
		new BulletSpawn(0,0, rain, this)
	];

	this.invincible = false;
	this.hitbox = {width: 200, height: 200};

	this.sprite = new createjs.Sprite(bossDDP5SpriteSheet, "still");

	this.animations = new createjs.Container();
	this.animations.addChild(this.sprite);

	this.animations.x = this.x;
	this.animations.y = this.y;


	var move = function() {
		move.parameter = move.parameter || 0;
		var epsilon = .01;

		this.x = canvasWidth/2 + 50*Math.cos(move.parameter);
		move.parameter += epsilon;
		if(move.parameter >= 2*Math.PI) {
			move.parameter = 0;
		}
	}.bind(this);


	this.update = function() {

		move();
		this.animations.x = this.x;
		this.animations.y = this.y;
		for(var i = 0; i < this.bulletSpawns.length; i++) {
			this.bulletSpawns[i].update([gameState.player], this.collisionCallback);
		}

	}
}

DDP5.prototype.collisionCallback = function() {
	console.log("Player hit");
	checkIfPlayerDeadAndTakeAction();
}