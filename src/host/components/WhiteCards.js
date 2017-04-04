import React, { Component } from 'react'

class WhiteCards extends Component {


    renderSubmitted(player){
        const nameStyle = {
          color: 'red',
          position: 'absolute',
          textAlign: 'right',
          margin: '10px',
          right: '0px',
          bottom: '0'
        };

        return(
            <div className="flipper">
                <div className="front">
                    <h2 style={{margin:'10px', fontWeight: 'bold'}}>
                        Cards<br /> 
                        Against<br /> 
                        Humanity <br />
                    </h2>
                </div>
                <div className="back">
                    {this.renderText(player)}
                    <p style={nameStyle}> {player.username} </p>
                </div>
            </div>
        )
 
    }
    renderText(player){
        return player.submittedCards.map((text, i) => {
            return(
                <div className="white-card-text">
                    {text} 
                    <br/>
                    <br/>
                </div>
            )
        })
    }

    renderWhiteCards(){
        // For each of the players
        return this.props.players.map((player, i) => {
            // ignore host
            if(player.username !== 'HOST' && player.inRound && player.submittedCards.length > 0){
                return (
                    <td key={i}> 
                        <div className="flip-container not-flipped" key={i}>
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
