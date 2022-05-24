import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
// import PaymentInfoPrompt from "./Component/PaymentInfoPrompt/PaymentInfoPrompt"
import { withRouter } from 'react-router-dom'
import { Footer, Header, PaymentInfoPrompt } from '../Component'
import { CSSTransition } from 'react-transition-group';

class _PaymentInfo extends Component {
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
        console.log(this.props)
        return (
            <div>
                <Header></Header>
                <CSSTransition in={this.state.show} timeout={2000} classNames="about-screen">
                    <PaymentInfoPrompt plan={this.props.location.state.plan}></PaymentInfoPrompt>
                </CSSTransition>
                <Footer></Footer>
            </div>
        )
    }
}

export const PaymentInfo = withRouter(_PaymentInfo)