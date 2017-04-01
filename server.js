var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var path = require('path');
var config = require('./webpack.config.js');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var _ = require('underscore');
var cards = require('./data.json');

var compiler = webpack(config);





// usernames which are currently connected to the chat
var usernames = {};


var blackCards = cards["blackCards"];
var whiteCards = cards["whiteCards"];

// rooms which are currently available in chat
var rooms = [];
var roomsData = {};



//Debug
function sendMsg(msg, room){
  io.sockets.in(room).emit('debug', msg);
}

app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));


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

  socket.on('createRoom', function(roomId){
    console.log("Creating room "+roomId);
    // First user to create the room is set to host
    socket.isHost = true;    

    console.log("Room "+roomId+ " was created.");
    rooms.push(roomId);

    //Add a white and black card deck for the room
    
    roomsData[roomId] = {
      bci: 0,
      wci: 0,
      bc: _.shuffle(blackCards),
      wc: _.shuffle(whiteCards)
    };
  });

  // when the client emits 'joinroom', this listens and executes
  socket.on('joinroom', function(username, room){

    // If room doens't exists in 'rooms'
    if(!_.contains(rooms, room) ){
      console.log("User tried to join room "+room+" which doesn't exist");
      socket.emit('couldnt-join-room');
    } else {

      socket.username = username;
      socket.room = room;
      usernames[username] = username;

      socket.join(room);
      // Emit to all other sockets that a player joined
      io.sockets.in(room).emit('user-joined-room', username);
      // Emit to the player that he succesfully joined the room
      socket.emit('succesfully-joined-room');
      console.log("User "+username+" connected to room " + room);
    }
  });

  socket.on('submit-cards-from-user', function(payload){
    console.log("User "+payload.user+" submitted: "+payload.data);
  })
  
  socket.on('reqcard', function () {
      console.log("User req card");

      var bci = roomsData[socket.room].bci;
      var wci = roomsData[socket.room].wci;

      // If there are no more white cards in deck 
      if(wci >= roomsData[socket.room].wc.length){
        /* TODO */
      }

      // If there are black cards left in deck
      if(bci < roomsData[socket.room].bc.length){
        var bc  = roomsData[socket.room].bc[bci];
        var noPicks = bc['pick'];

        // read the text on the card...
        str = bc['text'];
        roomsData[socket.room].bci++;
      } else {
        var noPicks = '';
        str = "Thanks for playing!";
      }

      // Send black card text to players
      io.sockets.in(socket.room).emit('update-black-card', str, noPicks);
  });

  socket.on('req-white-card', function(){
    var wci = roomsData[socket.room].wci;
    var wc = roomsData[socket.room].wc[wci];

    roomsData[socket.room].wci++;
    
    socket.emit('get-white-card', wc);
  })

  socket.on('disconnect', function(){
    if(socket.username=="HOST"){
      io.sockets.in(socket.room).emit('host-left-room');

      // Remove host room...
      rooms.splice(_.indexOf(rooms, socket.room), 1);
      // Aswell as remove the data for the room
      delete roomsData[socket.room];

      console.log(rooms);
    }

    io.sockets.in(socket.room).emit('user-left-room', socket.username);
    console.log("User "+ socket.username +" disconnected");
  });

});


server.listen(3000, function(){
  console.log('listening on *:3000');
});
