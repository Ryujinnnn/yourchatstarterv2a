import { Component } from "react";
import { MessageItem } from "../index"

export class MessageContainer extends Component {
    componentDidMount() {
        this.scrollToBottom();
      }
    componentDidUpdate() {
        this.scrollToBottom()
    }
    scrollToBottom = () => {
        this.el.scrollBy({
            top: this.el.scrollHeight,
            left: 0,
            behavior: 'smooth'
        })
    }

    render() {
        //console.log('container rendering')
        const style = {
            margin: "10px",
            padding: "10px 10px 20px 10px",
            border: "black solid 1px",
            backgroundColor: "#1A1D24",
            height: "60vh",
            overflowY: 'scroll',
            borderRadius: '10px'
        }

        const messageListDisplay = this.props.messageList.map((message, index) => {
            return (<MessageItem key={index} text={message.text} isFromClient={message.isFromClient} additionalAction={message.additionalAction}></MessageItem>)
        })

        return (
            <div style={style} ref={el => { this.el = el; }} >
                {messageListDisplay}
            </div>
        )
    }   
}