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
            margin: "0px 10px 10px",
            //borderRadius: "12px",
            width: "10vw",
            minWidth: 100,
            display: "inline-block",
            float: "right"
        };
        return (<button style={style} onClick={this.onClickHandler}>{this.props.text}</button>);
    }
}