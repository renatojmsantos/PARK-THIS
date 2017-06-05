(function()
{
    window.addEventListener("load", main);
}());

var spriteArray;
var sArray;
var colisao;
var contain;
var inCanvas=true;
var nCheckpoint=0;
var nMaxCheckPoints=3;
var ctx;

function main() {
    var canvas = document.getElementById("level3_classico");
    var context = canvas.getContext("2d");
    ctx=context;
    canvas.addEventListener("loadEnd", startUp);
    load(context);
    function startUp(event) {
        spriteArray = event.spriteArray;
        sArray = event.sArray;
        //Handler das Keys
        window.addEventListener('keydown', keyHandlerDown, true);
        window.addEventListener('keyup', keyHandlerUP, true);
        startAnim(context, spriteArray, sArray);
    }
}

//init: carregamento de componentes
function load(context)
{
    var nLoad = 0;
    var totLoad = 4;
    var spriteArray = new Array();
    var sArray = new Array(2);

    //carregar imagens e criar sprites
    var img = new Image();
    img.addEventListener("load", imgLoadedHandler);
    img.id = "carroestacionado1";
    img.src = "../recursos/carroest12.png";  //dá ordem de carregamento da imagem


    var img1 = new Image();
    img1.addEventListener("load", imgLoadedHandler);
    img1.id = "carroestacionado2";
    img1.src = "../recursos/carroest2.png";


    var img2 = new Image();
    img2.addEventListener("load", imgLoadedHandler);
    img2.id = "player1";
    img2.src = "../recursos/player1.png";

    var img3 = new Image();
    img3.addEventListener("load", imgLoadedHandler);
    img3.id = "areaest";
    img3.src = "../recursos/areaest.png";

    function imgLoadedHandler(ev)
    {
        var img = ev.target;


        switch(img.id){
            case "carroestacionado1":
                var sp1 = new CarroEstacionado(20, 20,50,100, img);
                var sp2 =new CarroEstacionado(685,20,50,100,img);
                var sp3 =new CarroEstacionado(310, 140,50,100,img);
                spriteArray[0] = sp1;
                spriteArray[1] = sp2;
                spriteArray[2] = sp3;
                break;
            case "carroestacionado2":
                var sp4 =new CarroEstacionado(375, 140,50,100,img);
                var sp5 =new CarroEstacionado(683, 154,50,100,img);

                spriteArray[3] = sp4;
                spriteArray[4] = sp5;

                break;
            case "player1":
                var splayer = new CarroPlayer(70,280,100,100,img);
                sArray[0]=splayer;
                console.log(sArray[0]);
                break;
            case "areaest":
                var area = new CarroEstacionado(433.5,135,60,110,img);//Talvez criar AreaEst class
                sArray[1]=area;
                break;
        }
        nLoad++;

        if (nLoad == totLoad) {
            var ev2 = new Event("loadEnd");
            ev2.spriteArray = spriteArray;
            ev2.sArray = sArray;
            context.canvas.dispatchEvent(ev2);
        }
    }
}

function startAnim(ctx, spArray, sArray)
{

    draw(ctx, spArray, sArray);
    animLoop(ctx, spArray, sArray);
}

//desenhar sprites
function draw(context, spriteArray,sArray)
{
    var dim1 = spriteArray.length;

    sArray[0].draw(context);
    sArray[1].draw(context);//area estacionamento
    for (var i = 0; i < dim1; i++){
        spriteArray[i].draw(context);
    }

}

function animLoop(ctx, spArray, sArray)
{
    var al = function(time)
    {
        animLoop(ctx, spArray, sArray);
    }
    var reqID = window.requestAnimationFrame(al);
    render(ctx, spArray, sArray, reqID);

}

