import React, { Component } from 'react'

class BlackCard extends Component {
    createMarkup(text) {
        return {__html: text};
    }

    render() {
        return (
        <div>
            <h2 className="bcText" dangerouslySetInnerHTML={this.createMarkup(this.props.bcText)}></h2>
        </div>
        )
    }
}

export default BlackCard
