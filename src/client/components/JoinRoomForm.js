import React, { Component } from 'react'
import Header from './Header'

require('../scss/joinroomform.scss');

class JoinRoomForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            roomcode: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    }

    handleSubmit(event) {
        this.props.tryJoinRoom(this.state);
        event.preventDefault();
    }


    render() {
        return (
            <div>
                <div className="container">
                    <h3> Join room </h3>
                    <form onSubmit={this.handleSubmit} className="joinRoomForm">   
                        <input type="text" value={this.state.username} onChange={this.handleChange.bind(this, 'username')} placeholder="Username"/><br/>
                        <input type="text" value={this.state.roomcode} onChange={this.handleChange.bind(this, 'roomcode')} placeholder="Roomcode"/><br/>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        )
    }

}



export default JoinRoomForm
