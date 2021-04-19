import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import { PaymentInfoPrompt } from "./Component/PaymentInfoPrompt/PaymentInfoPrompt"

class Register extends Component {
    render() {
        return (
            <div>
                <PaymentInfoPrompt></PaymentInfoPrompt>
                <Footer></Footer>
            </div>
        )
    }
}

export default Register