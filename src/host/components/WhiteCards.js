import React, { Component } from 'react'
import PropTypes from 'prop-types';

require('../scss/whitecards.scss');

class WhiteCards extends Component {
    createMarkup(text) {
        return {__html: text};
    }

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
                    <h2 className="front-text">
                        Cards<br /> 
                        Against<br /> 
                        Homo <br />
                        Sapiens <br />
                    </h2>
                </div>
                <div className="back">
                    {this.renderText(player)}
                </div>
            </div>
        )
 
    }
    renderText(player){
        return player.submittedCards.map((text, i) => {
            return(
                <div className="back-text" key={i} dangerouslySetInnerHTML={this.createMarkup(text+'<br/><br/>')}></div>
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

WhiteCards.propTypes = {
    players: PropTypes.array
}

export default WhiteCards