//resedenho, actualizações, ...
function render(ctx, spArray, sArray, reqID)
{
    var cw = ctx.canvas.width;
    var ch = ctx.canvas.height;

    //apagar canvas
    //Se nao colisao
    if (inCanvas && !colisao&&(nCheckpoint!=nMaxCheckPoints))
    {
        ctx.clearRect(0, 0, cw, ch);

        draw(ctx, spArray, sArray);
        //verificar a  colisao
        checkCollision(ctx);
        checkINcanvas(cw,ch);
        //verificar se dentro de area
        contains(sArray[0],sArray[1]);
        mensCheckPoint(ctx);
        if(contain){
            while(nCheckpoint<nMaxCheckPoints){
                nCheckpoint++;
                changeCheckPoint(nCheckpoint);
                break;
            }
        }
        mensCheckPoint(ctx);

        if(nCheckpoint==nMaxCheckPoints) {
            mensCheckPoint(ctx);
            mensMapCompleted(ctx, ch, cw);
        }
    }
    else
    {
        window.cancelAnimationFrame(reqID);
        if(nCheckpoint!=nMaxCheckPoints)
            mensGameOver(ctx, ch, cw);
    }
}


//função do Handler das Keys
function keyHandlerDown(e) {
    e = e || window.event;
    switch (e.keyCode) {
        case 37://left arrow
            sArray[0].finalangle-=10;
            break;
        case 38://up arrow
            sArray[0].mod=1;
            if(sArray[0].finalangle-sArray[0].angle>0) {
                sArray[0].angle += 5;
            }
            else if(sArray[0].finalangle-sArray[0].angle<0){
                sArray[0].angle -= 5;
            }
            atualizacoordenadas();
            sArray[0].imageData = sArray[0].rotateCar();
            rotatecorners(sArray[0]);
            break;
        case 39://right arrow
            sArray[0].finalangle+=10;
            break;
        case 40://down arrow
            sArray[0].mod=-1;
            if(sArray[0].finalangle-sArray[0].angle>0) {
                sArray[0].angle += 5;
            }
            else if(sArray[0].finalangle-sArray[0].angle<0){
                sArray[0].angle -= 5;
            }
            atualizacoordenadas();
            sArray[0].imageData = sArray[0].rotateCar();
            rotatecorners(sArray[0]);
            break;

    }
}

function keyHandlerUP(e) {
    e = e || window.event;
    switch (e.keyCode) {
        case 38://up arrow
            sArray[0].mod=0;
            break;
        case 40://down arrow
            sArray[0].mod=0;
            break;

    }
}

function atualizacoordenadas(){

    sArray[0].x += (sArray[0].speed*sArray[0].mod) * Math.cos(Math.PI/180 * (sArray[0].angle-90));
    sArray[0].y += (sArray[0].speed*sArray[0].mod) * Math.sin(Math.PI/180 * (sArray[0].angle-90));

}

//funcao colisão

function checkCollision(ctx){
    var dim1 = spriteArray.length;
    colisao=false;
    for (var i = 0; i < dim1; i++){
        if(sArray[0].colided(ctx, spriteArray[i])){
            colisao= true;
            return;
        }
    }
}

function contains(carro, area){
    contain=false;
    if(carro.xMin()>=area.x && carro.xMax()<=area.x+area.width && carro.yMin()>=area.y && carro.yMax()<=area.y+area.height)
    {
        contain=true;
        return;
    }
}

//funçao mensagem de colisao

function mensCheckPoint(ctx){
    ctx.font = "20px Arial";
    ctx.fillStyle = "#00ff00";
    ctx.fillText("CheckPoint: "+nCheckpoint+"/3", 150, 20);
}

function mensGameOver(ctx,ch,cw){

    ctx.fillStyle = "#999966";
    ctx.fillRect(160,ch/3-20, 450, 120);
    ctx.font = "80px Arial";
    ctx.fillStyle = "#cc0099";
    ctx.fillText("GameOver", 190, ch/2);
}

function mensMapCompleted(ctx,ch,cw){
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(160,ch/3, 450, 120);
    ctx.font = "50px Arial";
    ctx.fillStyle = "#cc0099";
    ctx.fillText("Game Completed", 210, ch/2-15);
    ctx.fillText("    Well Done!!", 200, ch/2+35);

}

function checkINcanvas(cw,ch){
    if(!((sArray[0].xMax() < cw)&&
        (sArray[0].yMax() < ch)&&
        (sArray[0].xMin() > 0)&&(sArray[0].yMin()>0)))
        inCanvas=false;
}

function changeCheckPoint(n){
    switch(n){
        case(1):
            sArray[1].x=17;
            sArray[1].y=285;
            break;
        case(2):
            sArray[1].x=177;
            sArray[1].y=135;
            break;
    }
}