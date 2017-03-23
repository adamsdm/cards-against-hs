var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ = require('underscore');
var cards = require('./data.json');


// usernames which are currently connected to the chat
var usernames = {};


var blackCards = cards["blackCards"];
var whiteCards = cards["whiteCards"];

// rooms which are currently available in chat
var rooms = [];
var roomsData = {};

/* 
roomData = {
  room1: {
      bci: 0,
      wci: 0,
      bc: [
        "....",
        "....",
      ],
      wc: [
        "....",
        "....",
      ],
      players: [
        'player1',
        'player2',
        ...
      ]
    },
    room2: {
      ...
    }
}
*/




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

  socket.on('createRoom', function(roomId){
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
      io.sockets.in(room).emit('user-joined-room', username);
      console.log("User "+username+" connected to room " + room);
    }
  });

  socket.on('leaveroom', function(){
    //socket.leave(socket.room);
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
