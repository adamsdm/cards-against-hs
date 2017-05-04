import React, { Component } from 'react'
import PropTypes from 'prop-types';

require('../scss/head.scss');

const colors = [
			"#1abc9c",
			"#3498db",
			"#8e44ad",
			"#c0392b",
			"#9b59b6",
			"#2c3e50",
			"#95a5a6",
			"#f39c12",
		];

var headStyle = {};

class Header extends Component {

    render() {
		// Generate a random color from 'colors'
		let color = this.props.color || colors[Math.round(Math.random()*(colors.length-1))];
		
		headStyle = {
			backgroundColor: color
		}

        return (
        <div className="head" style={headStyle}>
            {this.props.text &&
                <h4> {this.props.text} </h4>
            }
        </div>
        )
    }
}

Header.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string
}

export default Header
