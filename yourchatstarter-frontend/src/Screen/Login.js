import { Component } from 'react'
// import Footer from './Component/Footer/Footer'
// import LoginPrompt from './Component/LoginPrompt/LoginPrompt'
import { LoginPrompt, Footer, Header } from '../Component'
import { CSSTransition } from 'react-transition-group';

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        };
    }
    componentDidMount() {
        this.setState({
            show: true
        })
    }

    render() {
        return (
            <div className="Login">
                <Header></Header>
                <CSSTransition in={this.state.show} timeout={2000} classNames="about-screen">
                    <LoginPrompt/>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}