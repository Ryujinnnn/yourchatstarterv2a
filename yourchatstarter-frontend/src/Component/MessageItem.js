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
        let text = this.props.text
        let hyperlink_match = text.match(/\[(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?.*\/]/g)
        let hyperlink_element = <div></div>
        if (hyperlink_match) {
            let hyperlink_match_entry = hyperlink_match[0]
            let comp = hyperlink_match_entry.split(" - ")
            let ref_link = comp[0].replace('[', "").trim()
            let ref_text = comp[1].replace('/]', "").trim()
            hyperlink_element = <a href={ref_link} style={{color: 'black', backgroundColor: '#44ff44', padding: 5}}>{ref_text}</a>
        }
        text = text.replace(/\[(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?.*\/]/g, "")
        return (
            <div style={style}>
                <p className="message">{text}{hyperlink_element}</p>
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