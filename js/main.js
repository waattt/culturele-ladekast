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

var startKnopPin = 8;
var la1Pin = 7; // Hier worden alle lade's aan sensoren gekoppeld
var la2Pin = 6;
var Knop1Pin =  5;
var Knop2Pin =  4;
var Knop3Pin =  3; 

/*//////////////////////////////////////////////////////////
/////////////////// 1. Socket Connection ///////////////////
//////////////////////////////////////////////////////////*/
var socket = io.connect(location.protocol+"//"+location.hostname);
socket.on('connect', function(){
  console.log('Connected to server.');

  socket.on('InitDigitalRead', function(v){
      console.log(v.pin + " " + v.value);
  });
  socket.on('digitalRead', function(v){
    $("#read").text("Pin: " + v.pin + " Value: " + v.value);
    if(v.pin == startKnopPin){
        if(v.value != v.old_value){
           showSection('een');
            kant1();
        }
    }
    if(v.pin == la1Pin){
        if(v.value == true){
            showSection('twee');
            kant2();
        }
    }
    if(v.pin == Knop1Pin || v.pin == Knop2Pin || v.pin == Knop3Pin){
        if(v.value == true){
            showSection('drie');
            kant3(v.pin);
        }
    }
    if(v.pin == la2Pin){
        if(v.value == true){
            showSection('vier');
        }
    }
  });
});
function showSection(showMe){
    $('section').hide();
    $('section.'+ showMe).show();
}
function kant1(){
    $('.start-scherm').hide();
    $('#myVideo').show();
    var vid = document.getElementById("myVideo"); 
    vid.play();
    if(vid.ended){
        // ja wat dan?   
    }
}
var interval2Triggered = false;   
function kant2(){
    if(!interval2Triggered){
        var tel = 0;
        var teller = setInterval(function () {
            interval2Triggered = true;
            ++tel;
            if(tel == 1){
                $('.cultuur-een, .cultuur-twee').show();
            }
            if (tel == 5){
                $('.cultuur-een').hide();   
            }
            if (tel == 20){
                $('.cultuur-twee').hide();   
            }
            if(tel == 25){
                clearInterval(teller);
                interval2Triggered = false;                
            }
        }, 1000);
    }
}
var kant3introDone = false;
function kant3(pin){
    if(kant3introDone){
        if(pin = Knop1Pin){
            //show pin 1 - klas 3/4
        }
        if(pin = Knop2Pin){
            //drama
        }
        if(pin = Knop3Pin){
            //recepteren
        }
    }else {
        var tel = 0;
        var teller = setInterval(function () {
            ++tel;
            console.log(tel);
            if(tel == 5){
                $('.knoppen-een').hide();
            }
            if(tel == 15){
                $('.knoppen-twee').hide();
                clearInterval(teller);
                kant3introDone == true;
            }
        }, 1000);   
    }
}