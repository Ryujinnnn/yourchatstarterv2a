import { Component } from "react";
import Footer from "./Component/Footer/Footer";

class BillingHistory extends Component {
    render() {
        return (
            <div>
                <div>
                    <h2>Billing History</h2>
                    <p>This is the billing history</p>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default BillingHistory;