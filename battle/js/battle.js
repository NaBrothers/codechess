// 参数
const gridSize = 32;
const gridX = 24;
const gridY = 24;
const height = gridX * gridSize;
const width = gridY * gridSize;
const treeDensity = 0.1;

// Create the canvas
let body = document.body;
let wrapper = document.createElement("div");
wrapper.id = "wrapper";

let canvas = document.createElement("canvas");
canvas.id = "map";
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext("2d");

let panel = document.createElement("div");
panel.id = "panel";

let title = document.createElement("h1");
title.id = "title";
title.innerText = "CodeChess 码棋"

let detail = document.createElement("div");
detail.id = "detail";

let console = document.createElement("div");
console.id = "console";

body.appendChild(wrapper);
wrapper.appendChild(canvas);
wrapper.appendChild(panel);
panel.appendChild(title);
panel.appendChild(detail);
detail.appendChild(console);

let mapReady = false;
let mapArray = [];
for (let i = 0; i < gridX; i++) {
    mapArray.push([]);
    for (let j = 0; j < gridY; j++) {
        mapArray[i].push(0);
    }
}

let print = (text) => {
    text = "<p>" + text + "</p>"
    console.innerHTML += text;
    console.scrollTop = console.scrollHeight;
}

let printAction = (entity, action) => {
    print("<span class='entityName'>" + entity.name + "</span>" + action);
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
    name : "鲁尼",
    X : 0,
    Y : 0,
};
let monster = {
    X : 0,
    Y : 0,
};

// Handle keyboard controls
let keysDown = 0;

addEventListener("keydown", function (e) {
    if (keysDown == 0) {
        keysDown = e.keyCode;
    }
}, false);

addEventListener("keyup", function (e) {
    keysDown = 0;
}, false);

// Reset the game when the player catches a monster
let reset = function () {
    mapArray[3][gridY - 4] = 2;
    mapArray[gridX - 4][3] = 3;
    hero.X = 3;
    hero.Y = gridY - 4;
    monster.X = gridX - 4;
    monster.Y = 3;
};

let draw = (image, X, Y) => {
    ctx.drawImage(image, X * gridSize, Y * gridSize);
}

// Update game objects
let update = function (modifier) {
    let newPos = {
        X : hero.X,
        Y : hero.Y,
    };
    if (38 == keysDown) { // Player holding up
        printAction(hero, "向<span class='highlight'>前</span>走了一步")
        newPos.Y -= 1;
    }
    if (40 == keysDown) { // Player holding down
        printAction(hero, "向<span class='highlight'>后</span>走了一步")
        newPos.Y += 1;
    }
    if (37 == keysDown) { // Player holding left
        printAction(hero, "向<span class='highlight'>左</span>走了一步")
        newPos.X -= 1;
    }
    if (39 == keysDown) { // Player holding right
        printAction(hero, "向<span class='highlight'>右</span>走了一步")
        newPos.X += 1;
    }
    keysDown = 0;
    if (checkCollision(newPos)) {
        hero.X = newPos.X;
        hero.Y = newPos.Y;
    }
};

let checkCollision = (pos) => {
    let X = pos.X;
    let Y = pos.Y;
    if (X < 0 || X >= gridX || Y < 0 || Y >= gridY) {
        return false;
    }
    if (mapArray[X][Y] == 1) {
        return false;
    }
    return true;
}

let generateMap = () => {
    if (grassReady) {
        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                draw(grassImage, i, j);
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
                    draw(grassImage, i, j);
                } else {
                    draw(treeImage, i, j);
                }
            }
        }
    }
}

let renderPlayer = () => {
    if (heroReady) {
        draw(heroImage, hero.X, hero.Y);
    }

    if (monsterReady) {
        draw(monsterImage, monster.X, monster.Y);
    }
}

let renderDebug = () => {
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "12px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("x: " + Math.floor(hero.X * gridSize), gridSize, gridSize);
    ctx.fillText("y: " + Math.floor(hero.Y * gridSize), gridSize*2.5, gridSize);
    ctx.fillText("X: " + hero.X, gridSize, gridSize*1.5);
    ctx.fillText("Y: " + hero.Y, gridSize*2.5, gridSize*1.5);
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