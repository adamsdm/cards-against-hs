var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var cards = require('./data.json');


// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = [];




//Debug
function sendMsg(msg, room){
  io.sockets.in(room).emit('debug', msg);
}




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

  socket.on('disconnect', function(){
    if(socket.username=="HOST"){
      io.sockets.in(socket.room).emit('host-left-room');

      // Remove host room
      for(var i=0; i<rooms.length; i++){
        if(rooms[i]==socket.room){
          rooms.splice(i, 1);
        }
      }

      console.log(rooms);
    }

    io.sockets.in(socket.room).emit('user-left-room', socket.username);
    socket.leave(socket.room);
    console.log("A user disconnected");
  });

  // when the client emits 'adduser', this listens and executes
  socket.on('joinroom', function(username, room){
    
    socket.username = username;
    socket.room = room;
    usernames[username] = username;
    socket.join(room);
    io.sockets.in(room).emit('user-joined-room', username);
    console.log("User "+username+" connected to room " + room);
  });

  socket.on('createRoom', function(roomId){
    socket.isHost = true;    

    console.log("Room "+roomId+ " was created.");
    rooms.push(roomId);
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
