var $ = require('jquery');
var socket = io.connect();

var whiteCards = [];

var username = prompt("Enter username");
var roomcode = prompt("Enter room code");

socket.emit('joinroom', username, roomcode);



socket.on('couldnt-join-room', function() {
    alert("Room "+roomcode+" does not exist");
})

socket.on('update-black-card', function (text, noPicks) {
    $('#title').html(text);
    
    if(whiteCards.length<5)
        socket.emit('req-white-card');

    renderWhiteCards();
});

socket.on('get-white-card', function(text){
    whiteCards.push(text);

    if(whiteCards.length < 5)
        socket.emit('req-white-card');

    console.log(whiteCards);
    if(whiteCards.length == 5)
        renderWhiteCards();
});

socket.on('host-left-room', function(){
    alert("Host left the game");
    socket.emit('leaveroom', username);

});

socket.on('debug', function(text){
    console.log(text);
});


function renderWhiteCards(){
    console.log("Rendering white cards...");
    $('#whiteCards').empty();

    console.log(whiteCards);
    
    for(var i=0; i<whiteCards.length; i++){
        $('#whiteCards').append('<input type="checkbox" name="vehicle" value="Bike">' + whiteCards[i] + '<br>');
    }
}
