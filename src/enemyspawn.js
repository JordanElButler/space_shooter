/**
 * Basically a list of function references with data
 */
function EnemySpawn(list) {
	this.enemies = list;

	this.instantiate = function() {
		for(var i = 0; i< this.enemies.length; i++) {
			var enemyFunction = this.enemies[i].enemyFunction;
			var data = this.enemies[i].data;

			enemyFunction.apply(this, data);
		}
	}
}