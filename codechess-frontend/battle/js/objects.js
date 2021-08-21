import * as utils from './utils.js'
import {gridSize, gridX, gridY, height, width, treeDensity, frame, fps, fpsInterval, isDebug, grassImgPath, treeImgPath, heroImgPath, gameUrl, redHaloImgPath, blueHaloImgPath, greenHaloImgPath, yellowHaloImgPath} from './const.js'

utils.init();

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

export class Object {
    constructor(name, path, size=gridSize, seq) {
        this.X = 0;
        this.Y = 0;
        this.name = name;
        this.path = path;
        this.image = utils.initImage(path);
        this.size = size;

        this.seq = seq;
    }

    static objectMap = {};

    // static currentSeq = 0;

    static layerIndex = -1;

    static maxGettableLayer = 3;

    static clear() {
        for (var i in this.objectMap){
            if (i <= this.maxGettableLayer) continue;
            for (var j in this.objectMap[i])
                delete this.objectMap[i][j];
        }
    }



    static register(o) {
        // o.seq = Object.currentSeq++;
        if (!(this.layerIndex in this.objectMap)){
            this.objectMap[this.layerIndex] = {};
        }
        this.objectMap[this.layerIndex][o.seq] = o;
        // console.log(this.objectMap);
    }

    static render() {
        for (let layer in this.objectMap) {
            for (let seq in this.objectMap[layer]) {
                let currentObject = this.objectMap[layer][seq];
                currentObject.draw();
            }
        }
        for (let layer in this.objectMap) {
            for (let seq in this.objectMap[layer]) {
                let currentObject = this.objectMap[layer][seq];
                if (currentObject instanceof Player) {
                    utils.drawBlood(currentObject);
                }
            }
        }
    }

    static getObject(X, Y) {
        let currentObject;

        for (let layer in this.objectMap) {
            if (layer > this.maxGettableLayer) break;
            for (let seq in this.objectMap[layer]) {
                let tmpObject = this.objectMap[layer][seq];
                if (tmpObject.X == X && tmpObject.Y == Y)
                    currentObject = tmpObject;
            }
        }

        return currentObject;
    }

    static getObjectBySeq(seq, layer) {
        if (!(layer in Object.objectMap) || !(seq in Object.objectMap[layer]))
            return null;
        return Object.objectMap[layer][seq];
    }

    draw() {}
}

class Effect extends Object {
    constructor(name, path, size, seq, id) {
        super(name, path, size, seq);
        this.status = 0;
        this.id = id;
    }

    static layerIndex = 5;

    static getEffectBySeq(seq){
        return super.getObjectBySeq(seq, this.layerIndex);
    }

    draw() {
        if (this.status == 0) {
            // utils.printAction(this.id,"释放技能" + "<span class='highlight'>" + this.name + "</span>");
            this.status = 1;
        }
        if (this.status == 1 && this.image.finished) {
            this.status = 2;
            // utils.printAction(this.id,"结束" + "<span class='highlight'>" + this.name + "</span>");
            delete Object.objectMap[Effect.layerIndex][this.seq];
        }
    }

    finish() {
        this.image.finished = true;
    }
}

export class Attack extends Effect {
    constructor(name, path, size, seq, id, X, Y, frames, duration) {
        super(name, path, 32, seq, id);
        this.frames = frames;
        this.duration = duration;
        this.X = X;
        this.Y = Y;
    }

    draw() {
        super.draw();
        utils.drawAttack(this);
    }

    setDuration(duration) {
        this.duration = duration;
    }
}

export class Flyer extends Effect {
    // speed unit: pixel per frame
    constructor(name, path, size, seq, id, X, Y, vector_x, vector_y, speed) {
        super(name, path, size, seq, id);
        this.x = utils.X2x(X);
        this.y = utils.X2x(Y);
        this.vector = {};
        this.vector.x = vector_x;
        this.vector.y = vector_y;
        this.speed = speed;
    }

    static getFlyerBySeq(seq) {
        return super.getEffectBySeq(seq);
    }

    draw() {
        super.draw();
        utils.drawFlyer(this);
    }

    setSpeed(speed){
        this.speed = speed;
    }
}



class Entity extends Object {
    constructor(name, path, size=gridSize, seq) {
        super(name, path, size, seq);
    }
    
    static layerIndex = 3;

    static getEntityBySeq(seq){
        return super.getObjectBySeq(seq, this.layerIndex);
    }

    draw() {
        utils.drawImage(this.image, this.X, this.Y);
    }
}

export class Player extends Entity {
    constructor(name, path, size, seq, X, Y, user, totalHp, hp=totalHp) {
        super(name, path, size, seq);
        this.X = X;
        this.Y = Y;
        this.totalHp = totalHp;
        this.hp = hp;
        this.user = user;
        this.status = 0;
        this.dieOri = Math.random() < 0.5;
    }

    static getPlayerBySeq(seq) {
        return super.getEntityBySeq(seq);
    }

    draw() {
        let haloImgPath = this.user == 111 ? blueHaloImgPath : this.user == 222 ? redHaloImgPath : this.user == 333 ? yellowHaloImgPath : greenHaloImgPath;
        utils.drawImage(utils.initImage(haloImgPath), this.X, this.Y+0.35);
        utils.drawImage(this.image, this.X, this.Y, this.status==0?0:this.dieOri?Math.PI/2:-Math.PI/2);
        // console.log("x: "+this.X+" y: "+this.Y);
    }

}

export class Wall extends Entity {
    constructor(name, path, size=gridSize, seq, X, Y) {
        super(name, path, size, seq);
        this.X = X;
        this.Y = Y;
    }
}

export class Floor extends Object {
    constructor(name, path, size=gridSize, seq, X, Y) {
        super(name, path, size, seq);
        this.X = X;
        this.Y = Y;
    }

    static layerIndex = 1;

    draw() {
        utils.drawImage(this.image, this.X, this.Y);
    }
}
