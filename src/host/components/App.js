import React, { Component } from 'react'
import BlackCard from './BlackCard'
import PlayerList from './PlayerList'

var socket = io.connect();

class App extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
          bcText: 'Cards against humanity',
          inRoom: false,
          players: []
        }
    }

    componentDidMount() {  
        var roomId = window.location.href.split('#')[1];
        this.setState({roomId: roomId});
        if(window.location.hash) {
          socket.emit('joinroom', "HOST", roomId );
        } else {
          alert("Invalid url");
        }

        socket.on('succesfully-joined-room', this._joinedRoom.bind(this));
        socket.on('couldnt-join-room', this._couldntJoinRoom.bind(this));
        socket.on('update-black-card', this._updateBlackCard.bind(this));
        socket.on('user-joined-room', this._userJoined.bind(this));
        socket.on('user-left-room', this._userLeft.bind(this));
    }
        
    _joinedRoom(){
        this.setState({inRoom: true});
    }

    _couldntJoinRoom(){
        alert("Couldn't join room "+this.state.roomId);
        this.setState({inRoom: true});
    }

    _updateBlackCard(text, noPicks){ 
        this.setState({
            bcText: text,
            maxWcSelect: noPicks
        });
    }
    _userJoined(username){
        alert("User "+username+" joined the room");
        let player = {
            username: username
        }
        this.setState({players: this.state.players.concat([player])});
    }
    _userLeft(username){
        var players = this.state.players;
        for(var i=0; i<this.state.players.length; i++){
            if(this.state.players[i].username === username){
                players.splice(i, 1);
                break;
            }
        }
        this.setState({players: players});
    }
    reqBlackCard(){
        socket.emit('reqcard');
    }

    render() {
        return (
        <div>
            <h3 id="room-code">Roomcode: {this.state.roomId}</h3>
            <BlackCard bcText={this.state.bcText} />
            <PlayerList players={this.state.players} />
            <button id="req-card" onClick={this.reqBlackCard}> Request new card </button>
        </div>
        )
    }
}

export default App
