import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
// import RegisterPrompt from "./Component/RegisterPrompt/RegisterPrompt";
import { RegisterPrompt, Footer, Header } from '../Component'
import { CSSTransition } from 'react-transition-group';

export class Register extends Component {
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
            <div>
                <Header></Header>
                <CSSTransition in={this.state.show} timeout={2000} classNames="about-screen">
                    <RegisterPrompt></RegisterPrompt>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}