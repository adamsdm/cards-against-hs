import React, { Component } from 'react'
import BlackCard from './BlackCard'
import WhiteCards from './WhiteCards'

var socket = io.connect();
//var username = prompt("Enter username");
//var roomcode = prompt("Enter room code");

var roomcode = "wjmq";
var username = "Adam";

socket.emit('joinroom', username, roomcode);

class App extends Component {
    constructor(props, context) {
    super(props, context)
    this.state = {
      bcText: 'Waiting for next round',
      whiteCards: [],
      selectedCards: [],
      maxWcSelect: 0,
      cardsSubmitted: false
    }

  }
  // Socket management
    componentDidMount() {  
        let that=this;  

        socket.on('update-black-card', this._updateBlackCard.bind(this));
        socket.on('couldnt-join-room', this._couldntJoinRoom.bind(this));
        socket.on('get-white-card', this._getWhiteCard.bind(this));
        socket.on('host-left-room', this._hostLeftRoom);
    }

    _updateBlackCard(text, noPicks){ 
        this.setState({bcText: text});
        this.setState({maxWcSelect: noPicks});
        this.setState( {cardsSubmitted: false} );

        if(this.state.whiteCards.length<5)
            socket.emit('req-white-card');
    }

    _couldntJoinRoom(){
        this.setState({bcText: "Couldn't join room "+roomcode});
    }

    _getWhiteCard(text){
        this.setState({whiteCards: this.state.whiteCards.concat([text])});
            console.log(this.state.whiteCards);

            if(this.state.whiteCards.length < 5)
                socket.emit('req-white-card');
    }

    _hostLeftRoom(){
        alert("Host left the game");
        socket.emit('leaveroom', username); 
    }

    submitCards(data){
        let payload = {
            user: username,
            data: data
        }
        //this.setState( {cardsSubmitted: true } );
        console.log(payload.user, payload.data);
    }

    render() {
        return (
            <div className="container">
                <BlackCard bcText = {this.state.bcText} />
                {!this.state.cardsSubmitted &&
                    <WhiteCards wcards = {this.state.whiteCards} maxSelected = {this.state.maxWcSelect} submit={this.submitCards.bind(this)}/>
                }
            </div>
        )
    }

}

export default App

