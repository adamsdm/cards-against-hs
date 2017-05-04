import React, { Component } from 'react'
import PropTypes from 'prop-types';

require('../scss/blackcard.scss');

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

BlackCard.propTypes = {
    bcText: PropTypes.string
}

export default BlackCard
