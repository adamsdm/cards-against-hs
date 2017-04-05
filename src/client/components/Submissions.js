import React, { Component } from 'react'

class Submissions extends Component {

    handleSelect(user){
        this.props.voteOnSubmission(user);
    }

    renderSubmissions(){
        return this.props.submissions.map((user, i) => {
            return (
                <div className="submission" key={i} onClick={() => this.handleSelect(user)}>
                    <h4>{user.cards}</h4>
                </div>
            );
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
