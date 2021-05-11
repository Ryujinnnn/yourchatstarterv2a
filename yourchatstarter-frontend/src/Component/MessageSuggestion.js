import { Component } from "react";

export class MessageSuggestion extends Component {
    constructor(props) {
        super(props)
        this.onClickHandler = this.props.onAction
    }

    onClickHandler() {
        console.log("default handler")
    }

    render() {
        const style = {
            backgroundColor: "#333333",
            border: "solid white 1px",
            color: "white",
            padding: "5px 15px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "14px",
            margin: "4px 2px",
            borderRadius: "12px",
            height: '30px',
            float: 'left',
            display: "inline-block",
        };
        
        return (<button style={style} onClick={this.onClickHandler}>{this.props.text}</button>);
    }
}