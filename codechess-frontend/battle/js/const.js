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

const gameUrl = "http://codechess.online:8081/battle";

export {gridSize, gridX, gridY, height, width, treeDensity, frame, fps, fpsInterval, isDebug, grassImgPath, treeImgPath, heroImgPath, gameUrl};