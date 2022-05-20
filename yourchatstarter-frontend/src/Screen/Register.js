import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
// import RegisterPrompt from "./Component/RegisterPrompt/RegisterPrompt";
import { RegisterPrompt, Footer, Header } from '../Component'

export class Register extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <RegisterPrompt></RegisterPrompt>
                <Footer></Footer>
            </div>
        )
    }
}