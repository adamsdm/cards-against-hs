var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var cards = require('./data.json');


// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3', 'general'];




//Debug
function sendMsg(msg, room){
  io.sockets.in(room).emit('debug', msg);
}

setInterval(function(){
  var room = 'room1';
  var msg = "Ur in " + room;
  
  sendMsg(msg,room);
}, 1000);





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
  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username, room){
    console.log("User "+username+" connected to room" + room);

    socket.username = username;
    socket.room = room;
    usernames[username] = username;
    socket.join(room);
  });

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

      io.sockets.in(socket.room).emit('update-black-card', str);
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
