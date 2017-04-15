import React, { Component } from 'react'


const colors = [
			"#FFDC00",
			"#001f3f",
			"#0074D9",
			"#7FDBFF",
			"#39CCCC",
			"#3D9970",
			"#2ECC40",
			"#FF4136",
			"#FF851B"
		];

var headStyle = {};

class Header extends Component {

	componentWillMount(){
		let color = this.props.color || colors[Math.round(Math.random()*(colors.length-1))];

		headStyle = {
			backgroundColor: color
		}

	}

    render() {
        return (
        <div className="head" style={headStyle}>
            {this.props.text &&
                <h4> {this.props.text} </h4>
            }
        </div>
        )
    }
}

export default Header
