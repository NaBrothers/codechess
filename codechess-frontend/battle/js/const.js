// 参数  从后端读
const gridSize = 32;
const gridX = 24;
const gridY = 24;
const height = gridX * gridSize;
const width = gridY * gridSize;
const treeDensity = 0.1;
const frame = 30;
const fps = 60;
const fpsInterval = 1000 / fps;
const isDebug = true;

const grassImgPath = "images/grass.png";
const treeImgPath = "images/tree.png";
const heroImgPath = "images/hero.png";
const monsterImgPath = "images/monster.png"

// const gameUrl = "http://codechess.online:8081/battle";
// const gameUrl = "localhost:8081/battle";
const gameUrl = "http://1.116.208.91:8081/battle"

const redHaloImgPath = "images/halo_red.png"
const blueHaloImgPath = "images/halo_blue.png"
const greenHaloImgPath = "images/halo_green.png"
const yellowHaloImgPath = "images/halo_yellow.png"

const playerImgPaths = [
    "images/P1.png",
    "images/P2.png",
    "images/P3.png",
    "images/P4.png",
    "images/P5.png",
    "images/P6.png",
    "images/P7.png",
    "images/P8.png",
    "images/P9.png",
    "images/P10.png",
]

export {gridSize, gridX, gridY, height, width, treeDensity, frame, fps, fpsInterval, isDebug, grassImgPath, treeImgPath, heroImgPath, monsterImgPath, gameUrl, redHaloImgPath, blueHaloImgPath, greenHaloImgPath, yellowHaloImgPath, playerImgPaths};
