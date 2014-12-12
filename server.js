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

var ArduinoFirmata = require('arduino-firmata');
arduino = new ArduinoFirmata().connect();

arduino.on('connect', function(){
  console.log("Arduino board version: " + arduino.boardVersion);
  console.log('Arduino verbonden en ready to rock!');

  arduino.pinMode(7, ArduinoFirmata.INPUT);
  arduino.pinMode(5, ArduinoFirmata.INPUT);

  // Als het programma met CTRL-C afgesloten wordt
  // sluit hij de verbinding met de arduino 'goed' af
  // Anders krijg je problemen met de volgende opstart
  process.stdin.resume();
  process.on('SIGINT', function(){
    arduino.close(process.exit(2));
  });
});

// emit sensor-value to HTML-side
io.sockets.on('connection', function(socket) {
  arduino.on('digitalChange', function(e){
    console.log("pin" + e.pin + " : " + e.old_value + " -> " + e.value);
    socket.emit('digitalRead', arduino.digitalRead(7));
  });

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

var port = process.argv[2]-0 || 3000;
app.listen(port);
console.log("server start - port:" + port);
console.log(" => http://localhost:"+port);
