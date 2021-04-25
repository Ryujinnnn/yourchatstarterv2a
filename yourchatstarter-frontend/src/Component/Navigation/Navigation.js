import { Component } from "react";
import { withRouter } from 'react-router-dom'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import './Style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

async function verifyToken(credentials) {
    return fetch('api/auth/verify_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}
class Navigation extends Component {

    
    async componentDidMount() {
        if (sessionStorage.getItem('token')) {
            const token_result = await verifyToken({
                token: sessionStorage.getItem("token")
            });
            if (token_result.status !== "success") {
                alert("Your token is expired/invalid, please login again")
                sessionStorage.removeItem('token')
                this.props.history.push('/login')
            }
        }
    }

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
                        <a href='/subscribe'>Dịch vụ</a>
                    </li>
                    <li>
                        <a href='/about'>Thông tin</a>
                    </li>
                    <li className="account-dropdown">
                        <button className="dropbtn">Tài khoản của tôi &nbsp;<FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>  </button>
                       
                        <div className="dropdown-content">
                            <a href="/history">Lịch sử thanh toán</a>
                            <a href="#">Hồ sơ</a>
                            <a href="/logout" onClick={() => {console.log("logging out"); sessionStorage.removeItem('token')}}>Đăng xuất</a>
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
                        <a href='/subscribe'>Dịch vụ</a>
                    </li>
                    <li>
                        <a href='/about'>Thông tin</a>
                    </li>
                    <li className="login">
                        <a href='/login'>Đăng nhập</a>
                    </li>
                </ul>   
            </div>
        )
    }
}

export default withRouter(Navigation)