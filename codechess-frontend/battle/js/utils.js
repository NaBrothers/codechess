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
const grassImgPath = "images/grass.png";
const treeImgPath = "images/tree.png";
const heroImgPath = "images/hero.png";
const gameUrl = "http://codechess.online:8081/battle"

export var multiple = 1;

export function initImage(path) {
    let image = new Image();
    image.onload = () => {

    }
    image.src = path;
    return image;
}

export function drawImage(image, X, Y, degree=0) {
    ctx.save();
    ctx.translate(X2x(X)+gridSize/2, X2x(Y)+gridSize/2);
    ctx.rotate(degree);
    ctx.translate(-gridSize/2, -gridSize/2);
    ctx.drawImage(image, 0, 0, gridSize, gridSize);
    ctx.restore();
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

export function drawFlyer(flyer) {
    if (flyer.image.finished == undefined){
        flyer.image.finished = false;
        flyer.count = 0;
    } else if (flyer.image.finished == true) return;
    flyer.x += flyer.vector.x * flyer.speed;
    flyer.y += flyer.vector.y * flyer.speed;
    let degree;
    if (flyer.vector.x >= 0)
        degree = Math.asin(flyer.vector.y);
    else
        degree = Math.PI - Math.asin(flyer.vector.y);
    if (flyer.count < 50 && !flyer.image.finished){
        drawImage(flyer.image, flyer.x/gridSize, flyer.y/gridSize, degree);
        flyer.count++;
    } else {
        flyer.image.finished = true;
        let ack = new objects.Attack("击中", "images/attack.png", gridSize, 10001, x2X(flyer.x), x2X(flyer.y), 15, 15);
        objects.Attack.register(ack);
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
    // object.image.style="width:50px;height:50px";
    object.image.draggable="true";
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

export function initMap(gridX, gridY, gridSize, treeDensity) {
    for (var i = 0; i < gridX; i++){
        for (var j = 0; j < gridY; j++){
            let grass = new objects.Floor("草", grassImgPath, gridSize, i, j);
            objects.Floor.register(grass);
            if (i == 0||i == gridX-1||j == 0||j == gridY-1||Math.random() < treeDensity){
                let tree = new objects.Wall("树", treeImgPath, gridSize, i, j);
                objects.Wall.register(tree);
            }
        }
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
    // canvas.onclick = e => {
    //     let atk = new objects.Attack("攻击", "images/attack.png", gridSize, mouseX, mouseY, 15, 15);
    //     objects.Attack.register(atk);
    // }
    canvas.onclick = e => {
        let degree = Math.PI * 2 * Math.random();
        let flyer = new objects.Flyer("飞行", "images/flyer.png", gridSize, 10000, mouseX, mouseY, Math.cos(degree), Math.sin(degree), 2);
        objects.Flyer.register(flyer);
        showDetail(objects.Object.getObject(mouseX, mouseY));
    }
}

var panel, buttonMulti, detail, logger, seekBar, seekBarNum;

function initPanel() {
    panel = document.createElement("div");
    panel.id = "panel";
    wrapper.appendChild(panel);

    buttonMulti = document.createElement("button");
    buttonMulti.id = "buttonmulti";
    buttonMulti.innerHTML = "1.0x";
    buttonMulti.onclick = e =>{
        multiple *= 2;
        if(multiple > 4){
            multiple = 0.5;
        }
        if (multiple == 0.5)
            buttonMulti.innerHTML = "0.5x";
        else if (multiple == 1)
            buttonMulti.innerHTML = "1.0x";
        else if (multiple == 2)
            buttonMulti.innerHTML = "2.0x";
        else
            buttonMulti.innerHTML = "4.0x";
    }
    panel.appendChild(buttonMulti);

    detail = document.createElement("div");
    detail.id = "detail";
    panel.appendChild(detail);

    logger = document.createElement("div");
    logger.id = "logger";
    panel.appendChild(logger);

    seekBar = document.createElement("input");
    seekBar.type = "range";
    seekBar.id = "seekbar";
    seekBar.value = 0;
    panel.appendChild(seekBar);
}

export function renderDebug(currentFrame, step) {
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

export function renderMouse() {
    drawFill("rgb(255,183,0,0.4)", mouseX, mouseY);
}

var gameResult;

async function startNewGame() {
    return new Promise((resolve, reject) => {
        let resJSON = null;
        $.ajax({
            beforeSend: function(req) {
                req.setRequestHeader("Accept", "text/html");
            },
            type: "get",
            url: gameUrl + "/start", 
            success: function (res) {
                resJSON = $.parseJSON(res);
                console.log(resJSON.id);
            }
        }).done(
            () => {resolve(resJSON.id);}
        );
    });
}

async function getGameResult(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let resJSON = null;
            $.ajax({
                beforeSend: function(req) {
                    req.setRequestHeader("Accept", "text/html");
                },
                type: "get",
                url: gameUrl + "/result?id="+id, 
                success: function (res) {
                    resJSON = $.parseJSON(res);
                    gameResult = resJSON;
                    console.log(gameResult);
                    seekBar.min = 0;
                    seekBar.max = gameResult.totalSteps - 1;
                }
            }).done(
                () => {resolve(resJSON);}
            );
        }, 1000);
    })
}

export async function startAndGet() {
    return startNewGame().then(id => {
        return getGameResult(id);
    })
}

// export function updateObjects(players) {
//     for (var i in players){
//         let playerMap = players[i];
//         let player = objects.Player.getPlayerBySeq(playerMap.seq);
//         if (player == null){
//             player = new objects.Player(playerMap.id, heroImgPath, gridSize, playerMap.seq, playerMap.x, playerMap.y, 100, 100);
//             objects.Object.register(player);
//         }
//         player.X = playerMap.x;
//         player.Y = playerMap.y;
//     }
// }

export function updateObjects(step, frameIndex) {
    if (step >= gameResult.totalSteps || step < 0 || (step == gameResult.totalSteps-1 && frameIndex != 0))
        return;
    let lastPlayers = gameResult.steps[step].players;
    for (var seq in lastPlayers) {
        if (frameIndex == 0){
            let player = objects.Player.getPlayerBySeq(seq);
            if (player == null){
                player = new objects.Player(lastPlayers[seq].id, heroImgPath, gridSize, seq, lastPlayers[seq].x, lastPlayers[seq].y, 100, 100);
                objects.Player.register(player);
            }
            player.X = lastPlayers[seq].x;
            player.Y = lastPlayers[seq].y;
        }else {
            console.log(gameResult);
            console.log(step);
            let nextPlayers = gameResult.steps[step+1].players;
            if (seq in nextPlayers){
                let player = objects.Player.getPlayerBySeq(seq);
                if (player == null){
                    player = new objects.Player(lastPlayers[seq].id, heroImgPath, gridSize, seq, lastPlayers[seq].x, lastPlayers[seq].y, 100, 100);
                    objects.Player.register(player);
                }
                player.X = lastPlayers[seq].x + (nextPlayers[seq].x - lastPlayers[seq].x) * frameIndex / frame;
                player.Y = lastPlayers[seq].y + (nextPlayers[seq].y - lastPlayers[seq].y) * frameIndex / frame
            }
        }
    }
}