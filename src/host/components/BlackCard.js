import React, { Component } from 'react'

class BlackCard extends Component {
    createMarkup(text) {
        return {__html: text};
    }

    render() {
        return (
        <div>
            <h1 className="bcText" dangerouslySetInnerHTML={this.createMarkup(this.props.bcText)}></h1>
        </div>
        )
    }
}

export default BlackCard
