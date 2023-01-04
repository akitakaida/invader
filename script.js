const canvas = document.getElementById("canvas");
canvas.style.border = "2px solid #999";
canvas.width = 512;
canvas.height = 512;
const ctxt = canvas.getContext("2d");
const p = 4;
const fieldX = canvas.width;
const fieldY = canvas.height;
const canvas2 = document.getElementById("canvas2");
canvas2.width = fieldX;
canvas2.height = 6 * p;
const ctxt2 = canvas2.getContext("2d");

class charactor{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.m = 0;
        this.shape = [[]];
    }
    get getX(){
        return this.x;
    }
    get getY(){
        return this.y;
    }
    get getMode(){
        return this.m;
    }
    write(){
        for (let i = 0; i < this.shape[this.m].length; i++) {
            for (let j = 0; j < this.shape[this.m][i].length; j++) {
                if(this.shape[this.m][i][j] === 1){
                    ctxt.fillRect(this.x + p * j, this.y + p * i, p, p);
                    ctxt.fillStyle = "#fff"
                }
            }
        }
    }
    
}
//自機（砲台）
class fort extends charactor {
    constructor(x, y) {
        super(x, y);
        this.shape = [
            //通常時
            [[0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1]],
            //撃墜時１
            [[0, 0, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1]],
            //撃墜時2
            [[1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1]],
            [[0]]
        ]
    }
    move(x) {
        if (this.x + x < 0 || this.x + x + 3 * p > fieldX) return;
        this.x += x;
    }
    fire() {
        if (fortbeam) return;
        beams[0] = new beam(this.x + 3 * p, this.y, 0, 0);
        fortbeam = true;
    }
    collision() {
        if (this.m != 0) this.breaking();
        for(let i = 1; i < beams.length; i++){
            if(beams[i] === 0) continue;
            if (beams[i].getX <= this.x + this.shape[0][0].length * p
                && beams[i].getX >= this.x
                && beams[i].getY >= this.y
                && beams[i].getY <= this.y + this.shape[0].length * p) {
                this.breaking();
                beams[i] = 0;
                score -= 100;
                }
        }
    }
    breaking() {
        if (this.m < 3) {
            this.m++;
        } else {
            this.m = 3;
            this.write();
            GAMEMODE = GAMEOVER();
        }
    }

}
//敵（Invader）
class enemy extends charactor{
    constructor(x, y, i){
        super(x, y);
        this.index = i;
        switch(this.index % 5){
            case 0:
                this.point = 40;
                break;
            case 1:
            case 2:
                this.point = 20;
                break;
            default:
                this.point = 10;
        }
        this.shape = [
            //通常時
            [[0, 0, 1, 0, 0, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 1]],
            //撃墜時１
            [[0, 0, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 0, 0, 1, 1, 0],
            [1, 1, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 1, 1],
            [0, 1, 1, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 1, 1, 0, 0]],
            //撃墜時２
            [[1, 0, 1, 0, 0, 1, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0],
            [1, 0, 1, 0, 0, 1, 0, 1]],
            //撃墜時３
            [[1, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 1]],
            [[0]]
        ];
    }
    collision() {
        if (this.m != 0) this.breaking();
        if (beams[0].getX >= this.x
            && beams[0].getX <= this.x + this.shape[this.m][0].length * p
            && beams[0].getY >= this.y 
            && beams[0].getY <= this.y + this.shape[this.m].length * p) {
            this.breaking();
            count++;
            score += this.point;
            beams[0] = 0;
        }
    }
    breaking() {
        if(this.m < 3){
            this.m ++;
        }else{
            this.m = 4;
            enemies[this.index] = 0;
        }
    }
    move(){
        switch(d){
            case "right":
                this.x += p;
                break;
            case "rdown":
            case "ldown":
                this.y += p;
                break;
            case "left":
                this.x -= p;
                break;
        }
    }
    fire(){
        if (beams[this.index + 1] === 0) beams[this.index + 1] = new beam(this.x, this.y + this.shape[0].length, 1, this.index + 1);
    }
}
class UFO extends charactor {
    constructor(x, y, i) {
        super(x, y);
        //index = 1 は左から登場、-1は右から登場
        this.index = i;
        this.point = getRundom(1, 10) * 50;
        this.shape = [
            //通常時
            [[0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 0, 0, 1, 1, 0]],
            //撃墜時１
            [[0, 0, 0, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]],
            //撃墜時２
            [[0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]],
            //撃墜時３
            [[1, 1, 0, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 1, 1]],
            //登場していないとき
            [[0]]
        ]

    }
    collision() {
        if(this.m >= 4) this.showPoint();
        if(this.m != 0) this.breaking();
        if (beams[0].getX >= this.x
            &&beams[0].getX <= this.x + this.shape[this.m][0] * p
            && beams[0].getY >= this.y
            && beams[0].getY <= this.y + this.shape[this.m].length * p) {
            this.breaking();
            beams[0] = 0;
            score += this.point;
            UFOflame = f;
        }
    }
    move(){
        if(this.m >= 4) return;
        this.x += p * this.index;
        if(this.x <= 0 || this.x >= fieldX) this.m = 4;
    };
    breaking() {
        if (this.m < 4) {
            this.m++;
        }
    }
    showPoint(){
        if(f <= UFOflame + 20) ctxt.fillText(this.point, this.x + 4 * p, this.y + 4 * p);
        if(f > UFOflame + 20) this.y = -20 * p;
    }
}
//トーチカ
class sheild extends charactor{
    constructor(x, y) {
        super(x, y);
        this.shape = [
            [[0 , 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1]]          
        ]
    }
    collision() {
        //ビームにあたったとき
        for (let i = 0; i < beams.length; i++) {
            if (beams[i] === 0) continue;
            if (beams[i].getX <= this.x + this.shape[0][0].length * p
                && beams[i].getX >= this.x
                && beams[i].getY >= this.y
                && beams[i].getY <= this.y + this.shape[0].length * p){
                let x = Math.floor(Math.abs(beams[i].getX - this.x) / p);
                let y = Math.floor(Math.abs(beams[i].getY - this.y) / p);
                if(x > 11) x = 11;
                if(y > 11) y = 11;
                if (this.shape[0][y][x] === 1){
                    this.shape[0][y][x] = 0;
                    beams[i] = 0;
                } 
            }
        }
        //invaderにあたったとき
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] === 0) continue;
            if (enemies[i].getX <= this.x + this.shape[0][0].length * p
                && enemies[i].getX >= this.x
                && enemies[i].getY + 6 * p >= this.y
                && enemies[i].getY + 6 * p <= this.y + this.shape[0].length * p){
                let x = Math.floor(Math.abs(enemies[i].getX + 3 * p - this.x) / p);
                let y = Math.floor(Math.abs(enemies[i].getY + 6 * p - this.y) / p);
                if(x > 11) x = 11;
                if(y > 11) y = 11;
                if (this.shape[0][y][x] === 1){
                    this.shape[0][y][x] = 0;
                } 
            }
        }
    }

}
//ビーム
class beam{
    constructor(x, y, mode, i){
        this.x = x;
        this.y = y;
        this.mode = mode;
        this.move();
        this.index = i;
    }
    get getX(){
        return this.x;
    }
    get getY(){
        return this.y;
    }
    set setX(x){
        this.x = x;
    }
    set setY(y){
        this.y = y;
    }
    writeBeam(){
        ctxt.fillRect(this.x, this.y, p / 2, p * 2);
    }
    move(){
        if(this.y < fieldY && this.y > 0){
            switch(this.mode){
                case 0:
                    this.y -= p;
                    break;
                case 1 :
                    this.y += p;
                    break;
            }
            this.writeBeam();
        }else if(this.mode === 0){
            fortbeam = false;
        }else{
            beams[this.index] = 0;
        }
    }
}

