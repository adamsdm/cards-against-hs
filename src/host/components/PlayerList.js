import React, { Component } from 'react'

class PlayerList extends Component {
    renderPlayers(){
        console.log(this.props.players);
        return this.props.players.map((player, i) => {
            if(player.username !== 'HOST'){
                return (
                    <td align="center"> 
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
