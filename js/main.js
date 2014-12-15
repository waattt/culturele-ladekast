/*/////////////////////////////////////////////////////////
  MAIN.JS
  Client-side app. Ontvangt informatie van SERVER.JS (Via 
  socket.io). Daarnaast toont het ook alles op het scherm. 

  CONTENTS:
  1. Variables
  2. Socket connection
  3.

//////////////////////////////////////////////////////////*/

/*//////////////////////////////////////////////////////////
//////// 1. Defnineren van allle belangrijke vars ///////////
//////////////////////////////////////////////////////////*/

var laPin = 7; // Hier worden alle lade's aan sensoren gekoppeld

/*//////////////////////////////////////////////////////////
/////////////////// 1. Socket Connection ///////////////////
//////////////////////////////////////////////////////////*/
var socket = io.connect(location.protocol+"//"+location.hostname);
socket.on('connect', function(){
  console.log('Connected to server.');

  socket.on('digitalRead', function(v){
    $("#read").text("Pin: " + v.pin + " Value: " + v.value);
      
    if(v.pin == laPin){
        if(v.value == true){
            $('.la-7').addClass('open');
        }else {
            $('.la-7').removeClass('open');
        }
    }
  });
});