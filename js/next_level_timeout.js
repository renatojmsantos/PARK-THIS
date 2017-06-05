"use strict";

(function()
{
    window.addEventListener("load", main);
}());

function main(){
    proximo_nivel();
}

function proximo_nivel(a) {
    logo.style.display = "block";
    tempo.style.display="block";
    level1_timeout.style.display = "block";
    back.style.display = "block";
    if(a == 1){
        next_level.style.display = "block";
    }
    else
        next_level.style.display ="none";
}


