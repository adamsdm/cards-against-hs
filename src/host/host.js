var socket = io.connect();
var sound = document.getElementById("textToSpeech");
var roomId = window.location.href.split('#')[1];
var players = [];

$('#room-code').html("Room id: "+roomId);

if(window.location.hash) {
  socket.emit('joinroom', "HOST", roomId );
} else {
  alert("Oops");
}

socket.on('debug', function(text){
    console.log(text);
})

socket.on('couldnt-join-room', function(){
    alert("Tried to join room "+roomId+" which doesn't exist.");
});

socket.on('user-joined-room', function(username){
    players.push(username);
    
    //Alert that a player joined
    $('#myModal').modal('show');
    $('#myModalLabel').html('User '+username+' joined the room');
    setTimeout(function(){
        $('#myModal').modal('hide');    
    }, 2000)
    
    
    // Redraw user list
    renderPlayers(players)
});

socket.on('user-left-room', function(username){
    for(var i=0; i<players.length; i++){
        if(players[i] == username)
            players.splice(i, 1);
    }

    renderPlayers(players);
        
});


$('#req-card').click( function() {
    console.log('req card');
    socket.emit('reqcard');
});





socket.on('update-black-card', function (text, noPicks) {

    //Text to speech
    if(sound.checked){
        var t2t = text;
        t2t = text.replace(/_/g, ", blank,");
        t2t = t2t.substring(0, t2t.length);
        var msg = new SpeechSynthesisUtterance(t2t);
        window.speechSynthesis.speak(msg);
    }

    text = text + '<br> <h2>('+noPicks+')</h2';
    
    $('#black-card').html(text);
});

// Help functions
var renderPlayers = function(players){
    $("#players").empty();
    for(var i=0; i<players.length; i++){
        //if(players[i] != "HOST")
            $('#players').append('<b style="color: white;"> '+players[i] + '</b>');
    }
}