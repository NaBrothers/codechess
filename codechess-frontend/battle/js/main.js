import * as objects from './objects.js'
import * as utils from './utils.js'

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

let seekBar;

let main = function () {
    let now = Date.now();
    let delta = now - then;
    if (delta > fpsInterval && (step < gameResult.totalSteps-1 || (step == gameResult.totalSteps-1 && currentFrame == 0))) {
        utils.updateObjects(step, currentFrame);
        objects.Object.render();
        utils.renderDebug(currentFrame, step);
        utils.renderMouse();
        then = now - delta % fpsInterval;
        currentFrame++;
        if (currentFrame == frame) {
            currentFrame = 0;
            step++;
            seekBar.value = step;
        }
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
    seekBar = document.getElementById("seekbar");
    seekBar.onclick = () => {
        step = parseInt(seekBar.value);
        currentFrame = 0;
    }
    main();
});

