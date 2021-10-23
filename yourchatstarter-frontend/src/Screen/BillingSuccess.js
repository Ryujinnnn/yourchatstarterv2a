import { Component } from "react";
// import Footer from "./Component/Footer/Footer";
import { Footer, Header } from '../Component'

export class BillingSuccess extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <div>
                    <h2>Thanh toán hoàn tất</h2>
                    <p>Cảm ơn các bạn đã ủng hộ chúng tôi. Hãy tận hưởng trải nghiệm mới ngay bây giờ</p>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}