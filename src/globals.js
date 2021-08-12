
var canvas = document.getElementById("c");
var canvasWidth = 400;
var canvasHeight = 600;



var load = new createjs.LoadQueue(false);

// createjs.Stage
var gameStage = null;
var titleStage = null;
// createjs.Container
var titleContainer = null;
var shipContainer = null;
var bulletContainer = null;
var colorContainer = null;
var whiteContainer = null;
var overlayContainer = null;
var shipLivesContainer = null;
var winningContainer = null;
// createjs.Text
var scoreText = null;
var livesText = null;
// createjs.Shape
var bossHpBar = null;

// bullet sprite sheets
var whiteSpriteSheet = null;
var colorSpriteSheet = null;
var playerShotSpriteSheet = null;
var pixelSpriteSheet = null;
var purpleOrbSpriteSheet = null;
//
var playerSpriteSheet = null;
var explosionSpriteSheet = null;
//
var bossMassiveSpriteSheet = null;
var bossDDP3SpriteSheet = null;
var bossDDP4SpriteSheet = null;
var bossDDP5SpriteSheet = null;


var keymap = {pressed: false};

function keyPressed() {
    var pressed = keymap.pressed;
    keymap.pressed = false;
    return pressed;
}

function keyListener(event) {
	if(event.keyCode) {
		keymap[event.keyCode] = event.type == "keydown";
	}
	else if(event.charCode) {
		keymap[event.charCode] = event.type == "keydown";
	}

    if (event.type == "keydown") keymap.pressed = true;
}

