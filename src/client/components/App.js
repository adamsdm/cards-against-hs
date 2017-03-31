import React, { Component } from 'react'
import BlackCard from './BlackCard'
import WhiteCards from './WhiteCards'

var socket = io.connect();
//var username = prompt("Enter username");
//var roomcode = prompt("Enter room code");

var roomcode = "oas0";
var username = "Adam";

socket.emit('joinroom', username, roomcode);

class App extends Component {
    constructor(props, context) {
    super(props, context)
    this.state = {
      bcText: 'Waiting for next round',
      whiteCards: []
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

    render() {
        return (
            <div className="container">
                <BlackCard bcText = {this.state.bcText} />
                <WhiteCards wcards = {this.state.whiteCards} />
            </div>
        )
    }

}

export default App

