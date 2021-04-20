import { Component } from "react";

export class MessageBox extends Component {
    constructor(props) {
        super(props)
        this.onContentChange = this.props.onChange
        this.handleKeyDown = this.props.handleKeyDown
    }

    onContentChange(value) {

    }

    handleKeyDown(event) {

    }
    
    render() {
        const style = {
            padding: "12px",
            textAlign: "left",
            textDecoration: "none",
            border: "solid black 1px",
            display: "inline-block",
            fontSize: "14px",
            margin: "4px 2px",
            //borderRadius: "12px",
            width: "85vw",
            backgroundColor: "#e29ae2"
        }
        return (
            <input name="message" type="text" style={style}  onChange={e => this.onContentChange(e.target.value)} value={this.props.text} onKeyDown={this.handleKeyDown}></input>
        )
    }
}