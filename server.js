/*/////////////////////////////////////////////////////////
  SERVER.JS
  Maakt verbinding met de Arduino en stuurt die gegevens
  door naar de 'client' (in dit geval de browser).
  
  CONTENTS:
  1. Initial Setup 
  2. Arduino
  3.

//////////////////////////////////////////////////////////*/

/*//////////////////////////////////////////////////////////
///////////////////// 1. Initial Setup /////////////////////
//////////////////////////////////////////////////////////*/

var express = require('express'),
    app = express(),
    server = app.listen(8080),
    io = require('socket.io').listen(server),
    path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


/*//////////////////////////////////////////////////////////
///////////////////////// 2. Arduino ///////////////////////
//////////////////////////////////////////////////////////*/
var DigitInputPins = [
    3, 4, 5, 6, 7, 8
];

var ArduinoFirmata = require('arduino-firmata');
arduino = new ArduinoFirmata().connect();

arduino.on('connect', function(){
  console.log("Arduino board version: " + arduino.boardVersion);
  console.log('Arduino verbonden en ready to rock!');

  for (var i = 0; i < DigitInputPins.length; i++) {
    arduino.pinMode(DigitInputPins[i], ArduinoFirmata.INPUT);
  }

  process.stdin.resume();
  process.on('SIGINT', function(){  
      arduino.close(process.exit(2));
  });
});

io.sockets.on('connection', function(socket) {
    /*///////////////////////////////////////////////////////
    // initial sensor status                               */
    for (var i = 0; i < DigitInputPins.length; i++) {
        var read = arduino.digitalRead(DigitInputPins[i]);
        var digiRead = {pin: DigitInputPins[i], value: read};
        socket.emit("InitDigitalRead", digiRead);
   }
  /*/////////////////////////////////////////////////////////
  // Digital sensor change                                 */
  arduino.on('digitalChange', function(e){
    console.log("pin" + e.pin + " : " + e.value);
    var digiRead = {pin: e.pin, value: e.value, old_value: e.old_value};
    socket.emit("digitalRead", digiRead);
  });

  // Als er een analoge sensor veranderd; doet dit
  /*arduino.on('analogChange', function(e){
    console.log("pin" + e.pin + " : " + e.old_value + " -> " + e.value);
    socket.emit('analogRead', arduino.analogRead(1));
  });*/

	
  // on click button on HTML-side, change LED
  socket.on('digitalWrite', function(stat) {
    console.log("pin13:"+stat);
    arduino.digitalWrite(13, stat);
  });

});