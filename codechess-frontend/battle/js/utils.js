import * as objects from './objects.js'
// 参数  从后端读
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

export function initImage(path) {
    let image = new Image();
    image.onload = () => {

    }
    image.src = path;
    return image;
}

export function drawImage(image, X, Y) {
    ctx.drawImage(image, X2x(X), X2x(Y), gridSize, gridSize);
}

export function drawFill(color, X, Y) {
    ctx.fillStyle = color;
    ctx.fillRect(X2x(X),X2x(Y), gridSize , gridSize);
}

export function drawGif(image, X, Y, frames, size, duration = frame, count = 1) {
    if (image.frame == undefined) {
        image.frame = 0;
        image.count = count;
        image.finished = false;
    }
    if (image.finished) return;
    let delta = frames/duration;
    if (image.frame < duration) {
        let count = image.width / size;
        let sx = (Math.floor(image.frame) % count) * size;
        let sy = Math.floor(Math.floor(image.frame) / count) * size;
        ctx.drawImage(image, sx, sy, size, size, X2x(X), X2x(Y), gridSize, gridSize);
        image.frame += delta;
    }
    if (image.frame >= duration && image.count != 0) {
        image.frame = 0;
        image.count--;
    }
    if (image.count == 0) {
        image.finished = true;
    }
}

export function drawBlood(player) {
    let length = gridSize * 0.9;
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(X2x(player.X) + gridSize * 0.05, X2x(player.Y) - gridSize * 0.3, length, gridSize * 0.18);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(X2x(player.X) + gridSize * 0.05, X2x(player.Y) - gridSize * 0.3, Math.max(player.hp / player.totalHp * length, 0), gridSize * 0.18);
}

export function showDetail(object) {
    detail.innerHTML = "";
    object.image.style="width:50px;height:50px";
    detail.appendChild(object.image);
    detail.innerHTML += "<span style='margin: 5px'>" + object.name + "</span st>";
}

function print(text) {
    text = "<p>" + text + "</p>"
    logger.innerHTML += text;
    logger.scrollTop = logger.scrollHeight;
}

export function printAction(name, action) {
    print("<span class="+name+"Name>" + name + "</span>" + action);
}

function debug(text) {
    if (isDebug) {
        print("<span class='debugText'>" + "[调试] " + text + "</span>");
    }
}

var isInit = false;

export function init() {
    if (!isInit){
        body = document.body;
        initWrapper();
        initCanvas(width, height);
        initPanel();
        isInit = true;
    }
}


export function x2X(x) {
    return Math.floor(x / gridSize);
}

export function X2x(X) {
    return X * gridSize;
}

var body;

var wrapper;

function initWrapper() {
    wrapper = document.createElement("div");
    wrapper.id = "wrapper";
    body.appendChild(wrapper);
}

var canvas, ctx;

let mousex = -1;
let mousey = -1;
let mouseX = -1;
let mouseY = -1;

function initCanvas(width, height) {
    canvas = document.createElement("canvas");
    canvas.id = "map";
    canvas.width = width;
    canvas.height = height;
    wrapper.appendChild(canvas);
    ctx = canvas.getContext("2d");
    
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
        let atk = new objects.Attack(mouseX, mouseY);
        objects.Attack.register(atk);
    }
}

var panel, detail, logger;

function initPanel() {
    panel = document.createElement("div");
    panel.id = "panel";
    wrapper.appendChild(panel);

    detail = document.createElement("div");
    detail.id = "detail";
    panel.appendChild(detail);

    logger = document.createElement("div");
    logger.id = "logger";
    panel.appendChild(logger);
}


// export function setCanvasOnClickListener(func) {
//     canvas.onclick = func();
// }