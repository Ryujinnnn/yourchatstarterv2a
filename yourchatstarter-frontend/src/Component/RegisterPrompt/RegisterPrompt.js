import { Component } from "react";
import { LoginButton } from "../LoginButton";
import './Style.css'

export class RegisterPrompt extends Component {
    render() {
        return (
            <div>
                <form action="#" method="post">
                    <input type="text" name="email" placeholder="Email"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <input type="password" name="confirm_password" placeholder="Comfirm Password"/>
                    <input type="text" name="email" placeholder="Email"/>
                    <button>Register</button>
                </form>
            </div>
        )
    }
}