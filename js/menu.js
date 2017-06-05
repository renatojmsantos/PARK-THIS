"use strict";

(function()
{
	window.addEventListener("load", main);
}());

function main(){
	show_menu();
	document.getElementById('music').volume = 1;
}

/* Ligacoes entre menus */

function show_menu(){
	menu.style.display = "block";
	back.style.display = "none";
	credits.style.display = "none";
	help.style.display = "none";
	classic.style.display = "none";
	timeout.style.display = "none";
	settings.style.display = "none";
}

function classic_menu(){
	menu.style.display = "none";
	back.style.display = "block";
	credits.style.display = "none";
	help.style.display = "none";
	classic.style.display = "block";
	timeout.style.display = "none";
	settings.style.display = "none";

}

function timeout_menu() {
	menu.style.display = "none";
	back.style.display = "block";
	credits.style.display = "none";
	help.style.display = "none";
	classic.style.display = "none";
	timeout.style.display = "block";
	settings.style.display = "none";

}

function help_menu() {
	menu.style.display = "none";
	back.style.display = "block";
	credits.style.display = "none";
	help.style.display = "block";
	classic.style.display = "none";
	timeout.style.display = "none";
	settings.style.display = "none";

}

function show_settings(){
	menu.style.display = "none";
	back.style.display = "block";
	credits.style.display = "none";
	help.style.display = "none";
	classic.style.display = "none";
	timeout.style.display = "none";
	settings.style.display = "block";

}

function credits_menu(){
	menu.style.display = "none";
	back.style.display = "block";
	credits.style.display = "block";
	help.style.display = "none";
	classic.style.display = "none";
	timeout.style.display = "none";
	settings.style.display = "none";
}


// Audio - musica de fundo
window.SetVolumeMusic = function(val){
    var player = document.getElementById('music');
    console.log('Before: ' + player.volume);
    player.volume = val / 100;
    console.log('After: ' + player.volume);
    document.getElementById("musicVolume").innerHTML = val + "%";
}
