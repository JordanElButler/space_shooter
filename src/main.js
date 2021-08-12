const DEBUG = true;

function startGame() {
	var state = {};
	loadTitleScene(state);

	createjs.Ticker.addEventListener("tick", function() {
		if (state.gameScene === "TitleScene") {
			titleSceneLoop(state);
		} else if (state.gameScene === "BossScene") {
			bossSceneLoop(state);
		} else if (state.gameScene === "EndScene") {
			endSceneLoop(state);
		}
	});
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
}

function loadTitleScene(state) {
	state.gameScene = "TitleScene";
	gameStage.addChild(titleContainer);
	gameStage.update();
}
function titleSceneLoop(state) {
	gameStage.update();

	var mc = mouseClicked();
	var kp = keyPressed();
	if (mc || kp) {
		loadBossScene(state);
	}
}
function loadBossScene(state) {
	state.gameScene = "BossScene";
	state.bossList = [DDP3, Massive, DDP4, DDP5];
	state.gameState = {
		lives: startingLives,
		stage: 0,
		score: 0,
		player: Player(),
		boss: Massive(),
		bulletList: new FiniteList(200),
		collider: new Collider()
	};

	let {player, boss} = state.gameState;

	clearGameContainers();
	gameStage.addChild(shipContainer, colorContainer, whiteContainer, overlayContainer);
	shipContainer.addChild(boss.animations);
	shipContainer.addChild(player.animations);
	overlayContainer.addChild(scoreText);
	overlayContainer.addChild(livesText);

	
	shipLivesContainer.x = 25;
	shipLivesContainer.y = canvasHeight - 25;

	for(var i = 0; i < state.lives; i++) {
		var sprite = new createjs.Sprite(playerSpriteSheet, "still");
		sprite.scaleX = .5;
		sprite.scaleY = .5;

		sprite.x = i*25;
		sprite.y = 0;

		shipLivesContainer.addChild(sprite);
	}
	overlayContainer.addChild(shipLivesContainer);

	if(state.boss) {

		bossHpBar.graphics.beginStroke("grey").beginFill("green").drawRect(20, 20, 250*state.boss.hp/state.boss.maxhp, 25).endFill();
		overlayContainer.addChild(bossHpBar);
	}
}
function bossSceneLoop(state) {
	let {gameState} = state;
	let {player, boss, bulletList, collider} = gameState;

	if(player) {
		player.update(gameState);
		let {left, width, top, height} = player.getHitbox();
		collider.addRect(player, left, width, top, height);
	} else {
		player = Player();
		state.gameState.player = player;
	}
	if (boss) {
		boss.update(gameState);
		let {left, width, top, height} = boss.getHitbox();
		collider.addRect(boss, left, width, top, height);
	}
	else {
		boss = Massive();
		state.gameState.boss = boss;
	}
	// update bullets
	bulletList.map(
		function(b) {
			if (b.alive()) {
				b.update();
				let r = b.getHitbox();
				if (checkRectOverlap(r
									,{
										  left: -20 
										, width: canvasWidth + 40
										, top: -20
										, height: canvasHeight + 40
									})) 
				{
					b.setDead();
				}
			}
		}
	);
	// enter collisions  
	bulletList.map(
		function(b) {
			if (b.alive()) {
				let {left, width, top, height} = b.getHitbox();
				collider.addRect(b, left, width, top, height);
			}
		}
	);
	// check collisions, send messages
	collider.checkCollisions();
	collider.clear();
	// TODO sweep bulletlist for dead

	overlayUpdate(gameState);
	gameStage.update();

	if (DEBUG) {
		let ctx = canvas.getContext("2d");
		ctx.strokeStyle = "green";
		let {left, width, top, height} = state.gameState.player.getHitbox();
		ctx.strokeRect(left, width, top, height)
	}
	whiteContainer.children = [];
	colorContainer.children = [];
}
function loadEndScene(state) {
	state.gameScene = "EndScene";
	
	gameStage.addChild(winningContainer);
	gameStage.update();
}
function endSceneLoop(state) {
	var mc = mouseClicked();
	var kp = keyPressed();
	if (mc || kp) {
		loadTitleScene(state);
	}
}


function clearGameContainers() {
	// render data crap
	gameStage.removeAllChildren();
	gameStage.removeAllEventListeners();
	whiteContainer.removeAllChildren();
	colorContainer.removeAllChildren();
	shipContainer.removeAllChildren();
	overlayContainer.removeAllChildren();
}

/**
 * game is still running, but clears screen and enemies to go to next level
 */
function playerDead() {

	shipLivesContainer.removeAllChildren();
	for(var i = 0; i < gameState.lives; i++) {
		var sprite = new createjs.Sprite(playerSpriteSheet, "still");
		sprite.scaleX = .5;
		sprite.scaleY = .5;

		sprite.x = i*25;
		sprite.y = 0;

		shipLivesContainer.addChild(sprite);
	}


	var x = gameState.player.x;
	var y = gameState.player.y;


	shipContainer.removeChild(gameState.player.animations);

	gameState.player = null;

	function showPlayerAgain() {
		gameState.player = new Player(x,y);
		shipContainer.addChild(gameState.player.animations);
	}

	setTimeout(showPlayerAgain, 2000)
}

function removeEverything() {
	createjs.Ticker.removeEventListener("tick", bossGameLoop);

	gameState.boss = null;
	gameStage.removeAllChildren();
	gameStage.removeAllEventListeners();

	whiteContainer.removeAllChildren();
	colorContainer.removeAllChildren();
	shipContainer.removeAllChildren();
	overlayContainer.removeAllChildren();

}

/**
 * game is over, reset everything
 */
function gameOver() {
	shipContainer.removeChild(gameState.player.animations);

	gameState.player = null;


	setTimeout(function() {
		removeEverything();
		loadTitle();
	}, 2000);
	
}

/**
 * function to update overlay, reads player lives and score and boss hp
 */
function overlayUpdate(gameState) {
	scoreText.text = gameState.score;
	if(gameState.boss) {
		bossHpBar.graphics.clear();
		bossHpBar.graphics.beginStroke("grey").drawRect(20,20,250,25).beginFill("grey").drawRect(20,20,250,25).beginFill("green").drawRect(20, 20, 250*gameState.boss.hp/gameState.boss.maxhp, 25);
	}
}


function checkIfPlayerDeadAndTakeAction() {
	if(!gameState.player.invincible) {
		gameState.player.die();
		gameState.lives--;
		if(gameState.lives < 0) {
			gameOver();
		}
		else {
			playerDead();
		}
	}
}

