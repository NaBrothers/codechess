// 参数
const gridSize = 32;
const gridX = 24;
const gridY = 24;
const height = gridX * gridSize;
const width = gridY * gridSize;
const treeDensity = 0.1;

let mouseX = -1;
let mouseY = -1;

// Create the canvas
let body = document.body;
let wrapper = document.createElement("div");
wrapper.id = "wrapper";

let canvas = document.createElement("canvas");
canvas.id = "map";
canvas.width = width;
canvas.height = height;
canvas.onmousemove = e => {
      mouseX = x2X(e.offsetX);
      mouseY = x2X(e.offsetY);
};
canvas.onmouseleave = e => {
    mouseX = -1;
    mouseY = -1;
};
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

let x2X = (x) => {
    return Math.floor(x / gridSize);
}

let X2x = (X) => {
    return X * gridSize;
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
    hp : 50,
    totalHp : 50,
};
let monster = {
    name : "怪兽",
    X : 0,
    Y : 0,
    hp : 100,
    totalHp: 100,
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
    hero.X = 3;
    hero.Y = gridY - 4;
    monster.X = gridX - 4;
    monster.Y = 3;
};

let drawImage = (image, X, Y) => {
    ctx.drawImage(image, X2x(X), X2x(Y));
}

let drawFill = (color, X, Y) => {
    ctx.fillStyle = color;
    ctx.fillRect(X2x(X),X2x(Y), gridSize , gridSize);
}

// Update game objects
let update = function (modifier) {
    let newPos = {
        X : hero.X,
        Y : hero.Y,
    };
    if (keysDown != 0) {
        hero.hp -= 1;
        if (hero.hp <= 0) {
            printAction(hero, "<span class='highlight'>死了</span>")
            return;
        }
    }
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
    if (mapArray[X][Y] != 0) {
        return false;
    }
    return true;
}

let generateMap = () => {
    if (grassReady) {
        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                drawImage(grassImage, i, j);
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
                    drawImage(grassImage, i, j);
                } else {
                    drawImage(treeImage, i, j);
                }
            }
        }
    }
}

let renderBlood = (player) => {
    let length = gridSize * 0.9;
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(X2x(player.X) + gridSize * 0.05, X2x(player.Y) - gridSize * 0.3, length, gridSize * 0.18);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(X2x(player.X) + gridSize * 0.05, X2x(player.Y) - gridSize * 0.3, Math.max(player.hp / player.totalHp * length, 0), gridSize * 0.18);
}

let renderEntity = () => {
    if (heroReady) {
        drawImage(heroImage, hero.X, hero.Y);
        renderBlood(hero);
    }

    if (monsterReady) {
        drawImage(monsterImage, monster.X, monster.Y);
        renderBlood(monster);
    }
}

let renderDebug = () => {
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "12px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("x: " + X2x(hero.X), gridSize, gridSize);
    ctx.fillText("y: " + X2x(hero.Y), gridSize*2.5, gridSize);
    ctx.fillText("X: " + hero.X, gridSize, gridSize*1.5);
    ctx.fillText("Y: " + hero.Y, gridSize*2.5, gridSize*1.5);
}

let renderMouse = () => {
    drawFill("rgb(255,183,0,0.4)", mouseX, mouseY);
}

// Draw everything
let render = function () {
    renderMap();
    renderEntity();
    renderDebug();
    renderMouse();
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