var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');


var _ = require('underscore');
var cards = require('./data.json');








if ( app.get('env') === 'development' ) {
  console.log("STARTING DEV SERVER");

  var errorHandler = require('express-error-handler');
  var webpack = require('webpack');
  var config = require('./webpack.config.dev.js');
  var compiler = webpack(config);
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');

  app.use(errorHandler());

  // Hot module reloading
  app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
  app.use(webpackHotMiddleware(compiler));
}





var blackCards = cards["blackCards"];
var whiteCards = cards["whiteCards"];

// rooms which are currently available in chat
var roomsData = {};








//Debug
function sendMsg(msg, room){
  io.sockets.in(room).emit('debug', msg);
}


function createRandString(){
  var roomCode = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 4; i++ ){
      roomCode += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return roomCode;
}



app.use(express.static(__dirname + '/public')); 
app.use(express.static(__dirname + '/dist')); 

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/client.html', function (req, res) {
  res.sendFile(__dirname + '/views/client.html');
});
app.get('/host.html', function (req, res) {
  res.sendFile(__dirname + '/views/host.html');
});


io.on('connection', function(socket){
  console.log("A user connected");





  socket.on('create-room', function(){

    var roomId = createRandString();

    // Do until createRandString() returns a unique room code
    while(roomsData[roomId]){
      roomId = createRandString();
      console.log(roomId);
    }

    console.log("Creating room "+roomId);
    // First user to create the room is set to host
    socket.isHost = true;    

    console.log("Room "+roomId+ " was created.");

    //Add a white and black card deck for the room
    roomsData[roomId] = {
      bci: 0,
      wci: 0,
      bc: _.shuffle(blackCards),
      wc: _.shuffle(whiteCards),
      players: []
    };


    socket.emit('room-created', roomId);

  });






  // when the client emits 'joinroom', this listens and executes
  socket.on('joinroom', function(username, room){;
    // If room doens't exists in 'rooms'
    if(!roomsData[room] ){
      console.log("User tried to join room "+room+" which doesn't exist");
      socket.emit('couldnt-join-room');
      return;
    }

    // Ensure username is unique
    for(var i=0; i<roomsData[room].players.length; i++){
      if(roomsData[room].players[i] == username){
        socket.emit('username-taken');
        return;
      }

    }

    socket.username = username;
    socket.room = room;
    roomsData[room].players.push(username);

    socket.join(room);
    // Emit to all other sockets that a player joined
    io.sockets.in(room).emit('user-joined-room', username);
    // Emit to the player that he succesfully joined the room
    socket.emit('succesfully-joined-room');
    console.log("User "+username+" connected to room " + room);
    console.log(roomsData[room].players)
  });

  socket.on('leaveroom', function(){
    console.log("User "+socket.username+" left room "+socket.room);
    socket.leave(socket.room);
  })

  socket.on('submit-cards-from-user', function(payload){
    console.log("User "+payload.user+" submitted: "+payload.data);
    io.sockets.in(socket.room).emit('user-submitted-cards', payload);
  })

  socket.on('user-voted', function(submission){
    console.log(socket.username+" voted for "+submission);
    io.sockets.in(socket.room).emit('got-vote', submission);
  });

  socket.on('all-cards-shown', function(players){
    io.sockets.in(socket.room).emit('get-submitted', players);
  })
  
  socket.on('reqcard', function () {

      if(!roomsData[socket.room]){
        console.log("User from room "+socket.room+" req card, room doesnt exist");
        return;
      }

      var bci = roomsData[socket.room].bci;

      // If there are no more white cards in deck 
      if(bci >= roomsData[socket.room].bc.length){
        roomsData[socket.room].bci = 0;
        bci = 0;
      }

      var bc  = roomsData[socket.room].bc[bci];
      var noPicks = bc['pick'];

      // read the text on the card...
      str = bc['text'];
      roomsData[socket.room].bci++;


      // Send black card text to players
      io.sockets.in(socket.room).emit('update-black-card', str, noPicks);
  });

  socket.on('req-white-card', function(){
    
    if(!roomsData[socket.room]) return;

    var wci = roomsData[socket.room].wci;

    // If there are no more white cards in deck 
    if(wci && wci >= roomsData[socket.room].wc.length){
      roomsData[socket.room].wci = 0;
      wci = 0;
    }


    var wc = roomsData[socket.room].wc[wci];

    roomsData[socket.room].wci++;
    
    socket.emit('get-white-card', wc);
  })

  socket.on('disconnect', function(){

    if(socket.username=="HOST"){
      io.sockets.in(socket.room).emit('host-left-room');
      // Kick all players in room

      // Remove host room
      delete roomsData[socket.room];
      return;
    }

    // If room doesnt exist
    if(!roomsData[socket.room]){
      socket.emit('host-left-room');
      return;
    }

    // If socket isn't in a room, do nothing
    if(!socket.room){
      console.log(socket.username + " disconnected");
      return;
    }

    var players = roomsData[socket.room].players;
    // Remove username from list of players in room
    for(var i=0; i<players.length; i++){
      if(players[i] == socket.username){
        players.splice(i, 1);
        roomsData[socket.room].players = players;
        break;
      }
    }


    console.log(roomsData[socket.room].players);    

    io.sockets.in(socket.room).emit('user-left-room', socket.username);
    console.log("User "+ socket.username +" disconnected");
  });

});


var port = process.env.PORT || 3000;

server.listen(port, function(){
  console.log('listening on port:'+port);
});