//ｎ以上ｍ以下の乱数を生成
function getRundom(n, m) {
    for (let i = 0; i < 5; i++) {
        let num = Math.floor(Math.random() * (m + 1 - n)) + n;
        return num;
    }
}

//スコアの記載
function writeScore() {
    let scoreTxt = document.getElementById("score");
    scoreTxt.innerHTML = score;
    let hiScoreTxt = document.getElementById("hi-score");
    hiScoreTxt.innerHTML = hiScore;
}

//Invaderがどの向きに動くか判定
function enemiesMoveCheck(){
    if (d === "ldown") {
        d = "right";
        return;
    }
    if(d === "rdown"){
        d = "left";
        return;
    } 
    enemies.forEach((e)=>{
        if(e.getX + 7 * p >= fieldX){
            d = "rdown";
        }
        if(e.getX <= 0){
            d = "ldown";
        }
    });
}
//UFOを精製
function createUFO(){
    if(UFO1.getMode != 4) return;
    let index = getRundom(0, 9);
    if(index < 5){
        //左から登場
        UFO1 = new UFO(0, 0, 1);
    }else{
        UFO1 = new UFO(fieldX - 8 * p, 0, -1);
    }
}
//どのInvaderがビームを打つか
function enemiesFireCheck() {
    let fire = getRundom(0, enemies.length * 2);
    if (fire < enemies.length && enemies[fire] != 0) enemies[fire].fire();
}
//キーボード入力の規定
document.addEventListener('keydown', keydown_ivent);
document.addEventListener('keypress', keypress_ivent);
function keydown_ivent(e) {
    if(GAMEMODE != 1 ) return;
    switch (e.key) {
        case 'ArrowLeft':
            fort1.move(p * -1);
            break;
        case 'ArrowRight':
            fort1.move(p);
            break;
        default:
            break;
    }
    return false;
}
function keypress_ivent(e){
    switch (e.key) {
        case ' ':
            if (GAMEMODE != 1) return;
            fort1.fire();
            break;
        case "p":
            pause();
            break;
        default:
            break;
    }
    return false;    
}

