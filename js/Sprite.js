"use strict";

function valorClock(){
    var count;
    console.log("2");
    if(document.getElementById('difficulty').value =="Easy"){
        window.localStorage.setItem("count","1");
        count=250;
        console.log("facil");
    }
    if(document.getElementById('difficulty').value =="Medium"){
        count=180;
        window.localStorage.setItem("count","2");
        console.log("medio");
    }
    if(document.getElementById('difficulty').value =="Hard"){
        count=120;
        window.localStorage.setItem("count","3");
        console.log("dificil");
    }
    if(document.getElementById('difficulty').value == 0){
        console.log("default");
    }
}

class CarroEstacionado{
    constructor(x,y,w,h,img){
        this.x=x;
        this.y=y;
        this.width = w;
        this.height = h;
        this.img=img;
        this.angle=0;
        this.speed=5;
        this.mod=0;

        this.imageData = this.getImageData(img);
    }

    print(){
        console.log("CARRO");
        console.log(this.x);
        console.log(this.img);
    }

    getImageData(img){

        var canvasnova = document.createElement("canvas");
        canvasnova.width = this.width;
        canvasnova.height = this.height;

        var ctx = canvasnova.getContext("2d");
        ctx.drawImage(img, 0, 0, this.width, this.height);

        return ctx.getImageData(0, 0, this.width, this.height);
    }

    draw(ctx)
    {
        ctx.drawImage(this.img,this.x, this.y, this.width, this.height);
        //ctx.putImageData(this.imageData, this.x, this.y);
    }

    clear(ctx)
    {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
}


class CarroPlayer {
    constructor(x, y, w, h, image) {
        //posição e movimento

        this.mod = 0;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.speed = 5;
        this.img = image;
        this.finalangle=0;
        this.angle=0;

        //cantos da imagem que interessam para a colisão pixel a pixel
        this.xcse = x+28;//x do canto superior esquerdo inicial
        this.ycse = y;//y do canto superior esquerdo inicial

        this.xcsd = x+75;//x do canto superior direito inicial
        this.ycsd = y;//y do canto superior direito inicial

        this.xcie = x+28;//x do canto inferior esquerdo inicial
        this.ycie = y+this.height;//y do canto inferior esquerdo inicial

        this.xcid = x+75;//x do canto inferior direito inicial
        this.ycid = y+this.height;//y do canto inferior direito inicial

        //imagem
        this.imageData = this.getImageData(image);

    }

    draw(ctx) {
        ctx.putImageData(this.imageData, this.x, this.y);
    }

    clear(ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }

    getImageData(img) {

        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, this.width, this.height);

        var img = ctx.getImageData(0, 0, this.width, this.height);

        return img;
    }


    colided(ctx, sprite) {
        if (this.x<sprite.x + sprite.width && this.x + this.width > sprite.x && this.y < sprite.y + sprite.height && this.height + this.y > sprite.y)
        {
            console.log("COLISAO BOUNDING BOX");
            return intersectsPixelCheck(ctx, this, sprite);
        }
        else {
            return false;
        }
    }


    rotateCar() {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.save();
        ctx.translate((this.width / 2), (this.height / 2));
        ctx.rotate(Math.PI / 180 * this.angle);
        ctx.drawImage(this.img, -(this.width / 2), -(this.height / 2));
        ctx.restore();

        //console.log('trocado');
        return ctx.getImageData(0, 0, this.width, this.height);

    }

    xMax(){
        return Math.max(this.xcse, this.xcsd, this.xcie, this.xcid);
    }

    xMin(){
        return Math.min(this.xcse, this.xcsd, this.xcie, this.xcid);
    }

    yMax(){
        return Math.max(this.ycse, this.ycsd, this.ycie, this.ycid);
    }

    yMin(){
        return Math.min(this.ycse, this.ycsd, this.ycie, this.ycid);
    }

}

