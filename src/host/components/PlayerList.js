import React, { Component } from 'react'

class PlayerList extends Component {
    decideImg(player){
        console.log(player);
        if(player.submittedCards.length > 0)
            return "images/user-icon-submitted.png";
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
                        {player.username}
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

export default PlayerList
