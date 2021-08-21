import * as objects from './objects.js'
// 参数  从后端读
// const gridSize = 32;
// const gridX = 24;
// const gridY = 24;
// const height = gridX * gridSize;
// const width = gridY * gridSize;
// const treeDensity = 0.1;
// const frame = 30;
// const fps = 30;
// const fpsInterval = 1000 / fps;
// const isDebug = true;
// const grassImgPath = "images/grass.png";
// const treeImgPath = "images/tree.png";
// const heroImgPath = "images/hero.png";
// const gameUrl = "http://codechess.online:8081/battle"
import {gridSize, gridX, gridY, height, width, treeDensity, frame, fps, fpsInterval, isDebug, grassImgPath, treeImgPath, heroImgPath, gameUrl, monsterImgPath, playerImgPaths} from './const.js'

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

export function drawFill(color, X, Y, context=ctx) {
    context.fillStyle = color;
    context.fillRect(X2x(X),X2x(Y), gridSize , gridSize);
}

function drawGif(image, X, Y, frames, size, duration = frames, count = 1) {
    duration /= multiple;
    if (image.frame == undefined) {
        image.frame = 0;
        image.count = count;
        image.finished = false;
    }
    if (image.finished) return;
    let delta = frames/duration;
    if (image.frame < frames) {
        let count = image.width / size;
        let sx = (Math.floor(image.frame) % count) * size;
        let sy = Math.floor(Math.floor(image.frame) / count) * size;
        ctx.drawImage(image, sx, sy, size, size, X2x(X), X2x(Y), gridSize, gridSize);
        image.frame += delta;
    }
    if (image.frame >= frames && image.count != 0) {
        image.frame = 0;
        image.count--;
    }
    if (image.count == 0) {
        image.finished = true;
    }
}

export function drawAttack(attack) {
    drawGif(attack.image, attack.X, attack.Y, attack.frames, attack.size, attack.duration, 1);
}

export function drawFlyer(flyer) {
    if (flyer.image.finished == undefined){
        flyer.image.finished = false;
        flyer.count = 0;
    }
    flyer.x += flyer.vector.x * flyer.speed * multiple;
    flyer.y += flyer.vector.y * flyer.speed * multiple;
    let degree;
    if (flyer.vector.x >= 0)
        degree = Math.asin(flyer.vector.y);
    else
        degree = Math.PI - Math.asin(flyer.vector.y);
    if (!flyer.image.finished){
        drawImage(flyer.image, flyer.x/gridSize, flyer.y/gridSize, degree);
        flyer.count++;
    } else {
        // flyer.image.finished = true;
        let png = "images/attack.png";
        let ack = new objects.Attack("击中", png, gridSize, flyer.seq, flyer.id, flyer.X, flyer.Y, 15, 15);
        objects.Attack.register(ack);

    }
}

export function drawBlood(player) {
    if (player.status != 0) return;
    let length = gridSize * 0.9;
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(X2x(player.X) + gridSize * 0.05, X2x(player.Y) - gridSize * 0.3, length, gridSize * 0.18);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(X2x(player.X) + gridSize * 0.05, X2x(player.Y) - gridSize * 0.3, Math.max(player.hp / player.totalHp * length, 0), gridSize * 0.18);
}