function getMousePos(el, evt) {
	var rect = el.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
var mouse = {
	x: 0, y: 0, px: 0, py: 0, mouseMoved: false, clicked: false
}

function mouseClicked() {
    var clicked = mouse.clicked;
    mouse.clicked = false;
    return clicked;
}
function moveListener(event) {
	var pos = getMousePos(canvas, event);
	mouse.px = mouse.x;
	mouse.py = mouse.y;
	mouse.x = pos.x;
	mouse.y = pos.y;
	mouse.mouseMoved = true;
}

 
var bossList = [
	'Massive',
	'DDP3',
	'DDP4',
	'DDP5'
];

var gameState = null;
const startingLives = 99;

// show a load bar or something
function progressHandler(event) {

}

function loadCompleteHandler(event) {
	initAssets();
    startGame();
}

window.onload = function() {
	gameStage = new createjs.Stage("c");
	gameStage.clear();
	gameStage.snapToPixelEnabled = true;
	
	titleContainer = new createjs.Container();
	shipContainer = new createjs.Container();
	colorContainer = new createjs.Container();
	whiteContainer = new createjs.Container();
	overlayContainer = new createjs.Container();
	shipLivesContainer = new createjs.Container();
	winningContainer = new createjs.Container();

	scoreText = new createjs.Text(0, "20px Arial", "#ff0000");
	scoreText.x = canvasWidth - 100;
	scoreText.y = 0;

	livesText = new createjs.Text(0, "20px Arial", "#ff0000");
	livesText.x = canvasWidth - 50;
	livesText.y = 0;

	bossHpBar = new createjs.Shape();

	document.addEventListener("keydown", keyListener);
	document.addEventListener("keyup", keyListener);
	canvas.addEventListener("mousemove", moveListener);
    canvas.addEventListener("click", function() {mouse.clicked = true;})

	load.addEventListener("progress", progressHandler);
	load.addEventListener("complete", loadCompleteHandler);

	load.loadManifest([
		{id: "title", src: "graphics/title.png"},
		{id: "ending", src: "graphics/ending.png"},
		{id: "pixel", src: "graphics/pixel.png"},
		{id: "purpleorb", src: "graphics/purpleorb.png"},
		{id: "explosion", src: "graphics/explosion.png"},
		{id: "bullet", src: "graphics/bullet.png"},
		{id: "bullets", src: "graphics/bullets.png"},
		{id: "player", src: "graphics/player.png"},
		{id: "ground1", src: "graphics/ground1.png"},
		{id: "massive", src: "graphics/massive.png"},
		{id: "ddp3", src: "graphics/ddp3.png"},
		{id: "ddp4", src: "graphics/ddp4.png"},
		{id: "ddp5", src: "graphics/ddp5.png"},
		{id: "pinkorb", src: "graphics/pinkorb.png"},
		{id: "blueorb", src: "graphics/blueorb.png"},
		{id: "purpledot", src: "graphics/purpledot.png"},
		{id: "white", src: "graphics/white.png"},
		{id: "center", src: "graphics/center.png"}
	]);
    
};

function initAssets() {

	whiteSpriteSheet = new createjs.SpriteSheet({
		"images": [load.getResult("center")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 1,
			"regX": 8,
			"regY": 8
		},
		"animations":{
			"spin": {
				"frames": [0],
				"next": "spin"
			}
		}
	});
    purpleOrbSpriteSheet = new createjs.SpriteSheet({
		"images": [load.getResult("purpleorb")],
		"frames": {
			"width": 7,
			"height": 7,
			"count": 1,
			"regX": 4,
			"regY": 4
		},
		"animations":{
			"spin": {
				"frames": [0],
				"next": "spin"
			}
		}
	});

	colorSpriteSheet =  new createjs.SpriteSheet({
		"images": [load.getResult("white")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 4,
			"regX": 8,
			"regY": 8
		},
		"animations":{
			"blue": {
				"frames": [0],
				"next": "blue"
			},
			"green": {
				"frames": [2],
				"next": "green"
			},
			"purple": {
				"frames": [1],
				"next": "purple"
			},
			"red": {
				"frames": [3],
				"next": "red"
			}
		}
	});

	playerShotSpriteSheet = new createjs.SpriteSheet({
		"images": [load.getResult("bullet")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 4,
			"regX": 4,
			"regY": 4
		},
		"animations":{
			"spin": {
				"frames": [0,1,2,3],
				"next": "spin",
				"speed": .2
			}
		}
	});


	var playerImage = load.getResult("player");

	var img = new Image();
	img.src = playerImage.src;

	playerSpriteSheet = new createjs.SpriteSheet({
		"images": [playerImage],
		"frames": {
			"width": img.width,
			"height": img.height,
			"regX": img.width/2,
			"regY": img.height/2,
			"count": 1
		},
		"animations":{
			"still": {
				"frames": [0],
				"next": "still"
			},
			"movingRight": {
				"frames": [0],
				"next": "movingRight"
			},
			"movingLeft": {
				"frames": [0],
				"next": "movingLeft"
			}
		}
	});

	
	pixelSpriteSheet = new createjs.SpriteSheet({
		"images": [load.getResult("pixel")],
		"frames": {
			"width": 1,
			"height": 1,
			"count": 1
		},
		"animations":{
			"still": {
				"frames": [0],
				"next": "still"
			},
			"movingRight": {
				"frames": [0],
				"next": "movingRight"
			},
			"movingLeft": {
				"frames": [0],
				"next": "movingLeft"
			}
		}
	});

	var explosionImage = load.getResult("explosion");

	var img = new Image();
	img.src = explosionImage.src;

	explosionSpriteSheet = new createjs.SpriteSheet({
		"images": [explosionImage],
		"frames": {
			"width": img.width/5,
			"height": img.height/3,
			"regX": img.width/10,
			"regY": img.height/6,
			"count": 15
		},
		"animations":{
			"explode": {
				"frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
				"next": "explode"
			}
		}
	});

	bossMassiveImage = load.getResult("massive");

	var img = new Image();
	img.src = bossMassiveImage.src;

	bossMassiveSpriteSheet = new createjs.SpriteSheet({
		"images": [bossMassiveImage],
		"frames": {
			"width": img.width,
			"height": img.height,
			"regX": img.width/2,
			"regY": img.height/2,
			"count": 1
		},
		"animations":{
			"still": {
				"frames": [0],
				"next": "still"
			},
			"movingRight": {
				"frames": [0],
				"next": "movingRight"
			},
			"movingLeft": {
				"frames": [0],
				"next": "movingLeft"
			}
		}
	});

	var bossDDP3Image = load.getResult("ddp3");

	var img = new Image();
	img.src = bossDDP3Image.src;

	bossDDP3SpriteSheet = new createjs.SpriteSheet({
		"images": [bossDDP3Image],
		"frames": {
			"width": img.width,
			"height": img.height,
			"regX": img.width/2,
			"regY": img.height/2,
			"count": 1
		},
		"animations":{
			"still": {
				"frames": [0],
				"next": "still"
			},
			"movingRight": {
				"frames": [0],
				"next": "movingRight"
			},
			"movingLeft": {
				"frames": [0],
				"next": "movingLeft"
			}
		}
	});
	
	var bossDDP4Image = load.getResult("ddp4");

	var img = new Image();
	img.src = bossDDP4Image.src;


	bossDDP4SpriteSheet= new createjs.SpriteSheet({
		"images": [bossDDP4Image],
		"frames": {
			"width": img.width,
			"height": img.height,
			"regX": img.width/2,
			"regY": img.height/2,
			"count": 1
		},
		"animations":{
			"still": {
				"frames": [0],
				"next": "still"
			},
			"movingRight": {
				"frames": [0],
				"next": "movingRight"
			},
			"movingLeft": {
				"frames": [0],
				"next": "movingLeft"
			}
		}
	});

	
	var bossDDP5Image = load.getResult("ddp5");

	var img = new Image();
	img.src = bossDDP5Image.src;

	bossDDP5SpriteSheet = new createjs.SpriteSheet({
		"images": [bossDDP5Image],
		"frames": {
			"width": img.width,
			"height": img.height,
			"regX": img.width/2,
			"regY": img.height/2,
			"count": 1
		},
		"animations":{
			"still": {
				"frames": [0],
				"next": "still"
			},
			"movingRight": {
				"frames": [0],
				"next": "movingRight"
			},
			"movingLeft": {
				"frames": [0],
				"next": "movingLeft"
			}
		}
	});


	var titleScreen = load.getResult("title");
	var title = new createjs.Bitmap(titleScreen);
	title.x = 0;
	title.y = 0;
	title.scaleX = canvasWidth/titleScreen.width;
	title.scaleY = canvasHeight/titleScreen.height;

	var text = new createjs.Text("Click to Start", "20px Arial", "#ff7700");
	text.x = canvasWidth/2 - 50;
	text.y = 100;
	text.textBaseline = "alphabetic";

	titleContainer.addChild(title);
	titleContainer.addChild(text);


	var winningBitmap = load.getResult("ending");
	var winningScreen = new createjs.Bitmap(winningBitmap);
	winningScreen.x = 0;
	winningScreen.y = 0;
	winningScreen.scaleX = canvasWidth/winningBitmap.width;
	winningScreen.scaleY = canvasHeight/winningBitmap.height;

	var winningText = new createjs.Text("placeholder, set when after win", "20px Arial", "#ff7700");
	winningText.x = canvasWidth/2 - 50;
	winningText.y = canvasHeight - 100;
	winningText.textBaseline = "alphabetic";

	winningContainer.addChild(winningScreen);
	winningContainer.addChild(winningText);
}