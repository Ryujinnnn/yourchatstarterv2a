import { Component } from "react";
import Footer from "./Component/Footer/Footer";

class BillingHistory extends Component {
    render() {
        return (
            <div>
                <div>
                    <h2>Lịch sử thanh toán</h2>
                    <p>Đây là lịch sử thanh toán</p>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default BillingHistory;