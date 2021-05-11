import { Component } from "react";
import { MessageItem } from "./MessageItem"

export class MessageContainer extends Component {
    componentDidMount() {
        this.scrollToBottom();
      }
    componentDidUpdate () {
        this.scrollToBottom()
    }
    scrollToBottom = () => {
        this.el.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }

    render() {
        console.log('container rendering')
        const style = {
            margin: "10px",
            padding: "10px",
            border: "black solid 1px",
            backgroundColor: "#e29ae2",
            height: "60vh",
            overflowY: 'scroll',
        }

        const messageListDisplay = this.props.messageList.map((message) => {
            return (<MessageItem text={message.text} isFromClient={message.isFromClient}></MessageItem>)
        })

        return (
            <div style={style}>
                {messageListDisplay}
                <div ref={el => { this.el = el; }} />
            </div>
        )
    }   
}