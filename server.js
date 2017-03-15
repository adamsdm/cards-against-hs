var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var cards = require('./data.json');



app.use(express.static(__dirname + '/public')); 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/mobile.html', function (req, res) {
  res.sendFile(__dirname + '/views/mobile.html');
});
app.get('/comp.html', function (req, res) {
  res.sendFile(__dirname + '/views/comp.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
      console.log("A user disconnected");
  });
  socket.on('reqcard', function () {
      // we tell the client to execute 'updatechat' with 2 parameters
      console.log("User req card");

      //Get a new text card
      var bci = Math.round(Math.random()*(cards["blackCards"].length-1));
      var wci = Math.round(Math.random()*(cards["whiteCards"].length-1));
      var bc = cards["blackCards"][bci];
      var wc = cards["whiteCards"][wci];
      var str = bc["text"] + ' ('+ bc["pick"] + ')';

      io.sockets.emit('update-black-card', str);
      /*
      var bci = Math.round(Math.random()*(cards["blackCards"].length-1));
      var wci = Math.round(Math.random()*(cards["whiteCards"].length-1));
      var bc = cards["blackCards"][bci];
      var wc = cards["whiteCards"][wci];
      var str = bc["text"] + '('+ bc["pick"] + ')' + wc;
      console.log(str);
      io.sockets.in(socket.room).emit('updatechat', socket.username, str);
      */
  });

});


server.listen(3000, function(){
  console.log('listening on *:3000');
});
