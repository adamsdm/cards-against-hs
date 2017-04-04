import React, { Component } from 'react'

class WhiteCards extends Component {
    decideImg(player){

        if(player.submittedCards.length > 0)
            return "images/user-icon-submitted.png";
        else if(!player.inRound){
            return "images/user-icon-waiting.png";
        }
        return "images/user-icon.png"
    }

    renderSubmitted(player){
        const indStyle = {
          color: 'black',
          fontSize: '22px'
        };

        return player.submittedCards.map((text, i) => {
            return(
                <div className="white-card-text">
                    {text}
                    <br />
                    <br />
                </div>
            )
        }, this)
    }

    renderWhiteCards(){
        // For each of the players
        return this.props.players.map((player, i) => {
            // ignore host
            if(player.username !== 'HOST' && player.inRound && player.submittedCards.length > 0){
                return (
                    <td key={i}> 
                        <div className ="white-card">
                            {this.renderSubmitted(player)}
                        </div>
                    </td>
                );
            }
        }, this);
    }
    render() {
        return (
        <div className="wc-container">
            <table id="playerList">
                <tbody>
                    <tr>
                        {this.renderWhiteCards()}
                    </tr>
                </tbody>
            </table>
        </div>
        )
    }
}

export default WhiteCards
