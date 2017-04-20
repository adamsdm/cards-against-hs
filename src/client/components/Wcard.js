import React, { Component } from 'react'
require('../scss/wcard.scss');

class Wcard extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            selected: false,
            selectInd: '',
        }
    }

    handleSelect(){
        var isSelected = this.state.selected;

        let data = {};

        // Unselect
        if(isSelected){
            this.setState({selected: false});
            this.setState({selectInd: ''});

            data.text = this.props.text;
            data.ind = this.state.selectInd;

            this.props.addOrRemSelected(false, data);
        // Select
        } else {
            // Ensure max noCards aren't selected
            if(this.props.noSelected < this.props.maxSelected){
                
                this.setState({selected: true});
                this.setState({selectInd: this.props.noSelected+1});

                data.text = this.props.text;
                data.ind = this.props.noSelected+1;

                this.props.addOrRemSelected(true, data);
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

export default Wcard