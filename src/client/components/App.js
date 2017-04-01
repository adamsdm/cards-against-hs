import React, { Component } from 'react'
import BlackCard from './BlackCard'
import WhiteCards from './WhiteCards'
import JoinRoomForm from'./JoinRoomForm'

var _ = require('underscore');

var socket = io.connect();

class App extends Component {
    constructor(props, context) {
    super(props, context)
    this.state = {
      bcText: 'Waiting for next round',
      whiteCards: [],
      selectedCards: [],
      maxWcSelect: 0,
      cardsSubmitted: false,
      inRoom: false,
      username: '',
      roomcode: ''
    }

  }
  // Socket management
    componentDidMount() {  
        let that=this;  

        socket.on('update-black-card', this._updateBlackCard.bind(this));
        socket.on('couldnt-join-room', this._couldntJoinRoom.bind(this));
        socket.on('get-white-card', this._getWhiteCard.bind(this));
        socket.on('host-left-room', this._hostLeftRoom);
        socket.on('succesfully-joined-room', this._joinedRoom.bind(this));
    }

    _updateBlackCard(text, noPicks){ 
        this.setState({
            bcText: text,
            maxWcSelect: noPicks,
            cardsSubmitted: false,
            selectedCards: []
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
        socket.emit('leaveroom', username); 
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
                {!this.state.cardsSubmitted && this.state.bcText != "Thanks for playing!" && this.state.whiteCards.length>0 &&
                    <WhiteCards wcards = {this.state.whiteCards} maxSelected = {this.state.maxWcSelect} submit={this.submitCards.bind(this)}/>
                }
                {this.state.cardsSubmitted &&
                    <h3> Waiting for next round... </h3>
                }
            </div>
        )
    }

}

export default App

