var socket = io.connect(location.protocol+"//"+location.hostname);
socket.on('connect', function(){
  console.log('Connected to server.');

  socket.on('digitalRead', function(v){
    $("#read").text("Pin: " + v.pin + " Value: " + v.value);
    console.log("Pin: " + v.pin + " Value: ", v.value);
      
    if(v.pin == 7){
        if(v.value == true){
            $('.la-7').addClass('open');
        }else {
            $('.la-7').removeClass('open');
        }
    }
  });
});