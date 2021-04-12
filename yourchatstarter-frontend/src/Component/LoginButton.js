import { Component } from "react";

export class LoginButton extends Component {
    render() {
        const style = {
            backgroundColor: "#4CAF50",
            border: "solid lightgreen 1px",
            color: "white",
            padding: "12px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "14px",
            margin: "15px",
            //borderRadius: "12px",
            width: "10vw",
            display: "block"
        };
        return (<button style={style}>{this.props.text}</button>);
    }
}
