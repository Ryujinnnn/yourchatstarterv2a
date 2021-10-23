import { Component } from 'react'
// import Footer from './Component/Footer/Footer'
// import LoginPrompt from './Component/LoginPrompt/LoginPrompt'
import { LoginPrompt, Footer, Header } from '../Component'

export class Login extends Component {
    render() {
        return (
            <div className="Login">
                <Header></Header>
                <LoginPrompt/>
                <Footer></Footer>
            </div>
        )
    }
}