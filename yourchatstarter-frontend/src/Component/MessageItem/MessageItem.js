import { Component } from "react";
import { Button, Icon } from "rsuite";
import MarkdownView from 'react-showdown';
import './MessageItem.css'
import L from 'leaflet'
import { v4 as uuidv4 } from 'uuid';

export class MessageItem extends Component {
    render() {
        const isFromClient = this.props.isFromClient;
        const additionalAction = this.props.additionalAction;
        const message = this.props.text;
        if (isFromClient) {
            return <ClientMessage text={message}/>
        }
        else return <ServerMessage text={message} additionalAction={additionalAction}/>
    }
}

class ServerMessage extends Component {

    constructor(props) {
        super(props)
        this.mapData = null
        if (this.props.additionalAction) {
            const action = this.props.additionalAction
            if (action.name === "SHOW_MAP") {
                this.map_id = uuidv4()
                this.mapData = {
                    coord: action.coord
                }
            }
        }
    }

    componentDidMount() {
        if (this.mapData) {
            this.map = L.map(this.map_id, {
                center: this.mapData.coord,
                zoom: 16,
                layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
                ]
            });
        }
    }

    render() {
        const style = {
            margin: "10px",
            display: "block",
            position: "relative",
            textAlign: "left",
            clear: "both"
        }
        let text = this.props.text
        const mapData = this.mapData || null

        // let hyperlink_match = text.match(/\[(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?.*\/]/g)
        // let hyperlink_element = <p></p>
        // if (hyperlink_match) {
        //     let hyperlink_match_entry = hyperlink_match[0]
        //     let comp = hyperlink_match_entry.split(" - ")
        //     let ref_link = comp[0].replace('[', "").trim()
        //     let ref_text = comp[1].replace('/]', "").trim()
        //     hyperlink_element = <a href={ref_link} style={{color: 'black', backgroundColor: '#44ff44', padding: 5}}>{ref_text}</a>
        // }
        // text = text.replace(/\[(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?.*\/]/g, "")
        return (
            <div style={style} className="message">
                {/* <p className="message">{text}{hyperlink_element}</p> */}
                <MarkdownView markdown={text}></MarkdownView>
                {/* <Icon icon="speaker" }/> */}
                { mapData && <div class="map" id={this.map_id}></div> }
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
            <div style={style} className="message messageOpponent">
                <p>{this.props.text}</p>
                {/* <Icon icon="speaker" onClick={this.props.speak(this.props.text)}/> */}
            </div>
        )
    }
}