// 参数
const gridSize = 32;
const gridX = 24;
const gridY = 24;
const height = gridX * gridSize;
const width = gridY * gridSize;
const treeDensity = 0.15;

// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

let mapReady = false;
let mapArray = [];
for (let i = 0; i < gridX; i++) {
    mapArray.push([]);
    for (let j = 0; j < gridY; j++) {
        mapArray[i].push(0);
    }
}

// Tree image
let treeReady = false;
let treeImage = new Image();
treeImage.onload = function () {
    treeReady = true;
};
treeImage.src = "images/tree.png";

// Grass image
let grassReady = false;
let grassImage = new Image();
grassImage.onload = function () {
    grassReady = true;
};
grassImage.src = "images/grass.png";

// Hero image
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
let monsterReady = false;
let monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
let hero = {
    speed: 4 * gridSize,
};
let monster = {};
let monstersCaught = 0;

// Handle keyboard controls
let keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
let reset = function () {
    mapArray[3][gridY - 4] = 2;
    mapArray[gridX - 4][3] = 3;
    hero.x = 3 * gridSize;
    hero.y = width - 4 * gridSize;
    monster.x = height - 4 * gridSize;
    monster.y = 3 * gridSize;
};

// Update game objects
let update = function (modifier) {
    let newPos = {
        x : hero.x,
        y : hero.y,
    };
    if (38 in keysDown) { // Player holding up
        newPos.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        newPos.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        newPos.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        newPos.x += hero.speed * modifier;
    }
    if (checkCollision(newPos)) {
        hero.x = newPos.x;
        hero.y = newPos.y;
    }
};

let checkCollision = (pos) => {
    let X = parseInt(Math.floor(pos.x / gridSize));
    let Y = parseInt(Math.floor(pos.y / gridSize));
    if (mapArray[X][Y] == 1 || mapArray[X][Y+1] == 1 || mapArray[X+1][Y] == 1 || mapArray[X+1][Y+1] == 1) {
        return false;
    }
    return true;
}

let generateMap = () => {
    if (grassReady) {
        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                ctx.drawImage(grassImage, i * gridSize, j * gridSize);
            }
        }
    }

    if (treeReady) {
        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                if (i == 0 || j == 0 || i == gridX - 1 || j == gridY - 1) {
                    mapArray[i][j] = 1;
                } else if (mapArray[i][j] == 0 && Math.random() < treeDensity) {
                    mapArray[i][j] = 1;
                }
            }
        }
    }

    if (grassReady && treeReady) {
        mapReady = true;
    }
}

let renderMap = () => {
    if (!mapReady) {
        generateMap();
    } else {
        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                if (mapArray[i][j] != 1) {
                    ctx.drawImage(grassImage, i * gridSize, j * gridSize);
                } else {
                    ctx.drawImage(treeImage, i * gridSize, j * gridSize);
                }
            }
        }
    }
}

let renderPlayer = () => {
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
}

let renderDebug = () => {
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "12px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("x: " + Math.floor(hero.x), gridSize, gridSize);
    ctx.fillText("y: " + Math.floor(hero.y), gridSize*2.5, gridSize);
    ctx.fillText("X: " + Math.floor(hero.x/gridSize), gridSize, gridSize*1.5);
    ctx.fillText("Y: " + Math.floor(hero.y/gridSize), gridSize*2.5, gridSize*1.5);
}

// Draw everything
let render = function () {
    renderMap();
    renderPlayer();
    renderDebug();
};

// The main game loop
let main = function () {
    let now = Date.now();
    let delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
let then = Date.now();
reset();
main();