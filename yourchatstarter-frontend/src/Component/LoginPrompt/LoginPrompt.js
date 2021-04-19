import { Component } from "react";
import './Style.css'

export class LoginPrompt extends Component {
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
                    <input type="text" name="email" placeholder="Email"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <button type="submit" value="Login" style={style}>Login</button>
                    <a href='/register'><button type="button" style={style}>Register</button></a>
                </form>
            </div>
        )
    }
}