export function showDetail(object) {
    detail.innerHTML = "";
    object.image.style="width:50px;height:50px";
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
var playerImgMap = {};

export function init() {
    if (!isInit){
        body = document.body;
        initWrapper();
        initStats();
        initCanvas(width, height);
        initPanel();

        let length = playerImgPaths.length;
        playerImgMap[111] = playerImgPaths[parseInt(Math.random()*length)];
        playerImgMap[222] = playerImgPaths[parseInt(Math.random()*length)];
        playerImgMap[333] = playerImgPaths[parseInt(Math.random()*length)];
        playerImgMap[444] = playerImgPaths[parseInt(Math.random()*length)];


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

let stats, status;

function initStats() {
    stats = document.createElement("div");
    stats.id = "stats";
    wrapper.appendChild(stats);

    detail = document.createElement("div");
    detail.id = "detail";
    stats.appendChild(detail);

    status = document.createElement("div");
    status.id = "status";
    stats.appendChild(status);
}

var canvasWrapper, canvas, ctx, mouseCanvas, mouseCtx;

let mousex = -1;
let mousey = -1;
let mouseX = -1;
let mouseY = -1;

function initCanvas(width, height) {
    canvasWrapper = document.createElement("div");
    canvasWrapper.id = "canvasWrapper";
    wrapper.appendChild(canvasWrapper);

    canvas = document.createElement("canvas");
    canvas.id = "map";
    canvas.width = width;
    canvas.height = height;
    canvasWrapper.appendChild(canvas);
    ctx = canvas.getContext("2d");

    mouseCanvas = document.createElement("canvas");
    mouseCanvas.id = "mouseLayer";
    mouseCanvas.width = width;
    mouseCanvas.height = height;
    canvasWrapper.appendChild(mouseCanvas);
    mouseCtx = mouseCanvas.getContext("2d");
    
    mouseCanvas.onmousemove = e => {
        mousex = e.offsetX;
        mousey = e.offsetY;
        mouseX = x2X(e.offsetX);
        mouseY = x2X(e.offsetY);
    };
    mouseCanvas.onmouseleave = e => {
        mousex = -1;
        mousey = -1;
        mouseX = -1;
        mouseY = -1;
    };
    // canvas.onclick = e => {
    //     let atk = new objects.Attack("攻击", "images/attack.png", gridSize, mouseX, mouseY, 15, 15);
    //     objects.Attack.register(atk);
    // }
    mouseCanvas.onclick = e => {
        // let degree = Math.PI * 2 * Math.random();
        // let flyer = new objects.Flyer("飞行", "images/flyer.png", gridSize, 10000, 0, mouseX, mouseY, Math.cos(degree), Math.sin(degree), 2);
        // objects.Flyer.register(flyer);
        showDetail(objects.Object.getObject(mouseX, mouseY));
    }
}

export var panel, buttonMulti, detail, logger, seekBar, settings, toolBar, downloadButton, uploadButton, stepController, stepInfo, playButton;

function initPanel() {
    panel = document.createElement("div");
    panel.id = "panel";
    wrapper.appendChild(panel);

    settings = document.createElement("div");
    settings.id = "settings";
    panel.appendChild(settings);

    toolBar = document.createElement("div");
    toolBar.id = "toolBar";
    settings.appendChild(toolBar);

    downloadButton = document.createElement("embed");
    downloadButton.src = "images/download.svg";
    downloadButton.type = "image/svg+xml";
    downloadButton.width = "32";
    downloadButton.height = "32";
    toolBar.appendChild(downloadButton);

    stepController = document.createElement("div");
    stepController.id = "stepController"
    settings.appendChild(stepController);

    seekBar = document.createElement("input");
    seekBar.type = "range";
    seekBar.id = "seekbar";
    seekBar.value = 0;
    settings.appendChild(seekBar);

    stepInfo = document.createElement("div");
    stepInfo.id = "stepInfo";
    stepInfo.innerHTML = "0/0";
    stepController.appendChild(stepInfo);

    playButton = document.createElement("button");
    playButton.class = "playButton";
    playButton.setAttribute("class", "pause");
    playButton.value = "play";
    playButton.onclick = e => {
        if (playButton.value == "play") {
            playButton.setAttribute("class", "play");
            playButton.value = "pause";
        } else {
            playButton.setAttribute("class", "pause");
            playButton.value = "play";
        }
    }
    stepController.appendChild(playButton)

    buttonMulti = document.createElement("button");
    buttonMulti.id = "buttonMulti";
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
    stepController.appendChild(buttonMulti);

    logger = document.createElement("div");
    logger.id = "logger";
    panel.appendChild(logger);
}

var statusBarMap = {};

function addPlayerStatus(player) {
    let statusBar = document.createElement("div");
    statusBar.id = "statusBar" + player.seq;
    status.appendChild(statusBar);
    $('#'+statusBar.id).load('./html/statusBar.html', () => {
        $('#'+statusBar.id).children(".superDiv").children(".name").text(player.name);
        $('#'+statusBar.id).children(".superDiv").children(".picture").attr({
            "src": player.path
        });
        $('#'+statusBar.id).children(".superDiv").css({
            "border-color": player.user == 111 ? "#0000ff" : player.user == 222 ? "#ff0000" : player.user == 333 ? "#ffff00" : "#00ff00"
        });
        $('#'+statusBar.id).children(".superDiv").children(".realBlood").css({
            "width" : player.hp / player.totalHp * 200
        });
        $('#'+statusBar.id).children(".superDiv").children(".blood").text(player.hp+"/"+player.totalHp);
    });
    statusBarMap[player.seq] = statusBar;
}

function setPlayerStatus(player) {
    if (player.seq in statusBarMap){
        let statusBar = statusBarMap[player.seq];
        $('#'+statusBar.id).children(".superDiv").children(".realBlood").css({
            "width" : player.hp / player.totalHp * 200
        });
        $('#'+statusBar.id).children(".superDiv").children(".blood").text(player.hp+"/"+player.totalHp);
        if (player.status == 1){
            $('#'+statusBar.id).children(".superDiv").css({
                opacity: 0.5
            });
        } else {
            $('#'+statusBar.id).children(".superDiv").css({
                opacity: 1
            });
        }
    } else {
        addPlayerStatus(player);
    }
}

export function renderDebug(currentFrame, step) {
    if (!isDebug) {
        return;
    }
    mouseCtx.fillStyle = "rgb(250, 250, 250)";
    mouseCtx.font = 32*0.4 + "px Helvetica";
    mouseCtx.textAlign = "left";
    mouseCtx.textBaseline = "top";
    mouseCtx.fillText("x: " + mousex, 32, 32);
    mouseCtx.fillText("y: " + mousey, 32*2.2, 32);
    mouseCtx.fillText("X: " + mouseX, 32, 32*1.5);
    mouseCtx.fillText("Y: " + mouseY, 32*2.2, 32*1.5);
    mouseCtx.fillText("Step: " + step, 32, 32*2);
    mouseCtx.fillText("Frame: " + currentFrame, 32, 32*2.5);
}

export function renderMouse() {
    mouseCanvas.height = mouseCanvas.height;
    drawFill("rgb(255,183,0,0.4)", mouseX, mouseY, mouseCtx);
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
        }, 2000);
    });
}

