import { Component } from "react";
import './MessageItem.css'

export class MessageItem extends Component {
    render() {
        const isFromClient = this.props.isFromClient;
        const message = this.props.text;
        if (isFromClient) {
            return <ClientMessage text={message}/>
        }
        else return <ServerMessage text={message}/>
    }
}

class ServerMessage extends Component {
    render() {
        const style = {
            margin: "10px",
            display: "block",
            position: "relative",
            textAlign: "left",
            clear: "both"
        }
        return (
            <div style={style}>
                <p className="message">{this.props.text}</p>
            </div>
        )
    }
}

class ClientMessage extends Component {
    render() {
        const style = {
            margin: "10px",
            display: "block",
            position: "relative",
            textAlign: "left",
            float: "right",
            clear: "both"
        }
        return (
            <div style={style}>
                <p className="message messageOpponent">{this.props.text}</p>
            </div>
        )
    }
}