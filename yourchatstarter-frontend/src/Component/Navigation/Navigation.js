import { Component } from "react";
import { withRouter } from 'react-router-dom'
import './Style.css'
import { Navbar, Nav, Dropdown, Icon} from 'rsuite'

async function verifyToken(credentials) {
    return fetch('api/auth/verify_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}
class _Navigation extends Component {

    
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
        if (sessionStorage.getItem("token")) {
            return (
                <Navbar>
                    <Navbar.Header classPrefix='brand-logo'>
                        <a href="/"><img src="logo200.png" alt="YourChatStarter" height='50' style={{marginBottom: 10, marginTop: 15, marginLeft: 5}}></img></a>
                    </Navbar.Header> 
                    <Navbar.Body>
                        <Nav>
                            <a href="/chat"><Nav.Item icon={<Icon icon="comments" />} >Chat</Nav.Item></a>
                            <a href="/subscribe"><Nav.Item>Dịch vụ</Nav.Item></a>
                            <Dropdown title="Thông tin">
                                <a href="/about"><Dropdown.Item>Nhà phát triển</Dropdown.Item></a>
                                <a href="/function"><Dropdown.Item>Chức năng</Dropdown.Item></a>
                                <a href="/blog"><Dropdown.Item>Blog</Dropdown.Item></a>
                            </Dropdown>
                        </Nav>
                        <Nav pullRight>
                            <Dropdown title="Tài khoản của tôi">
                                <a href="/history"><Dropdown.Item>Lịch sử thanh toán</Dropdown.Item></a>
                                <a href="/profile"><Dropdown.Item>Hồ sơ</Dropdown.Item></a>
                                <a href="/logout" onClick={() => {console.log("logging out"); sessionStorage.removeItem('token')}}><Dropdown.Item>Đăng xuất</Dropdown.Item></a>
                            </Dropdown>
                        </Nav>
                    </Navbar.Body>
                </Navbar>
            )
        }
        return (
            <Navbar>
                <Navbar.Header classPrefix='brand-logo'>
                    <a href="/"><img src="logo200.png" alt="YourChatStarter" height='50' style={{marginBottom: 10, marginTop: 15, marginLeft: 5}}></img></a>
                </Navbar.Header> 
                <Navbar.Body>
                    <Nav>
                        <a href="/chat"><Nav.Item icon={<Icon icon="comments" />} >Chat</Nav.Item></a>
                        <a href="/subscribe"><Nav.Item>Dịch vụ</Nav.Item></a>
                        <Dropdown title="Thông tin">
                            <a href="/about"><Dropdown.Item>Nhà phát triển</Dropdown.Item></a>
                            <a href="/function"><Dropdown.Item>Chức năng</Dropdown.Item></a>
                            <a href="/blog"><Dropdown.Item>Blog</Dropdown.Item></a>
                        </Dropdown>
                    </Nav>
                    <Nav pullRight>
                        <a href="/login"><Nav.Item icon={<Icon icon="sign-in" />} >Đăng nhập</Nav.Item></a>
                    </Nav>
                </Navbar.Body>
          </Navbar>
        )
    }
}

export const Navigation = withRouter(_Navigation)