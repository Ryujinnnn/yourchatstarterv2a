import { Component } from "react";

export class SendButton extends Component {
    constructor(props) {
        super(props)
        this.onClickHandler = this.props.onAction
    }

    onClickHandler() {
        console.log("default handler")
    }

    render() {
        const style = {
            backgroundColor: "#4CAF50",
            border: "solid lightgreen 1px",
            color: "white",
            padding: "12px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "14px",
            margin: "4px 2px",
            //borderRadius: "12px",
            width: "10vw",
            display: "inline-block"
        };
        return (<button style={style} onClick={this.onClickHandler}>{this.props.text}</button>);
    }
}