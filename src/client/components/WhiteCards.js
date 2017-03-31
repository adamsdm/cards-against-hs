import React, { Component } from 'react'
import Wcard from './Wcard'

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
        let _noSelected = this.state.noSelected; 
        if(isInc){
            _noSelected++;
            this.setState({noSelected: _noSelected});
            this.state.selectedCards[data.ind] = data.text;
        } 
        else{ 
            _noSelected--;
            this.setState({noSelected: _noSelected});
            this.state.selectedCards[data.ind] = '';
        }
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
    }

    render() {

        return (
            <div>
                <p> Select: {this.props.maxSelected} </p>
                <table className="whiteCardTable">
                    {this.renderWhiteCards()}
                </table>

                {this.state.noSelected == this.props.maxSelected &&
                    <button onClick={() => this.sendWC()}> Submit </button>
                }
            </div>
        )
    }
}


export default WhiteCards
