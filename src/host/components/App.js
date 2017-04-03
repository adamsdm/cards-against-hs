import React, { Component } from 'react'
import update from 'immutability-helper';
import BlackCard from './BlackCard'
import PlayerList from './PlayerList'

var socket = io.connect();

class App extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
          bcText: 'Cards against humanity',
          inRoom: false,
          players: [],
          allHaveSubmitted: true
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
        socket.on('user-submitted-cards', this._userSubmited.bind(this));
    }
        
    _joinedRoom(){
        this.setState({inRoom: true});
    }

    _couldntJoinRoom(){
        alert("Couldn't join room "+this.state.roomId);
        this.setState({inRoom: true});
    }

    _updateBlackCard(text, noPicks){ 
        // Clear submitted cards
        var players = this.state.players;
        for(var i=0; i<players.length; i++){
            players[i].submittedCards = [];
        }

        this.setState({
            bcText: text,
            maxWcSelect: noPicks,
            players: players
        });


    }
    _userJoined(username){
        if(username!='HOST'){
            alert("User "+username+" joined the room");
            let player = {
                username: username,
                submittedCards: []
            }
            this.setState({players: this.state.players.concat([player])});
        }
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
    _userSubmited(payload){
        let players = this.state.players;
        let name = payload.user;
        let cards = payload.data;

        //http://stackoverflow.com/questions/28121272/whats-the-best-way-to-update-an-object-in-an-array-in-reactjs
        var playerIndex = players.findIndex(function(c) { 
            return c.username == name; 
        });

        var updatedPlayer = update(players[playerIndex], {
            submittedCards: {$set: cards},
        });
        var newPlayers = update(players, {
            $splice: [[playerIndex, 1, updatedPlayer]]
        });

        this.setState({players: newPlayers});

        //Check if all players have submitted
        for(var i=0; i<newPlayers.length; i++){
            if(newPlayers[i].username!= 'HOST')
                if(newPlayers[i].submittedCards.length == 0)
                    return;
        }
        this.setState({allHaveSubmitted: true});

    }

    reqBlackCard(){
        console.log(this.state.players.length);
        if(this.state.players.length > 0) {
            socket.emit('reqcard');
            return;
        }
        alert("No players in room");
    }

    render() {
        return (
        <div>
            <h3 id="room-code">Roomcode: {this.state.roomId}</h3>
            <BlackCard bcText={this.state.bcText} />
            <PlayerList players={this.state.players} />
            {this.state.allHaveSubmitted && 
                <button id="req-card" onClick={this.reqBlackCard.bind(this)}> Request new card </button>
            }
        </div>
        )
    }
}

export default App
