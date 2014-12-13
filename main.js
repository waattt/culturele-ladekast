var socket = io.connect(location.protocol+"//"+location.hostname)
socket.on('connect', function(){
  console.log('Connected to server.');

  socket.on('digitalRead', function(v){
    $("#read").text("Pin: " + v.pin + " Value: " + v.value);
    console.log("Pin: " + v.pin + " Value: ", v.value);
  });
});