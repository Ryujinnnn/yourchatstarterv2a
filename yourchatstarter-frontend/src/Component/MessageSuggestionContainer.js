import { Component } from "react";
import { MessageSuggestion } from "./MessageSuggestion" 

export class MessageSuggestionContainer extends Component {
    constructor(props) {
        super(props)
        //this.onAction = this.props.onSuggestSelection
        this.onAction = this.onAction.bind(this)
    }

    onAction(message) {
        //console.log(message)
        this.props.onSuggestSelection(message)
    }

    render() {
        const style = {
            margin: "10px",
            padding: "0px 15px",
            border: "black solid 1px",
            backgroundColor: "#555555",
            height: "40px",
            overflowX: 'hidden',
            overflowY: 'hidden',

        }

        const messageSuggestionListDisplay = this.props.messageList.map((message) => {
            return (<MessageSuggestion text={message} onAction={this.onAction.bind(null, message)}></MessageSuggestion>)
        })

        return (
            <div style={style}>
                {messageSuggestionListDisplay}
            </div>
        )
    }
}