import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
import { Footer, Header } from '../Component'

export class BillingFailure extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <div>
                    <h2>Thanh toán thất bại</h2>
                    <p>Có gì đó bất thường đã xảy ra trong quá trình? Bạn có thể liên lạc chúng tôi</p>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}