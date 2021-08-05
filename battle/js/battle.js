// 参数
const gridSize = 32;
const gridX = 24;
const gridY = 24;
const height = gridX * gridSize;
const width = gridY * gridSize;
const treeDensity = 0.1;
const frame = 30;
const fps = 30;
const fpsInterval = 1000 / fps;
const isDebug = true;

let objects = {};

let mousex = -1;
let mousey = -1;
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
    mousex = e.offsetX;
    mousey = e.offsetY;
    mouseX = x2X(e.offsetX);
    mouseY = x2X(e.offsetY);
};
canvas.onmouseleave = e => {
    mousex = -1;
    mousey = -1;
    mouseX = -1;
    mouseY = -1;
};
canvas.onclick = e => {
    let id = mapArray[mouseX][mouseY];
    showDetail(objects[id]);
}
let ctx = canvas.getContext("2d");

let panel = document.createElement("div");
panel.id = "panel";

let detail = document.createElement("div");
detail.id = "detail";

let logger = document.createElement("div");
logger.id = "logger";

body.appendChild(wrapper);
wrapper.appendChild(canvas);
wrapper.appendChild(panel);
panel.appendChild(detail);
panel.appendChild(logger);

let mapArray = [];
for (let i = 0; i < gridX; i++) {
    mapArray.push([]);
    for (let j = 0; j < gridY; j++) {
        mapArray[i].push(0);
    }
}

let print = (text) => {
    text = "<p>" + text + "</p>"
    logger.innerHTML += text;
    logger.scrollTop = logger.scrollHeight;
}

let debug = (text) => {
    if (isDebug) {
        print("<span class='debugText'>" + "[调试] " + text + "</span>");
    }
}

let printAction = (object, action) => {
    print("<span class="+object.type+"Name>" + object.name + "</span>" + action);
}

let x2X = (x) => {
    return Math.floor(x / gridSize);
}

let X2x = (X) => {
    return X * gridSize;
}

let showDetail = (object) => {
    detail.innerHTML = "";
    object.image.style="width:50px;height:50px";
    detail.appendChild(object.image);
    detail.innerHTML += "<span style='margin: 5px'>" + object.name + "</span st>";
}

let initImage = (path) => {
    let image = new Image();
    image.onload = () => {
        debug(path + " 加载成功")
    }
    image.src = path;
    return image;
}

let gif = initImage("images/attack2.png")

// Game objects
let grass = {
    name: "草",
    id: 0,
    type: "floor",
    image: initImage("images/grass.png"),
}

let tree = {
    name: "树",
    id: 1,
    type: "wall",
    image: initImage("images/tree.png"),
}
let hero = {
    name : "鲁尼",
    X : 0,
    Y : 0,
    hp : 50,
    totalHp : 50,
    id: 2,
    type: "player",
    image: initImage("images/hero.png"),
};
let monster = {
    name : "怪兽",
    X : 0,
    Y : 0,
    hp : 100,
    totalHp: 100,
    id: 3,
    type: "player",
    image: initImage("images/monster.png"),
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
let init = function () {
    hero.X = 3;
    hero.Y = gridY - 4;
    monster.X = gridX - 4;
    monster.Y = 3;

    objects = {
        [grass.id] : grass,
        [tree.id] : tree,
        [hero.id] : hero,
        [monster.id] : monster,
    }

    generateMap();
};

let drawImage = (image, X, Y) => {
    ctx.drawImage(image, X2x(X), X2x(Y), gridSize, gridSize);
}

let drawFill = (color, X, Y) => {
    ctx.fillStyle = color;
    ctx.fillRect(X2x(X),X2x(Y), gridSize , gridSize);
}

let drawGif = (image, X, Y, frames, repeat) => {
    if (image.frame == undefined) {
        image.frame = 0;
    }
    if (image.frame < frames) {
        let sx = (image.frame % 5) * gridSize;
        let sy = Math.floor(image.frame / 5) * gridSize;
        ctx.drawImage(image, sx, sy, gridSize, gridSize, X2x(X), X2x(Y), gridSize, gridSize);
        image.frame++;
    }
    if (image.frame == frames && repeat) {
        image.frame = 0;
    }
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
        mapArray[hero.X][hero.Y] = 0;
        hero.X = newPos.X;
        hero.Y = newPos.Y;
        mapArray[hero.X][hero.Y] = 2;
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
    for (let i = 0; i < gridX; i++) {
        for (let j = 0; j < gridY; j++) {
            mapArray[i][j] = 0;
        }
    }

    for (let i = 0; i < gridX; i++) {
        for (let j = 0; j < gridY; j++) {
            if (i == 0 || j == 0 || i == gridX - 1 || j == gridY - 1) {
                mapArray[i][j] = 1;
            } else if (mapArray[i][j] == 0 && Math.random() < treeDensity) {
                mapArray[i][j] = 1;
            }
        }
    }

    mapArray[hero.X][hero.Y] = 2;
    mapArray[monster.X][monster.Y] = 3;
}

let renderMap = () => {
    for (let i = 0; i < gridX; i++) {
        for (let j = 0; j < gridY; j++) {
            drawImage(grass.image, i, j);
            if (mapArray[i][j] == 1) {
                drawImage(tree.image, i, j);
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

let renderPlayer = () => {
    drawImage(hero.image, hero.X, hero.Y);
    renderBlood(hero);

    drawImage(monster.image, monster.X, monster.Y);
    renderBlood(monster);
}

let renderDebug = () => {
    if (!isDebug) {
        return;
    }
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = 32*0.4 + "px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("x: " + mousex, 32, 32);
    ctx.fillText("y: " + mousey, 32*2.2, 32);
    ctx.fillText("X: " + mouseX, 32, 32*1.5);
    ctx.fillText("Y: " + mouseY, 32*2.2, 32*1.5);
    ctx.fillText("Step: " + step, 32, 32*2);
    ctx.fillText("Frame: " + currentFrame, 32, 32*2.5);
}

let renderMouse = () => {
    drawFill("rgb(255,183,0,0.4)", mouseX, mouseY);
}

// Draw everything
let render = function () {
    renderMap();
    renderPlayer();
    renderDebug();
    renderMouse();
    drawGif(gif, 5, 5, frame, true)
};

let currentFrame = 0;
let step = 0;

// The main game loop
let main = function () {
    let now = Date.now();
    let delta = now - then;
    if (delta > fpsInterval) {
        update(fpsInterval);
        render();
        then = now - delta % fpsInterval;
        currentFrame++;
        if (currentFrame == frame) {
            currentFrame = 0;
            step++;
        }
    }
    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
let then = Date.now();
init();
main();