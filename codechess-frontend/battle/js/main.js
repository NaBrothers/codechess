import * as objects from './objects.js'
import * as utils from './utils.js'
import {multiple, playButton, seekBar, stepInfo} from "./utils.js"
import {gridSize, gridX, gridY, height, width, treeDensity, frame, fps, fpsInterval, isDebug, grassImgPath, treeImgPath, heroImgPath} from './const.js'



for (var i = 0; i < gridX; i++){
    for (var j = 0; j < gridY; j++){
        let grass = new objects.Floor("草", grassImgPath, gridSize, i * gridY + j, i, j);
        objects.Floor.register(grass);
        if (i == 0||i == gridX-1||j == 0||j == gridY-1){
            let tree = new objects.Wall("树", treeImgPath, gridSize, i * gridY + j + gridX * gridY, i, j);
            objects.Wall.register(tree);
        }
    }
}

// utils.initMap(gridX, gridY, gridSize, treeDensity);

// let hero = new objects.Player("鲁尼", heroImgPath, gridSize, 3, 3, 100, 50);
// objects.Player.register(hero);
// hero = new objects.Player("鲁尼", heroImgPath, gridSize, 4, 4, 100, 100);
// objects.Player.register(hero);
// let tree = new objects.Wall("树", treeImgPath, gridSize, 3, 3);
// objects.Wall.register(tree);

let gameResult;


let currentFrame = 0;
let step = 0;
let inControl = false;

let main = function () {
    let now = Date.now();
    let delta = now - then;
    if (!inControl && playButton.value == "play" && delta > fpsInterval && (step < gameResult.totalSteps-1 || (step == gameResult.totalSteps-1 && currentFrame == 0))) {
        utils.updateObjects(step, currentFrame);
        objects.Object.render();
        utils.renderMouse();
        utils.renderDebug(currentFrame, step);
        then = now - delta % fpsInterval;
        if (step == gameResult.totalSteps-1 && currentFrame == 0){
            playButton.setAttribute("class", "play");
            playButton.value = "pause";
        }
        else
            currentFrame++;
        if (currentFrame >= Math.floor(frame / multiple)) {
            currentFrame = 0;
            step++;
            seekBar.value = step;
        }
        stepInfo.innerText = seekBar.value + "/" + gameResult.steps.length;
    } else if (playButton.value == "pause" && delta > fpsInterval) {
        objects.Object.render();
        utils.renderMouse();
        utils.renderDebug(currentFrame, step);
        then = now - delta % fpsInterval;
    }
    // Request to do this again ASAP
    requestAnimationFrame(main);
};





let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
let then = Date.now();
utils.startAndGet().then((data) => {
    gameResult = data;
    seekBar.onclick = () => {
        step = parseInt(seekBar.value);
        currentFrame = 0;
        inControl = false;
    };
    seekBar.oninput = () => {
        inControl = true;
        utils.updateObjects(seekBar.value, 0);
        objects.Object.render();
        utils.renderDebug(0, seekBar.value);
        stepInfo.innerText = seekBar.value + "/" + gameResult.steps.length;
    }
    stepInfo.innerText = step + "/" + gameResult.steps.length;
    main();
});

