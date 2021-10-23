import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
// import PaymentInfoPrompt from "./Component/PaymentInfoPrompt/PaymentInfoPrompt"
import { withRouter } from 'react-router-dom'
import { Footer, Header, PaymentInfoPrompt } from '../Component'

class _PaymentInfo extends Component {
    render() {
        console.log(this.props)
        return (
            <div>
                <Header></Header>
                <PaymentInfoPrompt plan={this.props.location.state.plan}></PaymentInfoPrompt>
                <Footer></Footer>
            </div>
        )
    }
}

export const PaymentInfo = withRouter(_PaymentInfo)