export async function startAndGet() {
    return startNewGame().then(id => {
        return getGameResult(id);
    });
}

export function updateObjects(step, frameIndex) {
    if (step >= gameResult.totalSteps || step < 0 || (step == gameResult.totalSteps-1 && frameIndex != 0))
        return;

    // players part
    let lastPlayers = gameResult.steps[step].players;
    for (var seq in lastPlayers) {
        if (frameIndex == 0){
            let player = objects.Player.getPlayerBySeq(seq);
            if (player == null){
                player = new objects.Player(lastPlayers[seq].id, playerImgMap[lastPlayers[seq].userId], gridSize, seq, lastPlayers[seq].x, lastPlayers[seq].y, lastPlayers[seq].userId, lastPlayers[seq].hp, lastPlayers[seq].hp);
                objects.Player.register(player);
            }
            player.status = lastPlayers[seq].status;
            player.hp = lastPlayers[seq].hp;
            player.X = lastPlayers[seq].x;
            player.Y = lastPlayers[seq].y;
        }else {
            // console.log(gameResult);
            // console.log(step);
            let nextPlayers = gameResult.steps[step+1].players;
            if (seq in nextPlayers){
                let player = objects.Player.getPlayerBySeq(seq);
                if (player == null){
                    player = new objects.Player(lastPlayers[seq].id, playerImgMap[lastPlayers[seq].userId], gridSize, seq, lastPlayers[seq].x, lastPlayers[seq].y, lastPlayers[seq].userId, lastPlayers[seq].totalHp, lastPlayers[seq].hp);
                    objects.Player.register(player);
                }
                player.X = lastPlayers[seq].x + (nextPlayers[seq].x - lastPlayers[seq].x) * frameIndex / Math.floor(frame / multiple);
                player.Y = lastPlayers[seq].y + (nextPlayers[seq].y - lastPlayers[seq].y) * frameIndex / Math.floor(frame / multiple);
            }
        }
        //status
        let player = objects.Player.getPlayerBySeq(seq);
        setPlayerStatus(player);
    }

    if (frameIndex != 0) return;

        // flyer part
    let flyers = gameResult.steps[step].flyers;
    for (var seq in flyers){
        let flyer = flyers[seq];
        let flyerObject = objects.Flyer.getFlyerBySeq(seq);
        // console.log(flyerObject);
        if (flyerObject == null){
            let degree = Math.asin((flyer.targetY - flyer.originY)/Math.sqrt(Math.pow(flyer.targetX - flyer.originX, 2) + Math.pow(flyer.targetY - flyer.originY, 2)));
            if (flyer.targetX - flyer.originX < 0)
                degree = Math.PI - degree;
            let png;
            if (objects.Player.getPlayerBySeq(flyer.owner).user == 111)
                png = "images/flyer1.png";
            else if (objects.Player.getPlayerBySeq(flyer.owner).user == 222)
                png = "images/flyer2.png";
            else if (objects.Player.getPlayerBySeq(flyer.owner).user == 333)
                png = "images/flyer3.png";
            else
                png = "images/flyer4.png";
            flyerObject = new objects.Flyer("飞行", png, gridSize, seq, 0, flyer.x, flyer.y, Math.cos(degree), Math.sin(degree), flyer.speed*gridSize/frame);
            objects.Flyer.register(flyerObject);
        }else{
            flyerObject.x = flyer.px;
            flyerObject.y = flyer.py;
            flyerObject.X = flyer.x;
            flyerObject.Y = flyer.y;
            if (flyer.status == 2)
                flyerObject.finish();
        }
    }

}

// export function updateFlyers(step, frameIndex) {
//     if (step >= gameResult.totalSteps || step < 0 || (step == gameResult.totalSteps-1 && frameIndex != 0))
//         return;

//     // flyer part
//     let flyers = gameResult.steps[step].flyers;
//     for (var seq in flyers){
//         let flyer = flyers[seq];
//         // if (flyer.status == 2)
//         //     drawGif(initImage("images/attack.png"), flyer.px/gridSize, flyer.py/gridSize, 15, gridSize, 15, 1);
//         // else{
//             let degree = Math.asin((flyer.targetY - flyer.originY)/Math.sqrt(Math.pow(flyer.targetX - flyer.originX, 2) + Math.pow(flyer.targetY - flyer.originY, 2)));
//             if (flyer.targetX - flyer.originX < 0)
//                 degree = Math.PI - degree;
//             drawImage(initImage("images/flyer.png"), flyer.px/gridSize, flyer.py/gridSize, degree);

//         // }
//     }
// }