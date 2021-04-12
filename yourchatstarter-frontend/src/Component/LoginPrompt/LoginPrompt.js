import { Component } from "react";
import { LoginButton } from "../LoginButton";
import './Style.css'

export class LoginPrompt extends Component {
    render() {
        return (
            <div>
                <form action="#" method="post">
                    <input type="text" name="email" placeholder="Email"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <LoginButton text="Login" className="login-button"></LoginButton>
                </form>
            </div>
        )
    }
}