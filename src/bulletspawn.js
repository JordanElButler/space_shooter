/**
 *  a pattern, an owner, a position relative to owner
 */
class BulletSpawn {
	constructor(xOffset, yOffset, pattern, owner) {
		this.xOffset = xOffset;
		this.yOffset = yOffset;
		this.pattern = pattern.bind(this);
		this.owner = owner;
		this.x = this.xOffset + this.owner.x;
		this.y = this.yOffset + this.owner.y;
		this.counter = 0;
	}
	update(gameState) {	
		this.x = this.xOffset + this.owner.x;
		this.y = this.yOffset + this.owner.y;
		if(gameState.player) {
			this.pattern(this.owner, gameState);
			this.counter++;
		}
	};

}