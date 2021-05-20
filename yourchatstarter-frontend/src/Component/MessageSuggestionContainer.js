import { Component } from "react";
import { MessageSuggestion } from "./MessageSuggestion" 

export class MessageSuggestionContainer extends Component {

    onAction(message, e) {
        //console.log(message)
        //console.dir(message, {depth: null})
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

        let messageSuggestionListDisplay = this.props.messageList.map((message, index) => {
            //console.log([message, index])
            return (<MessageSuggestion key={index} text={message} onAction={e => this.onAction(message, e)}></MessageSuggestion>)
        })

        return (
            <div style={style}>
                {messageSuggestionListDisplay}
            </div>
        )
    }
}