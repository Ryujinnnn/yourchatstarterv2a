import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import PaymentInfoPrompt from "./Component/PaymentInfoPrompt/PaymentInfoPrompt"
import { withRouter } from 'react-router-dom'

class Register extends Component {
    render() {
        console.log(this.props)
        return (
            <div>
                <PaymentInfoPrompt plan={this.props.location.state.plan}></PaymentInfoPrompt>
                <Footer></Footer>
            </div>
        )
    }
}

export default withRouter(Register)