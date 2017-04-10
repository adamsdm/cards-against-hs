import React, { Component } from 'react'
import BlackCard from './BlackCard'
import WhiteCards from './WhiteCards'
import JoinRoomForm from './JoinRoomForm'
import Submissions from './Submissions'

var _ = require('underscore');

var socket = io.connect();

const initialState = {
    bcText: 'Waiting for next round',
    whiteCards: [],
    selectedCards: [],
    maxWcSelect: 0,
    cardsSubmitted: false,
    inRoom: false,
    username: '',
    roomcode: '',
    othersSubmitted: [],
    inRound: false
    }

class App extends Component {

    constructor(props, context) {
        super(props, context)
        this.state = initialState;
    }
  // Socket management
    componentDidMount() {  
        let that=this;  

        socket.on('update-black-card', this._updateBlackCard.bind(this));
        socket.on('couldnt-join-room', this._couldntJoinRoom.bind(this));
        socket.on('get-white-card', this._getWhiteCard.bind(this));
        socket.on('host-left-room', this._hostLeftRoom.bind(this));
        socket.on('succesfully-joined-room', this._joinedRoom.bind(this));
        socket.on('username-taken', this._usernameTaken.bind(this));
        socket.on('get-submitted', this._getOthersSubmitions.bind(this));
    }


    _getOthersSubmitions(players){
        let othersSubmittions = [];

        for(let i=0; i<players.length; i++){
            
            let submission = {
                uname: players[i].username,
                cards: players[i].submittedCards
            };
            othersSubmittions.push(submission);
        }
        this.setState({othersSubmitted: othersSubmittions});
    }

    _updateBlackCard(text, noPicks){ 
        this.setState({
            bcText: text,
            maxWcSelect: noPicks,
            cardsSubmitted: false,
            selectedCards: [],
            othersSubmitted: [],
            inRound: true
        });

        if(this.state.whiteCards.length<5)
            socket.emit('req-white-card');
    }

    _joinedRoom(){
        alert("Joined room "+this.state.roomcode);
        this.setState({inRoom: true });
    }

    _couldntJoinRoom(){
        alert("Couldn't join room "+this.state.roomcode);
    }

    _getWhiteCard(text){
        this.setState({whiteCards: this.state.whiteCards.concat([text])});
            if(this.state.whiteCards.length < 5)
                socket.emit('req-white-card');
    }

    _hostLeftRoom(){
        alert("Host left the game");
        this.setState(initialState);
        socket.emit('leaveroom'); 
    }

    _usernameTaken(){
        alert("That username is already taken");
    }

    submitCards(data){
        let payload = {
            user: this.state.username,
            data: data
        }
        this.setState( {cardsSubmitted: true } );
        
        // Send payload to server
        socket.emit('submit-cards-from-user', payload);

        //Remove submited cards from hand
        let newCardsOnHand = _.difference(this.state.whiteCards, payload.data);
        this.setState({whiteCards: newCardsOnHand});

    }

    voteOnSubmission(submission){
        // Send to server
        socket.emit('user-voted', submission);
        this.setState({othersSubmitted: []});
    }

    tryJoinRoom(data){
        console.log(data);
        this.setState({
            username: data.username,
            roomcode: data.roomcode
        })
        socket.emit('joinroom', data.username, data.roomcode);
    }

    render() {
        if(!this.state.inRoom){
            return <JoinRoomForm tryJoinRoom={this.tryJoinRoom.bind(this)}/>
        }
        return (
            <div className="container">
                <BlackCard bcText = {this.state.bcText} />
                {!this.state.cardsSubmitted && this.state.whiteCards.length>0 &&
                    <WhiteCards wcards = {this.state.whiteCards} maxSelected = {this.state.maxWcSelect} submit={this.submitCards.bind(this)}/>
                }
                {this.state.cardsSubmitted && this.state.othersSubmitted.length == 0 &&
                    <h3> Waiting for other players... </h3>
                }
                {this.state.othersSubmitted.length>0 && 
                    <Submissions 
                        voteOnSubmission={this.voteOnSubmission.bind(this)} 
                        uname={this.state.username} 
                        inround={this.state.inRound} 
                        submissions={this.state.othersSubmitted}
                    />
                }
            </div>
        )
    }

}

export default App

