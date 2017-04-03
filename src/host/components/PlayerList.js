import React, { Component } from 'react'

class PlayerList extends Component {
    renderPlayers(){
        console.log(this.props.players);
        return this.props.players.map((player, i) => {
            console.log(player.submittedCards.length);
            if(player.username !== 'HOST'){
                return (
                    <td key={i} className={(player.submittedCards.length > 0 ? 'submitted' : '')}> 
                        <img src="images/user-icon.png" height="64px"/><br />
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