import React, { Component } from 'react'
import PropTypes from 'prop-types';

require('../scss/playerlist.scss');

class PlayerList extends Component {
    decideImg(player){
        if(player.submittedCards.length > 0)
            //return "images/user-icon-submitted.png";
            return "images/user-icon.png"
        else if(!player.inRound){
            return "images/user-icon-waiting.png";
        }
        return "images/user-icon.png"
    }

    renderPlayers(){
        // For each of the players
        return this.props.players.map((player, i) => {
            // ignore host
            if(player.username !== 'HOST'){
                return (
                    <td key={i}> 
                        <img src={this.decideImg(player)} height="64px"/><br/>
                        {player.username} <br />
                        Score: {player.score}
                    </td>
                );
            }
        }, this);
    }
    render() {
        return (
        <div className="table-container">
            <table id="playerList">
                <tbody>
                    <tr>
                        {this.renderPlayers()}
                    </tr>
                </tbody>
            </table>
        </div>
        )
    }
}

PlayerList.propTypes = {
    players: PropTypes.array
}

export default PlayerList
