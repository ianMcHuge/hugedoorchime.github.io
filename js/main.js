(function(){

  function init() {
    const startBtn = document.getElementById('connectPuck');
    const readOut = document.getElementById('readOut');
    const sounds = [];
    const seinfeld = registerSound('/audio/seinfeld.mp3');
    const cheers = registerSound('/audio/cheers.mp3');
    const yeah = registerSound('/audio/yeah.mp3');

    let currentIndex = 0;
    let isOpen = false;

    startBtn.addEventListener('click', function(){
      initConnection();
    });

    playBtn.addEventListener('click', function(){
      playSound();
    });
  };

  function onLine(v) {
    var obj = null;
    try{
      obj = JSON.parse( v );
      console.log( obj );
    }catch(error){
      console.log(error);
    }


    if( obj ){
      readMagnetometer(obj.magX, obj.magY, obj.magZ);
    }
  };

  function readMagnetometer(x, y, z){
    console.log('readMagnetometer ', x, y, z);
  };

  function initConnection(){
    console.log('initConnection');
    Puck.connect(function(c) {
      if (!c) {
        alert("Couldn't connect!");
        readOut.innerHTML = 'Puck Connection failed!';
        return;
      }
      connection = c;
      var buf = "";
      readOut.innerHTML = 'Puck Connected!';

      connection.on("data", function(d) {
        buf += d;
        var i = buf.indexOf("\n");
        while (i>=0) {
          onLine(buf.substr(0,i));
          buf = buf.substr(i+1);
          i = buf.indexOf("\n");
        }
      });

      setTimeout(function() {

        console.log("set time out called")

        // get all data is a method on the puck itself
        connection.write("setInterval(function(){Bluetooth.println(getAllData());},10);\n",
          function() { console.log("Ready..."); });
      }, 1500);
    });
  };

  function onSoundComplete(){
    console.log('onSoundComplete ', currentIndex);
    currentIndex++;
  };

  function registerSound(src){
    console.log('registerSound ', src);
    let s = new Howl({
      src: [src]
    });

    sounds.push(s);
    return s;
  };

  function playSound(){
    console.log('playSound ', (currentIndex % sounds.length) );
    let s = sounds[ currentIndex % sounds.length ];
    s.play();

    s.on('end', function(){
      console.log(src + ' Finished!');
      onSoundComplete();
    });
  }

  window.onload = init;
})();
