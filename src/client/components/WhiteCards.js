import React, { Component } from 'react'
import Wcard from './Wcard'
var _ = require('underscore');

class WhiteCards extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            selectedCards: [],
            noSelected: 0,
            cardsSubmitted: false
        }

    }

    addOrRemSelected(isInc, data){
        this.state.selectedCards = _.compact(this.state.selectedCards);
        let _noSelected = this.state.noSelected; 
        if(isInc){
            _noSelected++;
            this.state.selectedCards[data.ind-1] = data.text;
        } 
        else{ 
            _noSelected--;
            this.state.selectedCards[data.ind] = '';
        }
        
        this.setState({noSelected: _noSelected});
    }

    renderWhiteCards() {
        return this.props.wcards.map((card, i) => {
            return (
                <Wcard 
                    key={i} 
                    text={card}
                    noSelected={this.state.noSelected}
                    maxSelected={this.props.maxSelected}
                    addOrRemSelected={this.addOrRemSelected.bind(this)

                }/>
            );
        }, this);
    }

    sendWC(){
        this.props.submit(this.state.selectedCards);
        this.setState({cardsSubmitted: true});
        this.setState({noSelected: 0});
        this.setState({selectedCards: []});
    }

    render() {

        return (
            <div>
                {this.props.maxSelected - this.state.noSelected >0 &&
                    <p> Select: {this.props.maxSelected - this.state.noSelected} </p>
                }
                <table className="whiteCardTable">
                    <tbody>
                        {this.renderWhiteCards()}
                    </tbody>
                </table>

                {this.state.noSelected == this.props.maxSelected &&
                    <button onClick={() => this.sendWC()}> Submit </button>
                }
            </div>
        )
    }
}


export default WhiteCards
