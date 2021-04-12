import { Component } from "react";
import { withRouter } from 'react-router-dom'
import './Style.css'

class Navigation extends Component {
    render() {
        const style = {
            backgroundColor: "pink",
            display: "block",
        };  
        return (
            <div style={style}>
                <ul className="navList">
                    <li>
                        <a href='/chat'>Chat</a>
                    </li>
                    <li>
                        <a href='/subscribe'>Subscribe</a>
                    </li>
                    <li>
                        <a href='/about'>About</a>
                    </li>
                    <li className="login">
                        <a href='/login'>Login</a>
                    </li>
                </ul>   
            </div>
        )
    }
}

export default withRouter(Navigation)