import React, { Component } from 'react'

class WhiteCards extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            selectedCards: []
        }

    }
    renderWhiteCards() {
        return this.props.wcards.map((card, i) => {
            return (
                <Wcard text={card}/>
            );
        }, this);
    }

    handleSelect(card) {
        console.log(card);
    }

    render() {
        return (
            <table className="whiteCardTable">
                {this.renderWhiteCards()}
            </table>
        )
    }
}

class Wcard extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            selected: false,
            selectInd: ''
        }
    }

    handleSelect(){
        var isSelected = this.state.selected;
        if(isSelected){
          this.setState({selected: false});
          this.setState({selectInd: ''});
        } else {
           this.setState({selected: true});
           this.setState({selectInd: '1'});
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
