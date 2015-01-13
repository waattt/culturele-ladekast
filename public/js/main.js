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

var LasOpen = 0;
/*//////////////////////////////////////////////////////////
/////////////////// 1. Socket Connection ///////////////////
//////////////////////////////////////////////////////////*/
var socket = io.connect(location.protocol+"//"+location.hostname);
socket.on('connect', function(){
  console.log('Connected to server.');


var laOpen = 0;
  socket.on('InitDigitalRead', function(v){
      console.log(v.pin + " " + v.value);
      if(v.pin < 8 && v.value == true){
           laOpen++;
      }
      if(laOpen > 1){
          teVeelOpen(true);
          LasOpen = laOpen;
      }
  });
  socket.on('digitalRead', function(v){
    $("#read").text("Pin: " + v.pin + " Value: " + v.value);
    if(v.pin == startKnopPin){
        if(v.value != v.old_value){
           showSection('een');
            kant1();
            kant2('reset');
            kant3('reset');
            kant4('reset');
        }
    }
    if(v.pin == la1Pin){
        if(v.value == true){
            showSection('twee');
            kant1('reset');
            kant2();
            kant3('reset');
            kant4('reset');
            LasOpen++;
        }else {
            LasOpen--;
        }
    }
    if(v.pin == Knop1Pin || v.pin == Knop2Pin || v.pin == Knop3Pin){
        if(v.value == true){
            showSection('drie');
            kant1('reset');
            kant2('reset');
            kant3(v.pin);
            kant4('reset');
            LasOpen++;
        }else {
            LasOpen--;   
        }
    }
    if(v.pin == la2Pin){
        if(v.value == true){
            showSection('vier');
            kant1('reset');
            kant2('reset');
            kant3('reset');
            kant4();
            LasOpen++;
        }else{
            LasOpen--;   
        }
    }
    if(LasOpen > 1){
        teVeelOpen(true);
    }else {
        teVeelOpen(false);   
    }
  });
});
function showSection(showMe){
    $('section').hide();
    $('section.'+ showMe).show();
    tel = 0;
}
function kant1(reset){
    $('.start-scherm').hide();
    $('#myVideo').show();
    var vid = document.getElementById("myVideo"); 
    vid.play();
    if(reset == 'reset'){
        console.log('Kant 1 RESET');
        $('.start-scherm').show();
        $('#myVideo').hide();
        vid.pause();
    }
}
var interval2Triggered = false;   
function kant2(reset){
    if(!interval2Triggered){
        var tel = 0;
        var teller = setInterval(function () {
            interval2Triggered = true;
            ++tel;
            console.log(tel);
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
    if(reset == 'reset'){
        console.log('Kant 2 RESET');
        interval2Triggered = false;
        clearInterval(teller);
        $('.cultuur-een, .cultuur-twee').show();
    }
}
var kant3introDone = false;
function kant3(pin){
    if(kant3introDone){
        if(pin == Knop1Pin){
            if($('.selectie.klas').is(":visible")){
                $('.selectie.klas').hide();
            }else {
                $('.selectie.klas').show();
            }
        }
        if(pin == Knop2Pin){
            if($('.selectie.leerlijn').is(":visible")){
                $('.selectie.leerlijn').hide();
            }else {
                $('.selectie.leerlijn').show();
            }
        }
        if(pin == Knop3Pin){
            if($('.selectie.vermogen').is(":visible")){
                $('.selectie.vermogen').hide();
            }else {
                $('.selectie.vermogen').show();
            }
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
                kant3introDone = true;
            }
        }, 1000);   
    }
    if(pin == 'reset'){
        console.log('Kant 3 RESET');
        $('.selectie').hide();
        $('.knoppen-een').show();
        $('.knoppen-twee').show();
        kant3introDone = false;
        clearInterval(teller);
    }
}
function kant4(reset){
    if(reset == 'reset'){
        console.log('Kant 4 RESET');
    }
}
function teVeelOpen(open){
    if(open == true){
        $('.teVeelOpen').show();
        console.log("te veel las open");
    }else {
        //haal ding weg dat er te veel open zijn
        console.log('niet meer te veel las open');
        $('.teVeelOpen').hide();
    }
}
var tel = 0;
var teller = setInterval(function () {
    tel++;
    console.log('Globalteller : ' + tel);
    console.log('Las open: ' + LasOpen);
    if(tel == 120){
        kant1('reset');
        kant2('reset');
        kant3('reset');
        kant4('reset'); 
        showSection('een');
        tel = 0;
    }
}, 1000);