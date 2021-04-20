import { Component } from "react";
import { withRouter } from 'react-router-dom'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import './Style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Navigation extends Component {
    render() {
        const style = {
            backgroundColor: "pink",
            display: "block",
        };  
        if (sessionStorage.getItem("token")) {
            return (
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
                    <li className="account-dropdown">
                        <button className="dropbtn">My Account &nbsp;<FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>  </button>
                       
                        <div className="dropdown-content">
                            <a href="/history">History</a>
                            <a href="#">Profile</a>
                            <a href="/logout" onClick={() => {console.log("logging out"); sessionStorage.removeItem('token')}}>Logout</a>
                        </div>
                    </li>
                </ul>
            )
        }
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