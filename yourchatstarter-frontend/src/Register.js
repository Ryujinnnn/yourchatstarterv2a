import { Component } from "react";
import Footer from "./Component/Footer/Footer";
import RegisterPrompt from "./Component/RegisterPrompt/RegisterPrompt";

class Register extends Component {
    render() {
        return (
            <div>
                <RegisterPrompt></RegisterPrompt>
                <Footer></Footer>
            </div>
        )
    }
}

export default Register