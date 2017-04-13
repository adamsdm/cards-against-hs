import React, { Component } from 'react'

class Header extends Component {
    render() {
        return (
        <div className="head">
            {this.props.roomcode &&
                <h2> In room: {this.props.roomcode} </h2>
            }
        </div>
        )
    }
}

export default Header
