import React, { Component } from 'react'

class Submissions extends Component {

    handleSelect(user){
        this.props.voteOnSubmission(user);
    }

    renderSubmissions(){
        return this.props.submissions.map((user, i) => {
            if(user.cards.length > 0 && user.uname != this.props.uname && this.props.inround){    
                return (
                    <div className="submission" key={i} onClick={() => this.handleSelect(user)}>
                        <h4>{user.cards}</h4>
                    </div>
                );
            }
        });
    }

    render() {
        return (
            <div>
                {this.renderSubmissions()}
            </div>
        )
    }
}

export default Submissions
