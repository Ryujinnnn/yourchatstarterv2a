import { Component } from "react";
import './Style.css'

export class RegisterPrompt extends Component {
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
            display: "inline-block",
            float: "left"
        };

        return (
            <div>
                <form action="#" method="post">
                    <input type="text" name="username" placeholder="Username"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <input type="password" name="confirm_password" placeholder="Comfirm Password"/>
                    <input type="text" name="email" placeholder="Email"/>
                    <button type="submit" value="Register" style={style}>Register</button>
                </form>
            </div>
        )
    }
}