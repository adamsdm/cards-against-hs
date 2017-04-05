import React, { Component } from 'react'
import update from 'immutability-helper';
import BlackCard from './BlackCard'
import WhiteCards from './WhiteCards'
import PlayerList from './PlayerList'

var _ = require('underscore');

var socket = io.connect();

class App extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
          bcText: 'Cards against humanity',
          inRoom: false,
          players: [],
          allHaveSubmitted: true,
          allCardsFlipped: true,
          allVoted: true
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
        socket.on('got-vote', this._updateVotes.bind(this));
    }
        
    _joinedRoom(){
        this.setState({inRoom: true});
    }

    _couldntJoinRoom(){
        alert("Couldn't join room "+this.state.roomId);
        this.setState({inRoom: true});
    }

    _updateBlackCard(text, noPicks){ 
        // Clear submitted cards and set that the player is playing this round
        var players = this.state.players;
        for(var i=0; i<players.length; i++){
            players[i].submittedCards = [];
            players[i].inRound = true;
        }

        this.setState({
            bcText: text,
            maxWcSelect: noPicks,
            players: players,
            allHaveSubmitted: false,
            noPlayersInRound: this.state.players.length,
            allCardsFlipped: false,
            allVoted: false,
            votes: []
        });
    }

    _userJoined(username){
        if(username!='HOST'){
            let player = {
                username: username,
                submittedCards: [],
                inRound: false,
                score: 0
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
        this.checkAllSubmitted();
    }

    _updateVotes(submission){
        var votes = this.state.votes;
        votes.push(submission.uname);
        this.setState({votes: votes});

        // If everyone has voted
        if(votes.length==this.state.noPlayersInRound){

            console.log("All voted");
            this.setState({allVoted: true});
            let voteCount = {};

            // Count votes
            var maxVotes=-1;
            var winners=[]; // Array since votes may be even
            for (var i = 0, j = votes.length; i < j; i++) {
                var name = votes[i];
                voteCount[name] = (voteCount[name] || 0) + 1;

                // If found new max
                if(voteCount[name] > maxVotes){
                    maxVotes = voteCount[name];
                    winners = [];
                    winners.push(name);
                } else if(voteCount[name] == maxVotes){
                    console.log("Winners:" + winners)
                    winners.push(name);
                }
            }
            console.log(voteCount);
            console.log(winners);

            // If draw
            if(winners.length>1){
                this.setState({bcText: "DRAW! Winners: "+winners});
            } else {
                this.setState({bcText: "Winner: "+winners});
            }

            // Update score
            var players = this.state.players;
            for(var i=0; i<players.length; i++){
                if ( _.contains(winners,players[i].username) ){
                    players[i].score = players[i].score+1;
                }
            }
            this.setState({players: players});
        }

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

        this.checkAllSubmitted();

    }

    checkAllSubmitted(){
        let players = this.state.players;
        let noSubmitted = 0;

        for(var i=0; i<players.length; i++){
            if(players[i].username!= 'HOST' && players[i].submittedCards.length > 0)
                noSubmitted++;
            // If player is not in the round, treat it as submitted
            if(!players[i].inRound)
                noSubmitted++;
        }

        if(noSubmitted == this.state.players.length){
            this.setState({allHaveSubmitted: true});
        }
    }

    reqBlackCard(){
        if(this.state.players.length > 0) {
            socket.emit('reqcard');
            return;
        }
        alert("No players in room");
    }

    flipCards(){
        if(this.state.allCardsFlipped){
            alert("All cards flipped");
         return;
        }

        var cards = document.getElementsByClassName("not-flipped");

        // Flip card by card
        cards[0].classList.add("flip");
        cards[0].classList.remove("not-flipped");

        // If this is the last card to be flipped
        if(cards.length == 0){
            this.setState({allCardsFlipped: true});
            socket.emit('all-cards-shown', this.state.players);
        }
    }

    render() {
        return (
        <div>
            <h3 id="room-code">Roomcode: {this.state.roomId}</h3>
            <BlackCard bcText={this.state.bcText} />
            <WhiteCards players={this.state.players} />
            <PlayerList players={this.state.players} />
            {this.state.allHaveSubmitted && this.state.allCardsFlipped && this.state.allVoted &&
                <button id="req-card" onClick={this.reqBlackCard.bind(this)}> Request new card </button>
            }
            {this.state.allHaveSubmitted && !this.state.allCardsFlipped &&
                <button id="flip-cards" onClick={this.flipCards.bind(this)}> Flip cards </button>
            }
        </div>
        )
    }
}

export default App
