import React, { Component } from 'react'
import PropTypes from 'prop-types';

class BlackCard extends Component {
    createMarkup(text) {
        return {__html: text};
    }

    render() {
        return (
        <div>
            <h2 dangerouslySetInnerHTML={this.createMarkup(this.props.bcText)}></h2>
        </div>
        )
    }
}

BlackCard.propTypes = {
    bcText: PropTypes.string
}

export default BlackCard
