import React, { Component } from 'react'

class WhiteCards extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            selectedCards: [],
            noSelected: 0,
        }

    }

    incOrDecSelected(isInc){
        let _noSelected = this.state.noSelected; 
        if(isInc){
            _noSelected++;
            this.setState({noSelected: _noSelected});
        } 
        else{ 
            _noSelected--;
            this.setState({noSelected: _noSelected});
        }
        console.log(this.state);
    }

    renderWhiteCards() {
        return this.props.wcards.map((card, i) => {
            return (
                <Wcard 
                    key={i} 
                    text={card}
                    noSelected={this.state.noSelected}
                    maxSelected={this.props.maxSelected}
                    incOrDecSelected={this.incOrDecSelected.bind(this)

                }/>
            );
        }, this);
    }


    render() {

        if(this.state.noSelected == this.props.maxSelected){
            console.log("Rendering");
            return (
                <div>
                    <p> Select: {this.props.maxSelected} </p>
                    <table className="whiteCardTable">
                        {this.renderWhiteCards()}
                    </table>
                    <button> Submit </button>
                </div>
            )       
        }
        return (
            <div>
                <p> Select: {this.props.maxSelected} </p>
                <table className="whiteCardTable">
                    {this.renderWhiteCards()}
                </table>
            </div>
        )
    }
}

class Wcard extends Component {
    constructor(props, context) {
        console.log("Creating white card");
        super(props, context)
        this.state = {
            selected: false,
            selectInd: '',
        }
    }

    handleSelect(){
        var isSelected = this.state.selected;
        // Unselect
        if(isSelected){
            this.props.incOrDecSelected(false);
            this.setState({selected: false});
            this.setState({selectInd: ''});
        // Select
        } else {

            // Ensure max noCards aren't selected
            if(this.props.noSelected < this.props.maxSelected){
                this.props.incOrDecSelected(true);
                this.setState({selected: true});
                this.setState({selectInd: '1'});
            }
        }
    }

    render(){
        return(
            <tr onClick={() => this.handleSelect()} className={this.state.selected? 'selected':''}> 
                <td>{this.state.selectInd}</td> 
                <td>{this.props.text}</td> 
            </tr>
        )
    }
}

export default WhiteCards
