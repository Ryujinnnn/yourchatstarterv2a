import { Component } from 'react'
import Footer from './Component/Footer/Footer'
import LoginPrompt from './Component/LoginPrompt/LoginPrompt'

class Login extends Component {
    render() {
        return (
            <div className="Login">
                <LoginPrompt/>
                <Footer></Footer>
            </div>
        )
    }
}

export default Login