var socket = io.connect();

var username = prompt("Enter username");
var roomCode = prompt("Enter roomcode");


console.log(username);

socket.emit('joinroom', username, roomCode);


socket.on('couldnt-join-room', function() {
    alert("Room not found");
})

socket.on('update-black-card', function (text) {
    $('#title').html(text);
});

socket.on('host-left-room', function(){
    alert("Host left the game");
    socket.emit('leaveroom', username);

});

socket.on('debug', function(text){
    console.log(text);
});