//スタート処理
function start(){
    let startWrap = document.getElementById("start-wrap");
    score = 0;
    life = 2;
    for (i = 0; (fieldX / 4 - 12 * p) / 2 + fieldX / 4 * i < fieldX; i++) {
        sheilds[i] = new sheild((fieldX / 4 - 12 * p) / 2 + fieldX / 4 * i, fieldY - p * 24);
    }
    startWrap.style.display = "none";
    main();
}
//Pauseモードの処理
function pause(){
    let pauseWrap = document.getElementById("pause-wrap");
    if (GAMEMODE === 1) {
        pauseWrap.style.display = "inline";
        GAMEMODE = 9;
    } else {
        pauseWrap.style.display = "none";
        GAMEMODE = 1;
    }
}
//Continueモードから戻る処理
function cont(){
    let contWrap = document.getElementById("continue-wrap");
    if(GAMEMODE === 3){
        life--;
        GAMEMODE = 9;
        for(let i = 0; i < beams.length; i++){
            beams[i] = 0;
        }
        contWrap.style.display = "inline";
    }else{
        GAMEMODE = 1
        contWrap.style.display = "none";
        fort1 = new fort(fieldX/2, fieldY - 6 * p);
    }
}
//GAMEOVERの判定
function GAMEOVER(){
    if(life <= 0) {
        return 4;
    }
    enemies.forEach((e)=>{
        if(e != 0){
            if(e.getY + 6 * p >= fieldY - p * 10){
                return 4;
            }
        }
    });
    return 3;
}
//残機の表示
function writeLife(){
    ctxt2.clearRect(0,0, fieldX, 6 * p);
    for(let l = 0; l < life; l++){
        ctxt2.fillRect(l * 7 * p + 2 * p, 0, 2 * p, 2 * p);
        ctxt2.fillRect(l * 7 * p, 2 * p, 6 * p, 4 * p);
        ctxt2.fillStyle = "#fff";
    }
}
//クリア時のカウント
function writeCount(){
    let c = document.getElementById("cnt");
    c.innerText = count;
}
//線画
function writeAll(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    ctxt.fillRect(0, fieldY - 10 * p, fieldY, p / 2);
    beams.forEach((e) => {
        if (e != 0) e.move();
    });
    if (beams[0] === 0) fortbeam = false;
    enemies.forEach((e) => {
        if (e != 0) {
            e.write();
            e.collision();
            if (f % (enemies.length - count) === 0) e.move();
        };
    });
    UFO1.write();
    UFO1.collision();
    fort1.write();
    fort1.collision();
    sheilds.forEach((e) => {
        e.write();
        e.collision();
    });
}
//各変数の設定
let enemies = new Array(50);
let UFO1 = new UFO(fieldX, 0, 1);
let beams = new Array(51);
let fort1;
let sheilds = new Array(4)
let life, fortbeam, UFOflame, d, score, hiScore, f = 0, count;
let GAMEMODE = 0;

//メインループ
function main() {
    if (f >= 100000000) f = 0;
    switch(GAMEMODE){
        case 0:
            //スタート時用のGAMEMODE
            beams[0] = 0;
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 5; j++) {
                    enemies[i * 5 + j] = new enemy(4 * p + 12 * i * p, (10 + j * 6) * p, i * 5 + j);
                    beams[i * 5 + j + 1] = 0;
                }
            }
            fort1 = new fort(fieldX / 2, fieldY - 6 * p);
            fortbeam = false;
            UFOflame = 0;
            d = "right";
            hiScore = 0;
            f = 0;
            count = 0;
            GAMEMODE = 1;
            break;
        case 1:
            //ゲーム中のGAMEMODE
            f++;
            writeAll();
            if (f % (enemies.length - count) === 0) {
                enemiesMoveCheck();
                enemiesFireCheck();
            }
            if( f % (getRundom(1,5) * 4000) === 0) createUFO();
            if( f % 5 === 0) UFO1.move();
            writeScore();
            if(count >= enemies.length) GAMEMODE = 5;
            break;
        case 3:
            //自機が撃破されたときのGAMEMODE
            cont();
            break;
        case 4:
            //GAMEOVER
            if(hiScore < score) hiScore = score;
            let startWrap = document.getElementById("start-wrap");
            startWrap.style.display = "inline";
            let showScore = document.getElementById("showscore");
            showScore.innerHTML = `<p>GAME OVER<br>SCORE: ${score}<br>Hi SCORE: ${hiScore}</p>`
            GAMEMODE = 0;
            return;
        case 5:
            //CLEAR
            let clearWrap = document.getElementById("clear-wrap");
            clearWrap.style.display = "inline"
            count = 10;
            writeCount();
            GAMEMODE = 6;
            setTimeout(main, 1000);
            return;
        case 6: 
            //CLEAR後、再スタート
            count--;
            writeAll();
            writeCount();
            if(count <= 0){
                let clearWrap = document.getElementById("clear-wrap");
                clearWrap.style.display = "none";
                GAMEMODE = 0
            }
            setTimeout(main, 1000);
            return;
        case 9:
            //Pause時のGAMEMODE
            break;
    }
    writeLife();
    GAMEOVER();
    requestAnimationFrame(main);
}