function rotatecorners(s1){
    var cx=s1.x+s1.width/2;//centro da imagem ->centro de rotacao
    var cy=s1.y+s1.height/2;

    //posicao dos cantos
    var xcse = s1.x+28;//x do canto superior esquerdo inicial
    var ycse = s1.y;//y do canto superior esquerdo inicial

    var xcsd = s1.x+75;//x do canto superior direito inicial
    var ycsd = s1.y;//y do canto superior direito inicial

    var xcie = s1.x+28;//x do canto inferior esquerdo inicial
    var ycie = s1.y+s1.height;//y do canto inferior esquerdo inicial

    var xcid = s1.x+75;//x do canto inferior direito inicial
    var ycid = s1.y+s1.height;//y do canto inferior direito inicial
    //-------------------------------------------------------
    //posicao relativa dos cantos
    var tempx = xcse-cx;
    var tempy= ycse-cy;
    //rodar os cantos
    var rotx = tempx*Math.cos(Math.PI/180 *s1.angle)-tempy*Math.sin(Math.PI/180 *s1.angle);
    var roty = tempx*Math.sin(Math.PI/180 *s1.angle)+tempy*Math.cos(Math.PI/180 *s1.angle);
    var x=rotx+cx;
    var y=roty+cy;
    //atualizar
    s1.xcse=x;
    s1.ycse=y;
    //-------------------------------------------------------
    //posicao relativa dos cantos
    tempx = xcsd-cx;
    tempy= ycsd-cy;
    //rodar os cantos
    rotx = tempx*Math.cos(Math.PI/180 *s1.angle)-tempy*Math.sin(Math.PI/180 *s1.angle);
    roty = tempx*Math.sin(Math.PI/180 *s1.angle)+tempy*Math.cos(Math.PI/180 *s1.angle);
    x=rotx+cx;
    y=roty+cy;
    //atualizar
    s1.xcsd=x;
    s1.ycsd=y;
    //-------------------------------------------------------
    //posicao relativa dos cantos
    tempx = xcie-cx;
    tempy= ycie-cy;
    //rodar os cantos
    rotx = tempx*Math.cos(Math.PI/180 *s1.angle)-tempy*Math.sin(Math.PI/180 *s1.angle);
    roty = tempx*Math.sin(Math.PI/180 *s1.angle)+tempy*Math.cos(Math.PI/180 *s1.angle);
    x=rotx+cx;
    y=roty+cy;
    //atualizar
    s1.xcie=x;
    s1.ycie=y;
    //-------------------------------------------------------
    //posicao relativa dos cantos
    tempx = xcid-cx;
    tempy= ycid-cy;
    //rodar os cantos
    rotx = tempx*Math.cos(Math.PI/180 *s1.angle)-tempy*Math.sin(Math.PI/180 *s1.angle);
    roty = tempx*Math.sin(Math.PI/180 *s1.angle)+tempy*Math.cos(Math.PI/180 *s1.angle);
    x=rotx+cx;
    y=roty+cy;
    //atualizar
    s1.xcid=x;
    s1.ycid=y;
}


function intersectsPixelCheck(ctx, s1, s2){
    //Obter rectangulo de interseçao

    var xMin = Math.max(s1.x, s2.x);
    var xMax = Math.min(s1.x+s1.width, s2.x + s2.width);
    var yMin = Math.max(s1.y, s2.y);
    var yMax = Math.min(s1.y+s1.width, s2.y + s2.height);
    //restringir valores para ser mais rapido
    var xminx = s1.xMin();
    var xmaxx = s1.xMax();
    var yminy = s1.yMin();
    var ymaxy = s1.yMax();

    //analizar opacidade na area da intersecao
    var xLocal, yLocal, pixelNums1,pixelNums2, pixelNum;
    var pixelPosArrayS1, pixelPosArrayS2, pixelPosArrayS3;
    var imagedatanovo = ctx.getImageData(xMin, yMin, xMax-xMin, yMin-yMax);
    for (var y = yMin; y <= yMax; y++) {
        if(y>=yminy && y<=ymaxy) {
            for (var x = xMin; x <= xMax; x++) {
                if(x>=xminx && x<=xmaxx) {
                    //console.log("COLISAO BOUNDING BOX 222222222222222222");
                    xLocal = Math.round(x - s1.x);//distancia relativa ao limite da img1
                    yLocal = Math.round(y - s1.y);
                    pixelNums1 = xLocal + yLocal * s1.width;
                    pixelPosArrayS1 = pixelNums1 * 4 + 3;//indice da opacidade do pixel na sprite 1

                    xLocal = Math.round(x - s2.x);
                    yLocal = Math.round(y - s2.y);
                    pixelNums2 = xLocal + yLocal * s2.width;
                    pixelPosArrayS2 = pixelNums2 * 4 + 3;

                    xLocal = Math.round(x - ctx.x);
                    yLocal = Math.round(y - ctx.y);
                    pixelNum = xLocal + yLocal * ctx.width;
                    pixelPosArrayS3 = pixelNum * 4 + 3;
                    var imageDatacanvas = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

                    if (s1.imageData.data[pixelPosArrayS1] != 0 && s2.imageData.data[pixelPosArrayS2] != 0
                        && s1.imageData.data[pixelPosArrayS1] != imageDatacanvas.data[pixelPosArrayS3] &&
                        s2.imageData.data[pixelPosArrayS2] != imageDatacanvas.data[pixelPosArrayS3]) {
                        //console.log("COLISAO PIXEL A PIXEL");
                        return true;
                    }
                }

            }
        }
    }
    return false;
}