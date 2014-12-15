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

var http = require('http');
var fs = require('fs');
var url = require('url');

var app_handler = function(req, res) {
  var path, _url;
  _url = url.parse(decodeURI(req.url), true);
  path = _url.pathname === '/' ? '/index.html' : _url.pathname;
  console.log(req.method + " - " + path);
  fs.readFile(__dirname + path, function(err, data) {
    if (err) {
      res.writeHead(500);
      res.end('error load file');
    }
    res.writeHead(200);
    res.end(data);
  });
};

var app = http.createServer(app_handler);
var io = require('socket.io').listen(app);
var port = process.argv[2]-0 || 80;
app.listen(port);
console.log("server start - port:" + port);
console.log(" => http://localhost:"+port);

/*//////////////////////////////////////////////////////////
///////////////////////// 2. Arduino ///////////////////////
//////////////////////////////////////////////////////////*/

var ArduinoFirmata = require('arduino-firmata');
arduino = new ArduinoFirmata().connect();

arduino.on('connect', function(){
  console.log("Arduino board version: " + arduino.boardVersion);
  console.log('Arduino verbonden en ready to rock!');

  arduino.pinMode(7, ArduinoFirmata.INPUT);

  process.stdin.resume();                                       // Als het programma met CTRL-C afgesloten wordt
  process.on('SIGINT', function(){                              // sluit hij de verbinding met de arduino 'goed' af  
      arduino.close(process.exit(2));                           // Anders krijg je problemen met de volgende opstart
  });
});

// emit sensor-value to HTML-side
io.sockets.on('connection', function(socket) {
    
  //Als er een digitale sensor veranderd; doe dit:
  arduino.on('digitalChange', function(e){
    //console.log("pin" + e.pin + " : " + e.old_value + " -> " + e.value);
    console.log("pin" + e.pin + " : " + e.value);
    var digiRead = {pin: e.pin, value: e.value};
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